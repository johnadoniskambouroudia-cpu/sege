import React, { useState } from 'react';
import Hero from './components/Hero';
import GroupCard from './components/GroupCard';
import { SearchState, TelegramGroup } from './types';
import { findTelegramGroups } from './services/geminiService';
import { AlertCircle, Globe, Search, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    query: '',
    isLoading: false,
    results: [],
    error: null,
    sources: []
  });

  const handleSearch = async (query: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, query }));
    
    try {
      const { groups, sources } = await findTelegramGroups(query);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        results: groups,
        sources: sources
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || "Bir hata oluştu." 
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Hero onSearch={handleSearch} isLoading={state.isLoading} />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Error State */}
        {state.error && (
          <div className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 mb-8">
            <AlertCircle className="shrink-0" />
            <p>{state.error}</p>
          </div>
        )}

        {/* Results Grid */}
        {state.results.length > 0 ? (
          <div className="space-y-8">
             <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 pb-4 border-b border-slate-800">
                <div>
                   <h2 className="text-2xl font-bold text-white">Sonuçlar: "{state.query}"</h2>
                   <p className="text-slate-400 text-sm mt-1">{state.results.length} grup bulundu</p>
                </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {state.results.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>

            {/* Sources / Grounding Data */}
            {state.sources && state.sources.length > 0 && (
              <div className="mt-12 p-6 bg-slate-800/30 rounded-xl border border-slate-800">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Globe size={14} />
                  Kaynaklar
                </h3>
                <div className="flex flex-wrap gap-3">
                  {state.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-500/20 transition-colors truncate max-w-[200px]"
                    >
                      {source.title || new URL(source.uri).hostname}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          !state.isLoading && state.query && !state.error && (
            <div className="text-center py-20 text-slate-500">
              <p className="text-lg">"{state.query}" için sonuç bulunamadı.</p>
              <p className="text-sm">Lütfen farklı anahtar kelimeler deneyin.</p>
            </div>
          )
        )}

        {/* Empty State / Initial View Content */}
        {!state.query && !state.isLoading && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center opacity-50">
             <div className="p-6">
                <div className="w-12 h-12 bg-slate-800 rounded-lg mx-auto mb-4 flex items-center justify-center text-blue-500">
                   <Search size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">Hızlı Arama</h3>
                <p className="text-sm text-slate-400">Saniyeler içinde konunuzla alakalı en iyi grupları listeleyin.</p>
             </div>
             <div className="p-6">
                <div className="w-12 h-12 bg-slate-800 rounded-lg mx-auto mb-4 flex items-center justify-center text-teal-500">
                   <ShieldCheck size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">Güvenli Linkler</h3>
                <p className="text-sm text-slate-400">Yapay zeka yalnızca erişilebilir ve güvenli görünen linkleri filtreler.</p>
             </div>
             <div className="p-6">
                <div className="w-12 h-12 bg-slate-800 rounded-lg mx-auto mb-4 flex items-center justify-center text-purple-500">
                   <Globe size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">Web Taraması</h3>
                <p className="text-sm text-slate-400">Google Search altyapısı ile en güncel topluluklara erişin.</p>
             </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-8 bg-slate-900 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} TeleScout AI. Gemini API tarafından desteklenmektedir.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;