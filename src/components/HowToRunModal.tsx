import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink, Laptop } from 'lucide-react';

interface HowToRunModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToRunModal: React.FC<HowToRunModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Passo 1: Ter o Python instalado',
      desc: 'Baixe o Python 3 mais recente no site oficial python.org (marque a opção "Add Python to PATH" no instalador do Windows).',
      command: 'python --version',
    },
    {
      title: 'Passo 2: Instalar a biblioteca Pygame',
      desc: 'Abra seu terminal (CMD, PowerShell ou Terminal do macOS/Linux) e execute:',
      command: 'pip install pygame',
    },
    {
      title: 'Passo 3: Salvar o código do projeto',
      desc: 'Clique no botão "Baixar .py" no topo desta página e salve o arquivo como "calculadora_pygame.py" em uma pasta de sua preferência.',
      command: null,
    },
    {
      title: 'Passo 4: Executar a calculadora',
      desc: 'No terminal, navegue até a pasta onde salvou o arquivo e digite:',
      command: 'python calculadora_pygame.py',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <Laptop className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">Como Rodar no seu Computador</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          <p className="text-sm text-slate-300">
            Siga este roteiro simples para executar a interface visual do Pygame diretamente no seu sistema operacional:
          </p>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 text-sm">{step.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">0{idx + 1}</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>

                {step.command && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-amber-300">
                    <div className="flex items-center gap-2 truncate">
                      <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <code className="truncate">{step.command}</code>
                    </div>
                    <button
                      onClick={() => handleCopy(step.command, idx)}
                      className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors ml-2 cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center justify-between">
            <span>Precisa baixar o Python oficial? Acesse o site oficial:</span>
            <a
              href="https://www.python.org/downloads/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:underline shrink-0 ml-2"
            >
              python.org <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
