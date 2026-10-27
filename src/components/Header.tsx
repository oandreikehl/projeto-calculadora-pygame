import React from 'react';
import { Sun, Moon, Code } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme, onOpenCode }) => {
  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 backdrop-blur-md ${
        isDark
          ? 'bg-zinc-950/80 border-zinc-800 text-zinc-100'
          : 'bg-white/80 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <span className="text-base font-bold tracking-tight whitespace-nowrap shrink-0">
          Pygame Calc
        </span>

        {/* Zone 2: Single-line minimal action/info */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-zinc-400">
          <button
            onClick={onOpenCode}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:underline ${
              isDark ? 'text-zinc-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Código .py</span>
          </button>
        </div>

        {/* Zone 3: 1 primary action: Theme Toggle Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border-zinc-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
            }`}
            title={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
            aria-label="Alternar tema claro e escuro"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">Tema Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-mono">Tema Escuro</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
