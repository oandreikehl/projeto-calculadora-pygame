import { useState } from 'react';
import { Header } from './components/Header';
import { PygameCanvas } from './components/PygameCanvas';
import { PythonCodeModal } from './components/PythonCodeModal';
import { CalculatorState, ExecutionStep } from './types/calculator';
import { THEMES } from './utils/pythonCode';
import { Sun, Moon } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  const currentTheme = isDark ? THEMES[0] : THEMES[1]; // THEMES[0] = dark, THEMES[1] = light

  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    currentInput: '0',
    previousValue: null,
    operation: null,
    historyExpression: '',
    hasResult: false,
    errorMessage: null,
  });

  const handleReset = () => {
    setCalculatorState({
      currentInput: '0',
      previousValue: null,
      operation: null,
      historyExpression: '',
      hasResult: false,
      errorMessage: null,
    });
  };

  const handleExecutionStep = (_step: ExecutionStep) => {
    // Pure minimalist mode - step handled quietly
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${
        isDark ? 'bg-[#09090b] text-zinc-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Bar Header with theme toggle and code view */}
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onOpenCode={() => setCodeModalOpen(true)}
      />

      {/* Main Focus: Purely the Minimalist Pygame Calculator */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-[420px] flex flex-col items-center space-y-4">
          {/* Header Title & Segmented Theme Switch */}
          <div className="w-[360px] max-w-full flex items-center justify-between px-1">
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold tracking-tight">Calculadora Pygame</h1>
              <span className={`text-[11px] font-mono ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                Python 3 · 4 Operações
              </span>
            </div>

            {/* Segmented Theme Switch (Claro / Escuro) */}
            <div
              className={`flex items-center p-0.5 rounded-xl border text-xs font-medium transition-colors ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-200/80 border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setIsDark(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  !isDark
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Ativar Tema Claro (Branco)"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px]">Claro</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDark(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isDark
                    ? 'bg-zinc-800 text-zinc-100 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Ativar Tema Escuro (Black)"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px]">Escuro</span>
              </button>
            </div>
          </div>

          {/* The Interactive Pygame Canvas */}
          <PygameCanvas
            theme={currentTheme}
            calculatorState={calculatorState}
            setCalculatorState={setCalculatorState}
            onExecutionStep={handleExecutionStep}
            onReset={handleReset}
          />

          {/* Keyboard & Shortcuts Hint */}
          <div
            className={`text-center text-[11px] font-mono transition-colors ${
              isDark ? 'text-zinc-500' : 'text-slate-500'
            }`}
          >
            Teclado ativo · <kbd className="px-1 py-0.5 rounded border border-current text-[10px]">Esc</kbd> limpa ·{' '}
            <kbd className="px-1 py-0.5 rounded border border-current text-[10px]">Enter</kbd> calcula
          </div>
        </div>
      </main>

      {/* Code Modal (Calculadora Pygame script ready to copy/download) */}
      <PythonCodeModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        theme={currentTheme}
      />
    </div>
  );
}
