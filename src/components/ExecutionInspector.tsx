import React from 'react';
import { Activity, Play, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ExecutionStep, CalculatorState } from '../types/calculator';

interface ExecutionInspectorProps {
  steps: ExecutionStep[];
  calculatorState: CalculatorState;
  onClearHistory: () => void;
}

export const ExecutionInspector: React.FC<ExecutionInspectorProps> = ({
  steps,
  calculatorState,
  onClearHistory,
}) => {
  const latestStep = steps[0];

  const getStepColor = (tipo: ExecutionStep['tipo']) => {
    switch (tipo) {
      case 'funcao':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'condicional':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'erro':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case 'limpar':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-800/40';
    }
  };

  const getStepIcon = (tipo: ExecutionStep['tipo']) => {
    switch (tipo) {
      case 'funcao':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'condicional':
        return <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'erro':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-200">Inspetor de Execução Python</h2>
          <span className="text-[11px] text-slate-500 font-mono">tempo real</span>
        </div>
        {steps.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-mono cursor-pointer"
          >
            Limpar log
          </button>
        )}
      </div>

      {/* Live State Variables Bar */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 border-b border-slate-800 text-xs font-mono">
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] uppercase text-slate-500 block mb-0.5">numero_atual</span>
          <span className="text-slate-100 font-semibold truncate block">
            "{calculatorState.currentInput}"
          </span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] uppercase text-slate-500 block mb-0.5">numero_anterior</span>
          <span className="text-amber-300 font-semibold truncate block">
            {calculatorState.previousValue !== null ? calculatorState.previousValue : 'None'}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] uppercase text-slate-500 block mb-0.5">operacao_pendente</span>
          <span className="text-sky-300 font-semibold truncate block">
            {calculatorState.operation ? `"${calculatorState.operation}"` : 'None'}
          </span>
        </div>
      </div>

      {/* Active Snippet Highlighting */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
            Última Instrução Python Executada
          </span>
          {latestStep && (
            <span className={`text-[11px] px-2 py-0.5 rounded border font-mono ${getStepColor(latestStep.tipo)}`}>
              {latestStep.tipo}
            </span>
          )}
        </div>

        {latestStep ? (
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono text-xs">
            <div className="text-slate-300 mb-1.5 flex items-center gap-1.5">
              {getStepIcon(latestStep.tipo)}
              <span className="font-sans font-medium text-slate-200">{latestStep.descricao}</span>
            </div>
            <pre className="text-amber-300/95 overflow-x-auto p-2 bg-slate-900/80 rounded border border-slate-800 text-[11px] leading-relaxed">
              <code>{latestStep.codigoTrecho}</code>
            </pre>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
            Clique nos botões da calculadora ou aperte números no teclado para ver o fluxo das funções e condicionais em tempo real.
          </div>
        )}
      </div>

      {/* Log of steps */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[260px]">
        <div className="text-xs font-medium text-slate-400 mb-2 font-mono flex items-center justify-between">
          <span>Linha do Tempo de Chamadas</span>
          <span className="text-[11px] text-slate-500">{steps.length} eventos</span>
        </div>

        {steps.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            Nenhuma operação executada ainda. Experimente fazer um cálculo como <span className="text-amber-400">8 * 5 =</span>
          </p>
        ) : (
          steps.map((step) => (
            <div
              key={step.id}
              className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs flex items-start gap-2.5 hover:border-slate-700 transition-colors"
            >
              <div className="mt-0.5">{getStepIcon(step.tipo)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-200 truncate">{step.descricao}</span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(step.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate-400 bg-slate-900/90 px-2 py-1 rounded truncate">
                  {step.codigoTrecho.split('\n')[0]}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Beginner hint card */}
      <div className="p-3 bg-amber-500/5 border-t border-amber-500/10 text-[11px] text-amber-200/80 flex items-center gap-2">
        <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          <strong>Dica didática:</strong> Observe como cada clique do mouse aciona a função <code>calcular()</code> e escolhe o ramo <code>if/elif</code> correspondente.
        </span>
      </div>
    </div>
  );
};
