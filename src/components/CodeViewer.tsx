import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Terminal, Sparkles } from 'lucide-react';
import { PygameTheme } from '../types/calculator';
import { generatePygameCode, generateTerminalCode, THEMES } from '../utils/pythonCode';

interface CodeViewerProps {
  currentTheme: PygameTheme;
  onThemeChange: (theme: PygameTheme) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ currentTheme, onThemeChange }) => {
  const [activeTab, setActiveTab] = useState<'pygame' | 'terminal'>('pygame');
  const [copied, setCopied] = useState(false);

  const pygameCode = generatePygameCode(currentTheme);
  const terminalCode = generateTerminalCode();
  const currentCode = activeTab === 'pygame' ? pygameCode : terminalCode;
  const filename = activeTab === 'pygame' ? 'calculadora_pygame.py' : 'calculadora_terminal.py';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Header with Tabs & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-800 bg-slate-950/80">
        {/* Code Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('pygame')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'pygame'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>calculadora_pygame.py</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>calculadora_terminal.py</span>
          </button>
        </div>

        {/* Right Actions: Theme Selector (if Pygame), Copy, Download */}
        <div className="flex items-center gap-2.5">
          {activeTab === 'pygame' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <label htmlFor="theme-select" className="hidden sm:inline font-mono text-[11px]">Tema:</label>
              <select
                id="theme-select"
                value={currentTheme.id}
                onChange={(e) => {
                  const found = THEMES.find((t) => t.id === e.target.value);
                  if (found) onThemeChange(found);
                }}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {THEMES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
            title="Copiar código para a área de transferência"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span className="font-mono">{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
            title="Baixar arquivo .py"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">Baixar .py</span>
          </button>
        </div>
      </div>

      {/* Code description banner */}
      <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <span>
          {activeTab === 'pygame'
            ? 'Interface visual minimalista com Pygame, tratamento de cliques no mouse, suporte a teclado e 60 FPS.'
            : 'Versão em modo texto para terminal utilizando apenas input(), float(), funções e if/elif/else.'}
        </span>
        <span className="font-mono text-[11px] text-slate-500 hidden md:inline">
          {currentCode.split('\n').length} linhas
        </span>
      </div>

      {/* Code Editor Body with Line Numbers */}
      <div className="relative max-h-[520px] overflow-auto bg-slate-950 font-mono text-xs leading-relaxed">
        <div className="flex">
          {/* Line Numbers */}
          <div className="select-none py-4 px-3 text-right bg-slate-950 text-slate-600 border-r border-slate-900 sticky left-0 font-mono text-[11px]">
            {currentCode.split('\n').map((_, index) => (
              <div key={index} className="leading-6">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Actual Code Content */}
          <pre className="py-4 px-4 text-slate-300 overflow-x-auto flex-1 font-mono text-xs leading-6 selection:bg-amber-500/20">
            <code>
              {currentCode.split('\n').map((line, idx) => {
                // Lightweight syntax highlight styling for Python keywords
                let lineClass = 'text-slate-300';
                if (line.trim().startsWith('#')) {
                  lineClass = 'text-slate-500 italic';
                } else if (line.includes('def ') || line.includes('return ')) {
                  lineClass = 'text-amber-300/90';
                } else if (
                  line.includes('if ') ||
                  line.includes('elif ') ||
                  line.includes('else:') ||
                  line.includes('while ') ||
                  line.includes('for ')
                ) {
                  lineClass = 'text-sky-300/90';
                } else if (line.includes('pygame.')) {
                  lineClass = 'text-emerald-300/90';
                }

                return (
                  <div key={idx} className={lineClass}>
                    {line || ' '}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
