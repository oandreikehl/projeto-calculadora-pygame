export type Operation = '+' | '-' | '*' | '/';

export interface CalculatorState {
  currentInput: string;
  previousValue: number | null;
  operation: Operation | null;
  historyExpression: string;
  hasResult: boolean;
  errorMessage: string | null;
}

export interface ExecutionStep {
  id: string;
  timestamp: number;
  tipo: 'entrada' | 'funcao' | 'condicional' | 'resultado' | 'erro' | 'limpar';
  descricao: string;
  codigoTrecho: string;
  variaveis: Record<string, string | number | null>;
}

export interface PygameTheme {
  id: string;
  nome: string;
  descricao: string;
  corFundo: [number, number, number]; // RGB
  corVisor: [number, number, number];
  corTexto: [number, number, number];
  corSubtexto: [number, number, number];
  corBotaoNum: [number, number, number];
  corBotaoNumHover: [number, number, number];
  corBotaoOp: [number, number, number];
  corBotaoOpHover: [number, number, number];
  corBotaoIgual: [number, number, number];
  corDestaque: [number, number, number];
  corBorda: [number, number, number];
}
