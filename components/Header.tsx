import React from 'react';
import { ScanEye, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-primary-500 to-indigo-600 p-2 rounded-lg">
            <ScanEye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              PromptArchitect AI
            </h1>
            <p className="text-xs text-slate-400">Reverse-Engineer Visuals</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Powered by Gemini 3.0 Pro</span>
        </div>
      </div>
    </header>
  );
};