import { GoogleGenAI } from "@google/genai";
import { TelegramGroup } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findTelegramGroups = async (keyword: string): Promise<{ groups: TelegramGroup[], sources: { uri: string, title: string }[] }> => {
  try {
    const modelId = "gemini-2.5-flash"; // Using Flash for speed and search capability
    
    // Constructing a prompt that leverages Google Search to find real links
    const prompt = `
      Sen uzman bir Telegram topluluk araştırmacısısın. Kullanıcı "${keyword}" konusuyla ilgili GÜNCEL ve AKTİF Telegram grupları arıyor.
      
      Görevin:
      1. Google Search kullanarak "${keyword} telegram grubu 2024 2025", "${keyword} telegram kanalları aktif", "t.me join chat ${keyword}" gibi sorgularla en yeni verileri tara.
      2. ESKİ veya KAPANMIŞ grupları listeye alma. Sadece son 1 yılda aktivite gösterenleri seç.
      3. En az 4, en fazla 8 adet en alakalı grubu seç.
      4. Her grup için çalışan bir "https://t.me/..." linki bulmaya çalış. Eğer doğrudan link bulamazsan, link alanını boş bırak (""), uydurma link yazma.
      
      Yanıtı SADECE geçerli bir JSON formatında döndür. Başka bir metin yazma.
      
      JSON Şeması:
      [
        {
          "name": "Grup/Kanal Adı",
          "description": "Kısa açıklama (Türkçe)",
          "link": "https://t.me/örnek_link",
          "category": "Kategori",
          "estimatedMembers": "Tahmini üye sayısı",
          "tags": ["etiket1", "etiket2"]
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const textResponse = response.text || "";
    
    // Extract Grounding Metadata (Source URLs)
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      .filter(web => web !== undefined && web !== null)
      .map(web => ({ uri: web.uri || '', title: web.title || 'Kaynak' })) || [];

    // Parse JSON from the text response
    let jsonString = textResponse;
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = textResponse.match(jsonBlockRegex);
    
    if (match && match[1]) {
      jsonString = match[1];
    } else {
      const arrayStart = textResponse.indexOf('[');
      const arrayEnd = textResponse.lastIndexOf(']');
      if (arrayStart !== -1 && arrayEnd !== -1) {
        jsonString = textResponse.substring(arrayStart, arrayEnd + 1);
      }
    }

    let groups: TelegramGroup[] = [];
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        groups = parsed.map((item, index) => ({
          id: `group-${index}-${Date.now()}`,
          name: item.name || "Bilinmeyen Grup",
          description: item.description || "Açıklama bulunamadı.",
          link: item.link || "", // Default to empty string if missing
          category: item.category || "Genel",
          estimatedMembers: item.estimatedMembers || "Bilinmiyor",
          tags: Array.isArray(item.tags) ? item.tags : []
        }));
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("Sonuçlar işlenirken bir hata oluştu. Lütfen tekrar deneyin.");
    }

    return { groups, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
