import React, { useState } from 'react';
import { ChevronDown, Code2, GitBranch, RotateCw, MousePointerClick, Palette, CheckCircle, ShieldAlert } from 'lucide-react';
import { EXPLANATIONS } from '../utils/pythonCode';

export const ExplanationGuide: React.FC = () => {
  const [openSectionId, setOpenSectionId] = useState<string>('funcoes');

  const getIcon = (id: string) => {
    switch (id) {
      case 'funcoes':
        return <Code2 className="w-4 h-4 text-amber-400" />;
      case 'condicionais':
        return <GitBranch className="w-4 h-4 text-sky-400" />;
      case 'pygame-loop':
        return <RotateCw className="w-4 h-4 text-emerald-400" />;
      case 'pygame-eventos':
        return <MousePointerClick className="w-4 h-4 text-indigo-400" />;
      case 'pygame-desenho':
        return <Palette className="w-4 h-4 text-rose-400" />;
      default:
        return <Code2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-100">
          Guia Didático: Entendendo a Lógica Passo a Passo
        </h2>
        <p className="text-sm text-slate-400">
          Explicação detalhada dos conceitos essenciais de Python e Pygame usados neste projeto para quem está dando os primeiros passos na programação.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {EXPLANATIONS.map((item) => {
          const isOpen = openSectionId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenSectionId(isOpen ? '' : item.id)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {getIcon(item.id)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-200">{item.titulo}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.subtitulo}</p>
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/60 space-y-4">
                  <p className="text-sm text-slate-300 leading-relaxed">{item.resumo}</p>

                  {/* Code snippet block */}
                  <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 font-mono text-xs overflow-x-auto">
                    <div className="text-[11px] text-slate-500 mb-2 font-mono flex items-center justify-between">
                      <span>Trecho de código comentado:</span>
                      <span className="text-amber-400">Python 3</span>
                    </div>
                    <pre className="text-amber-200/90 leading-relaxed">
                      <code>{item.codigoExemplo}</code>
                    </pre>
                  </div>

                  {/* Key takeaways */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono block">
                      O que você precisa fixar:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {item.pontosChave.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Safety Notice on Division by Zero */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <strong className="text-amber-300">Atenção ao Erro Clássico de Iniciante:</strong>
          <p className="text-slate-400 leading-relaxed">
            Em computação, tentar dividir qualquer número por 0 resulta em uma exceção imediata (<code>ZeroDivisionError</code>). A estrutura condicional <code>if b == 0:</code> é nossa proteção preventiva, garantindo que o programa continue rodando e mostre uma mensagem amigável no visor da calculadora.
          </p>
        </div>
      </div>
    </div>
  );
};
