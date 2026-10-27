import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode } from 'lucide-react';
import { PygameTheme } from '../types/calculator';
import { generatePygameCode } from '../utils/pythonCode';

interface PythonCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: PygameTheme;
}

export const PythonCodeModal: React.FC<PythonCodeModalProps> = ({ isOpen, onClose, theme }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const code = generatePygameCode(theme);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calculadora_pygame.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-100">calculadora_pygame.py</h3>
            <span className="text-[11px] text-zinc-500 font-mono">({theme.nome})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors border border-zinc-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs font-mono transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .py</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer ml-1"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-y-auto bg-zinc-950 font-mono text-xs text-zinc-300 leading-relaxed max-h-[60vh]">
          <pre>
            <code>{code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/80 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>Para rodar no seu PC: execute <code>pip install pygame</code> e <code>python calculadora_pygame.py</code></span>
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer font-mono"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
