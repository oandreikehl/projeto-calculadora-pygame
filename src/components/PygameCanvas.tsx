import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, Keyboard, Terminal } from 'lucide-react';
import { CalculatorState, ExecutionStep, Operation, PygameTheme } from '../types/calculator';
import { playClickSound, toggleAudio, isAudioEnabled } from '../utils/audio';

interface PygameCanvasProps {
  theme: PygameTheme;
  onExecutionStep: (step: ExecutionStep) => void;
  onReset: () => void;
  calculatorState: CalculatorState;
  setCalculatorState: React.Dispatch<React.SetStateAction<CalculatorState>>;
}

export const PygameCanvas: React.FC<PygameCanvasProps> = ({
  theme,
  onExecutionStep,
  onReset,
  calculatorState,
  setCalculatorState,
}) => {
  const [audioActive, setAudioActive] = useState(isAudioEnabled());
  const [mousePos, setMousePos] = useState({ x: 180, y: 280 });
  const [lastEvent, setLastEvent] = useState<string>('INICIALIZADO (pygame.init)');
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [fps] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);

  const { currentInput, previousValue, operation, historyExpression, hasResult, errorMessage } = calculatorState;

  // Sound toggle
  const handleToggleSound = () => {
    const newState = toggleAudio();
    setAudioActive(newState);
  };

  // 1. Math functions matching Python exactly
  const pythonSomar = (a: number, b: number) => a + b;
  const pythonSubtrair = (a: number, b: number) => a - b;
  const pythonMultiplicar = (a: number, b: number) => a * b;
  const pythonDividir = (a: number, b: number) => {
    if (b === 0) return 'Erro: Div por 0';
    return a / b;
  };

  const pythonCalcular = useCallback((num1: number, num2: number, op: Operation): { resultado: number | string; funcaoChamada: string } => {
    if (op === '+') {
      return { resultado: pythonSomar(num1, num2), funcaoChamada: 'somar(a, b)' };
    } else if (op === '-') {
      return { resultado: pythonSubtrair(num1, num2), funcaoChamada: 'subtrair(a, b)' };
    } else if (op === '*') {
      return { resultado: pythonMultiplicar(num1, num2), funcaoChamada: 'multiplicar(a, b)' };
    } else if (op === '/') {
      return { resultado: pythonDividir(num1, num2), funcaoChamada: 'dividir(a, b)' };
    }
    return { resultado: 'Operação Inválida', funcaoChamada: 'desconhecido' };
  }, []);

  // Button Click Handler
  const handleButtonClick = useCallback((label: string) => {
    setPressedButton(label);
    setTimeout(() => setPressedButton(null), 120);

    // Number or Decimal Point
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(label)) {
      playClickSound('num');
      setLastEvent(`MOUSEBUTTONDOWN -> '${label}'`);

      setCalculatorState((prev) => {
        let nextInput = prev.currentInput;
        if (prev.hasResult || prev.errorMessage || (prev.currentInput === '0' && label !== '.')) {
          nextInput = label === '.' ? '0.' : label;
        } else {
          if (label === '.') {
            if (!prev.currentInput.includes('.')) {
              nextInput = prev.currentInput + '.';
            }
          } else {
            if (nextInput.length < 12) {
              nextInput = prev.currentInput + label;
            }
          }
        }

        onExecutionStep({
          id: Math.random().toString(),
          timestamp: Date.now(),
          tipo: 'entrada',
          descricao: `Número atualizado para ${nextInput}`,
          codigoTrecho: `numero_atual = "${nextInput}"`,
          variaveis: {
            numero_atual: nextInput,
            numero_anterior: prev.previousValue,
            operacao_pendente: prev.operation,
          },
        });

        return {
          ...prev,
          currentInput: nextInput,
          hasResult: false,
          errorMessage: null,
        };
      });
      return;
    }

    // Clear (C)
    if (label === 'C') {
      playClickSound('clear');
      setLastEvent("MOUSEBUTTONDOWN -> 'C' (Reset)");
      onReset();
      onExecutionStep({
        id: Math.random().toString(),
        timestamp: Date.now(),
        tipo: 'limpar',
        descricao: 'Memória limpa: resetando variáveis',
        codigoTrecho: `numero_atual = "0"\nnumero_anterior = None\noperacao_pendente = None`,
        variaveis: {
          numero_atual: '0',
          numero_anterior: null,
          operacao_pendente: null,
        },
      });
      return;
    }

    // Invert sign (+/-)
    if (label === '+/-') {
      playClickSound('op');
      setLastEvent("MOUSEBUTTONDOWN -> '+/-'");
      setCalculatorState((prev) => {
        if (prev.currentInput === '0' || prev.errorMessage) return prev;
        const inverted = prev.currentInput.startsWith('-')
          ? prev.currentInput.slice(1)
          : '-' + prev.currentInput;
        return { ...prev, currentInput: inverted };
      });
      return;
    }

    // Percent (%)
    if (label === '%') {
      playClickSound('op');
      setLastEvent("MOUSEBUTTONDOWN -> '%'");
      setCalculatorState((prev) => {
        const val = parseFloat(prev.currentInput) / 100;
        const formatted = String(val);
        return { ...prev, currentInput: formatted };
      });
      return;
    }

    // Operations (+, -, *, /)
    if (['+', '-', '*', '/'].includes(label)) {
      const op = label as Operation;
      playClickSound('op');
      setLastEvent(`MOUSEBUTTONDOWN -> Operador '${op}'`);

      setCalculatorState((prev) => {
        const currentNum = parseFloat(prev.currentInput);

        // If there was already a previous value and pending operation, calculate intermediate result
        if (prev.previousValue !== null && prev.operation !== null && !prev.hasResult) {
          const { resultado, funcaoChamada } = pythonCalcular(prev.previousValue, currentNum, prev.operation);

          if (typeof resultado === 'string') {
            // Error like division by zero
            playClickSound('error');
            onExecutionStep({
              id: Math.random().toString(),
              timestamp: Date.now(),
              tipo: 'erro',
              descricao: `Erro detectado em ${funcaoChamada}: ${resultado}`,
              codigoTrecho: `if b == 0:\n    return "Erro: Div por 0"`,
              variaveis: { a: prev.previousValue, b: currentNum, resultado },
            });
            return {
              ...prev,
              errorMessage: resultado,
              currentInput: resultado,
              previousValue: null,
              operation: null,
              historyExpression: '',
              hasResult: true,
            };
          }

          onExecutionStep({
            id: Math.random().toString(),
            timestamp: Date.now(),
            tipo: 'condicional',
            descricao: `Encadeando: elif operacao == '${prev.operation}' -> ${funcaoChamada} = ${resultado}`,
            codigoTrecho: `resultado = ${funcaoChamada}\nnumero_anterior = ${resultado}\noperacao_pendente = '${op}'`,
            variaveis: {
              a: prev.previousValue,
              b: currentNum,
              operacao: prev.operation,
              resultado,
            },
          });

          return {
            ...prev,
            previousValue: resultado,
            currentInput: String(resultado),
            operation: op,
            historyExpression: `${resultado} ${op}`,
            hasResult: true,
          };
        }

        // Fresh operation set
        onExecutionStep({
          id: Math.random().toString(),
          timestamp: Date.now(),
          tipo: 'entrada',
          descricao: `Definido operador '${op}' com primeiro operando ${currentNum}`,
          codigoTrecho: `numero_anterior = float("${currentNum}")\noperacao_pendente = "${op}"`,
          variaveis: {
            numero_anterior: currentNum,
            operacao_pendente: op,
          },
        });

        return {
          ...prev,
          previousValue: currentNum,
          operation: op,
          historyExpression: `${currentNum} ${op}`,
          hasResult: true,
          errorMessage: null,
        };
      });
      return;
    }

    // Equals (=)
    if (label === '=') {
      if (previousValue !== null && operation !== null) {
        const num1 = previousValue;
        const num2 = parseFloat(currentInput);
        const { resultado, funcaoChamada } = pythonCalcular(num1, num2, operation);

        if (typeof resultado === 'string') {
          playClickSound('error');
          setLastEvent(`ERRO: ${resultado}`);
          onExecutionStep({
            id: Math.random().toString(),
            timestamp: Date.now(),
            tipo: 'erro',
            descricao: `Erro na função dividir: divisor é zero!`,
            codigoTrecho: `def dividir(a, b):\n    if b == 0:\n        return "Erro: Div por 0"`,
            variaveis: { a: num1, b: num2, retorno: resultado },
          });

          setCalculatorState((prev) => ({
            ...prev,
            errorMessage: resultado,
            currentInput: resultado,
            historyExpression: `${num1} ${operation} ${num2} =`,
            previousValue: null,
            operation: null,
            hasResult: true,
          }));
        } else {
          playClickSound('equals');
          setLastEvent(`RESULTADO = ${resultado}`);

          // Formatting to remove floating point quirks like 0.1+0.2 = 0.30000000000000004
          const cleanNum = Number.isInteger(resultado) ? String(resultado) : String(parseFloat(resultado.toFixed(6)));

          onExecutionStep({
            id: Math.random().toString(),
            timestamp: Date.now(),
            tipo: 'funcao',
            descricao: `Chamada da função matemática: ${funcaoChamada}`,
            codigoTrecho: `if operacao == '${operation}':\n    resultado = ${funcaoChamada} # -> ${cleanNum}`,
            variaveis: {
              num1,
              num2,
              operacao: operation,
              resultado: cleanNum,
            },
          });

          setCalculatorState((prev) => ({
            ...prev,
            currentInput: cleanNum,
            historyExpression: `${num1} ${operation} ${num2} =`,
            previousValue: null,
            operation: null,
            hasResult: true,
            errorMessage: null,
          }));
        }
      }
    }
  }, [calculatorState, onExecutionStep, onReset, previousValue, operation, currentInput, pythonCalcular, setCalculatorState]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside text inputs elsewhere
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleButtonClick(e.key);
      } else if (e.key === '.') {
        handleButtonClick('.');
      } else if (e.key === '+') {
        handleButtonClick('+');
      } else if (e.key === '-') {
        handleButtonClick('-');
      } else if (e.key === '*') {
        handleButtonClick('*');
      } else if (e.key === '/') {
        e.preventDefault();
        handleButtonClick('/');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleButtonClick('=');
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleButtonClick('C');
      } else if (e.key === 'Backspace') {
        setCalculatorState((prev) => {
          if (prev.currentInput.length > 1 && !prev.hasResult && !prev.errorMessage) {
            return { ...prev, currentInput: prev.currentInput.slice(0, -1) };
          }
          return { ...prev, currentInput: '0' };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButtonClick, setCalculatorState]);

  // Mouse coordinate tracker for Pygame canvas simulation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(360, Math.round(e.clientX - rect.left)));
    const y = Math.max(0, Math.min(560, Math.round(e.clientY - rect.top)));
    setMousePos({ x, y });
  };

  const buttonRows = [
    [
      { label: 'C', type: 'special' },
      { label: '+/-', type: 'special' },
      { label: '%', type: 'special' },
      { label: '/', type: 'op' },
    ],
    [
      { label: '7', type: 'num' },
      { label: '8', type: 'num' },
      { label: '9', type: 'num' },
      { label: '*', type: 'op' },
    ],
    [
      { label: '4', type: 'num' },
      { label: '5', type: 'num' },
      { label: '6', type: 'num' },
      { label: '-', type: 'op' },
    ],
    [
      { label: '1', type: 'num' },
      { label: '2', type: 'num' },
      { label: '3', type: 'num' },
      { label: '+', type: 'op' },
    ],
    [
      { label: '0', type: 'num', span: 2 },
      { label: '.', type: 'num' },
      { label: '=', type: 'equals' },
    ],
  ];

  const rgb = (arr: [number, number, number]) => `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`;

  const isLight = theme.id === 'light';

  return (
    <div className="flex flex-col items-center">
      {/* Top Chrome Toolbar for Pygame Window */}
      <div
        className={`w-[360px] max-w-full flex items-center justify-between px-3.5 py-2.5 border-t border-x rounded-t-2xl text-xs select-none transition-colors duration-200 ${
          isLight
            ? 'bg-slate-100 border-slate-200/90 text-slate-600 shadow-sm'
            : 'bg-zinc-900/95 border-zinc-800 text-zinc-400'
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Simulated Pygame window action dots */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors cursor-pointer"
              title="Resetar calculadora (pygame.QUIT)"
              onClick={onReset}
            />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer" title="Minimizar" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer" title="Expandir" />
          </div>
          <span className={`font-mono text-[11px] ml-1.5 font-medium ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
            calculadora_pygame.py
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 text-[11px] transition-colors cursor-pointer ${
              isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={audioActive ? 'Desativar som tátil' : 'Ativar som tátil'}
            aria-label="Alternar som dos cliques"
          >
            {audioActive ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="hidden sm:inline font-mono">{audioActive ? 'Som' : 'Mudo'}</span>
          </button>

          <button
            onClick={onReset}
            className={`flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
              isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Reiniciar calculadora"
            aria-label="Reiniciar calculadora"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline font-mono">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Pygame Simulated Surface Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`relative w-[360px] max-w-full h-[560px] rounded-b-2xl p-5 flex flex-col justify-between transition-all duration-300 select-none border-b border-x ${
          isLight
            ? 'shadow-2xl shadow-slate-300/60 border-slate-200'
            : 'shadow-2xl shadow-black/80 border-zinc-800'
        }`}
        style={{
          backgroundColor: rgb(theme.corFundo),
          borderColor: rgb(theme.corBorda),
        }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] rounded-b-2xl"
          style={{
            backgroundImage: `radial-gradient(${rgb(theme.corTexto)} 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* 1. VISOR MINIMALISTA */}
        <div
          className={`relative rounded-2xl p-4 flex flex-col justify-between h-[135px] border transition-colors ${
            isLight
              ? 'shadow-sm shadow-slate-200/50'
              : 'shadow-inner shadow-black/40'
          }`}
          style={{
            backgroundColor: rgb(theme.corVisor),
            borderColor: rgb(theme.corBorda),
          }}
        >
          {/* Top row of display: Expression history & active operation badge */}
          <div className="flex items-center justify-between text-xs tracking-wide">
            <span
              className="font-mono text-xs truncate max-w-[200px]"
              style={{ color: rgb(theme.corSubtexto) }}
            >
              {historyExpression || 'pronto'}
            </span>
            {operation && (
              <span
                className="font-mono text-[11px] px-2 py-0.5 rounded text-white font-semibold uppercase"
                style={{ backgroundColor: rgb(theme.corDestaque) }}
              >
                OP: {operation}
              </span>
            )}
          </div>

          {/* Bottom row of display: Large active number */}
          <div className="flex items-baseline justify-end overflow-hidden">
            <span
              className={`font-mono text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums truncate ${
                errorMessage ? 'text-rose-500 text-2xl' : ''
              }`}
              style={{ color: errorMessage ? undefined : rgb(theme.corTexto) }}
            >
              {currentInput}
            </span>
          </div>

          {/* Subtle light bar accent */}
          <div
            className="absolute top-0 left-6 right-6 h-[1px] pointer-events-none"
            style={{
              background: isLight
                ? 'linear-gradient(to right, transparent, rgba(0,0,0,0.06), transparent)'
                : 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
            }}
          />
        </div>

        {/* 2. GRID DE BOTÕES INTERATIVOS */}
        <div className="grid grid-cols-4 gap-3 my-auto pt-2">
          {buttonRows.flat().map((btn) => {
            const isSpan2 = btn.span === 2;
            const isPressed = pressedButton === btn.label;
            const isSelectedOp = btn.label === operation && !hasResult;

            let bgColor = rgb(theme.corBotaoNum);
            let textColor = rgb(theme.corTexto);

            if (btn.type === 'equals') {
              bgColor = rgb(theme.corBotaoIgual);
              textColor = '#ffffff';
            } else if (btn.type === 'op' || btn.type === 'special') {
              bgColor = rgb(theme.corBotaoOp);
              textColor = rgb(theme.corTexto);
            }

            if (isSelectedOp) {
              bgColor = rgb(theme.corDestaque);
              textColor = '#ffffff';
            }

            return (
              <button
                key={btn.label}
                type="button"
                onClick={() => handleButtonClick(btn.label)}
                className={`h-[58px] rounded-xl flex items-center justify-center font-mono text-lg font-medium transition-all duration-100 border cursor-pointer ${
                  isSpan2 ? 'col-span-2' : 'col-span-1'
                } ${
                  isPressed
                    ? 'scale-95 brightness-95'
                    : isLight
                    ? 'hover:bg-slate-100/90 hover:border-slate-300 active:scale-95'
                    : 'hover:brightness-115 active:scale-95'
                }`}
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  borderColor: isSelectedOp ? rgb(theme.corDestaque) : rgb(theme.corBorda),
                  boxShadow: isPressed
                    ? 'none'
                    : isLight
                    ? '0 1px 2px rgba(0,0,0,0.05)'
                    : '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. RODAPÉ DE TELEMETRIA DO PYGAME */}
        <div
          className="pt-2 border-t flex items-center justify-between text-[10px] font-mono"
          style={{
            borderColor: rgb(theme.corBorda),
            color: rgb(theme.corSubtexto),
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Clock: {fps} FPS</span>
          </div>

          <div className="truncate max-w-[140px] text-right">
            pos: ({mousePos.x}, {mousePos.y})
          </div>
        </div>
      </div>

      {/* Mini status bar below canvas */}
      <div
        className={`w-[360px] max-w-full flex items-center justify-between mt-2.5 px-2 text-[11px] font-mono transition-colors ${
          isLight ? 'text-slate-500' : 'text-zinc-500'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 opacity-70" />
          <span className="truncate max-w-[210px]">{lastEvent}</span>
        </span>
        <span className="flex items-center gap-1 opacity-80">
          <Keyboard className="w-3 h-3" />
          <span>Teclado Ativo</span>
        </span>
      </div>
    </div>
  );
};
