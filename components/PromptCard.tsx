import React, { useState } from 'react';
import { Copy, Check, Terminal, Command, Zap, Ban, Code, FileJson } from 'lucide-react';

interface PromptCardProps {
  title: string;
  content: string;
  type: 'natural' | 'midjourney' | 'stable' | 'negative' | 'json';
  onUpdate: (newContent: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ title, content, type, onUpdate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch (type) {
      case 'natural': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'midjourney': return <Command className="w-4 h-4 text-white" />;
      case 'stable': return <Terminal className="w-4 h-4 text-green-400" />;
      case 'negative': return <Ban className="w-4 h-4 text-red-400" />;
      case 'json': return <FileJson className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'natural': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30 focus-within:border-yellow-500/50';
      case 'midjourney': return 'from-slate-700/50 to-slate-600/50 border-slate-500/30 focus-within:border-slate-400/50';
      case 'stable': return 'from-green-500/20 to-emerald-500/20 border-green-500/30 focus-within:border-green-500/50';
      case 'negative': return 'from-red-500/10 to-rose-500/10 border-red-500/20 focus-within:border-red-500/50';
      case 'json': return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 focus-within:border-cyan-500/50';
    }
  };

  return (
    <div className={`rounded-xl border ${getGradient()} bg-slate-900/40 overflow-hidden flex flex-col h-full transition-colors`}>
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 flex-grow relative group">
        <textarea
          value={content}
          onChange={(e) => onUpdate(e.target.value)}
          className={`w-full h-full min-h-[120px] bg-transparent text-slate-300 font-mono text-sm focus:outline-none focus:text-slate-100 resize-y custom-scrollbar leading-relaxed ${type === 'json' ? 'text-cyan-100/90' : ''}`}
          spellCheck={false}
        />
        <div className="absolute bottom-2 right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-[10px] text-slate-500 uppercase tracking-widest">Editable</span>
        </div>
      </div>
    </div>
  );
};