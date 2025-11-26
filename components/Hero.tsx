import React, { useState } from 'react';
import { Search, Loader2, Zap } from 'lucide-react';

interface HeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const Hero: React.FC<HeroProps> = ({ onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800 pb-16 pt-24 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-20">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500 rounded-full blur-3xl -translate-x-1/3 translate-y-1/4"></div>
      </div>

      <div className="relative max-w-3xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
          <Zap size={14} className="fill-current" />
          <span>Yapay Zeka Destekli Keşif</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
          İlgi Alanına Uygun <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Telegram Gruplarını</span> Bul
        </h1>
        
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          Aradığınız konuyu yazın, yapay zeka sizin için web'i tarasın ve en aktif, en alakalı toplulukları listelesin.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl opacity-75 group-hover:opacity-100 transition duration-200 blur"></div>
          <div className="relative flex items-center bg-slate-900 rounded-xl p-2">
            <Search className="text-slate-400 ml-3 w-6 h-6" />
            <input 
              type="text" 
              className="w-full bg-transparent text-white px-4 py-3 focus:outline-none placeholder:text-slate-500 text-lg"
              placeholder="Örn: Yazılım, Kripto, İngilizce Pratik..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Aranıyor</span>
                </>
              ) : (
                <span>Bul</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Hero;