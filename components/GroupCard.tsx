import React from 'react';
import { TelegramGroup } from '../types';
import { Users, ExternalLink, Hash, ShieldCheck, Search } from 'lucide-react';

interface GroupCardProps {
  group: TelegramGroup;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  // Check if the link provided by AI looks like a real Telegram link
  const isDirectLink = group.link && (group.link.includes('t.me/') || group.link.includes('telegram.me/'));
  
  // If valid Telegram link, use it. Otherwise, generate a Google Search URL for the group.
  const targetUrl = isDirectLink 
    ? group.link 
    : `https://www.google.com/search?q=${encodeURIComponent(group.name + ' telegram grubu katıl')}`;

  const buttonText = isDirectLink ? "Gruba Katıl" : "Google'da Ara";
  const buttonColorClass = isDirectLink 
    ? "bg-blue-600 hover:bg-blue-500" 
    : "bg-slate-700 hover:bg-slate-600";

  return (
    <div className="bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
          {group.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-700 text-slate-300 border border-slate-600 ml-2 text-right">
          {group.category}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
        {group.name}
      </h3>
      
      <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
        {group.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {group.tags.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="flex items-center gap-1 text-xs text-blue-300/80">
            <Hash size={10} />
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-700/50 flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-slate-500" />
            <span>{group.estimatedMembers} Üye</span>
          </div>
          {isDirectLink && (
            <div className="flex items-center gap-1 text-teal-500/80" title="Link Doğrulandı">
               <ShieldCheck size={14} />
            </div>
          )}
        </div>

        <a 
          href={targetUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`w-full ${buttonColorClass} text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group/btn`}
        >
          <span>{buttonText}</span>
          {isDirectLink ? (
            <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          ) : (
            <Search size={16} className="group-hover/btn:scale-110 transition-transform" />
          )}
        </a>
      </div>
    </div>
  );
};

export default GroupCard;