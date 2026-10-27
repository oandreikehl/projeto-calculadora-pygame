import { PygameTheme } from '../types/calculator';

export const THEMES: PygameTheme[] = [
  {
    id: 'dark',
    nome: 'Tema Escuro (Black)',
    descricao: 'Minimalismo escuro com contraste OLED, botões grafite e visor preto profundo.',
    corFundo: [12, 12, 14],
    corVisor: [18, 19, 24],
    corTexto: [250, 250, 250],
    corSubtexto: [140, 145, 155],
    corBotaoNum: [26, 27, 33],
    corBotaoNumHover: [38, 40, 48],
    corBotaoOp: [34, 36, 44],
    corBotaoOpHover: [48, 50, 62],
    corBotaoIgual: [234, 88, 12],
    corDestaque: [245, 158, 11],
    corBorda: [38, 40, 50],
  },
  {
    id: 'light',
    nome: 'Tema Claro (Branco)',
    descricao: 'Minimalismo claro limpo, fundo branco papel, botões suaves e alta legibilidade.',
    corFundo: [248, 249, 250],
    corVisor: [255, 255, 255],
    corTexto: [17, 24, 39],
    corSubtexto: [107, 114, 128],
    corBotaoNum: [255, 255, 255],
    corBotaoNumHover: [243, 244, 246],
    corBotaoOp: [243, 244, 246],
    corBotaoOpHover: [229, 231, 235],
    corBotaoIgual: [234, 88, 12],
    corDestaque: [217, 119, 6],
    corBorda: [229, 231, 235],
  },
];

export function generatePygameCode(theme: PygameTheme): string {
  const [fundoR, fundoG, fundoB] = theme.corFundo;
  const [visorR, visorG, visorB] = theme.corVisor;
  const [txtR, txtG, txtB] = theme.corTexto;
  const [subR, subG, subB] = theme.corSubtexto;
  const [btnNumR, btnNumG, btnNumB] = theme.corBotaoNum;
  const [btnNumHovR, btnNumHovG, btnNumHovB] = theme.corBotaoNumHover;
  const [btnOpR, btnOpG, btnOpB] = theme.corBotaoOp;
  const [btnOpHovR, btnOpHovG, btnOpHovB] = theme.corBotaoOpHover;
  const [eqR, eqG, eqB] = theme.corBotaoIgual;
  const [destR, destG, destB] = theme.corDestaque;
  const [bordaR, bordaG, bordaB] = theme.corBorda;

  return `# ==============================================================================
# CALCULADORA MINIMALISTA INTERATIVA EM PYTHON & PYGAME
# Projeto didático para iniciantes: 4 operações matemáticas com funções e condicionais.
# Para rodar: pip install pygame  ->  depois execute: python calculadora_pygame.py
# ==============================================================================

import pygame
import sys

# ------------------------------------------------------------------------------
# 1. FUNÇÕES MATEMÁTICAS BÁSICAS
# Cada função recebe dois números ('a' e 'b') e devolve o resultado da operação.
# ------------------------------------------------------------------------------

def somar(a, b):
    """Retorna a soma de dois números."""
    return a + b

def subtrair(a, b):
    """Retorna a diferença entre dois números."""
    return a - b

def multiplicar(a, b):
    """Retorna o produto de dois números."""
    return a * b

def dividir(a, b):
    """
    Retorna o quociente de a dividido por b.
    Estrutura condicional para proteger contra o erro matemático de divisão por zero!
    """
    if b == 0:
        return "Erro: Div por 0"
    return a / b

def calcular(num1, num2, operacao):
    """
    Usa a estrutura condicional if / elif / else para decidir
    qual função matemática chamar dependendo do símbolo da operação.
    """
    if operacao == '+':
        return somar(num1, num2)
    elif operacao == '-':
        return subtrair(num1, num2)
    elif operacao == '*':
        return multiplicar(num1, num2)
    elif operacao == '/':
        return dividir(num1, num2)
    else:
        return "Operação Inválida"


# ------------------------------------------------------------------------------
# 2. CONFIGURAÇÕES VISUAIS E CORES (RGB)
# Estética minimalista fora do padrão: tons elegantes, bordas suaves e alto contraste.
# ------------------------------------------------------------------------------

pygame.init()

LARGURA = 360
ALTURA = 560
TELA = pygame.display.set_mode((LARGURA, ALTURA))
pygame.display.set_caption("Calculadora Minimalista")

# Paleta de Cores (R, G, B)
COR_FUNDO          = (${fundoR}, ${fundoG}, ${fundoB})
COR_VISOR          = (${visorR}, ${visorG}, ${visorB})
COR_TEXTO          = (${txtR}, ${txtG}, ${txtB})
COR_SUBTEXTO       = (${subR}, ${subG}, ${subB})
COR_BOTAO_NUM      = (${btnNumR}, ${btnNumG}, ${btnNumB})
COR_BOTAO_NUM_HOV  = (${btnNumHovR}, ${btnNumHovG}, ${btnNumHovB})
COR_BOTAO_OP       = (${btnOpR}, ${btnOpG}, ${btnOpB})
COR_BOTAO_OP_HOV   = (${btnOpHovR}, ${btnOpHovG}, ${btnOpHovB})
COR_BOTAO_IGUAL    = (${eqR}, ${eqG}, ${eqB})
COR_DESTAQUE       = (${destR}, ${destG}, ${destB})
COR_BORDA          = (${bordaR}, ${bordaG}, ${bordaB})

# Fontes (usando fonte de sistema limpa)
FONTE_VISOR_GRANDE = pygame.font.SysTransFont("trebuchetms", 36, bold=True)
FONTE_VISOR_PEQ    = pygame.font.SysTransFont("trebuchetms", 18)
FONTE_BOTAO        = pygame.font.SysTransFont("trebuchetms", 22, bold=True)
FONTE_LABEL        = pygame.font.SysTransFont("trebuchetms", 12)


# ------------------------------------------------------------------------------
# 3. DEFINIÇÃO DA GRADE DE BOTÕES
# Organização em linhas e colunas com retângulos (pygame.Rect)
# ------------------------------------------------------------------------------

botoes = []
layout_botoes = [
    ['C', '+/-', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
]

INICIO_Y = 180
ESPACO = 12
MARGEM_X = 20
LARGURA_BOTAO = (LARGURA - (MARGEM_X * 2) - (ESPACO * 3)) // 4
ALTURA_BOTAO = 58

for linha_idx, linha in enumerate(layout_botoes):
    col_idx = 0
    for texto in linha:
        # Se for o botão '0', ele ocupa o dobro do espaço no rodapé minimalista
        if texto == '0':
            largura_atual = (LARGURA_BOTAO * 2) + ESPACO
        else:
            largura_atual = LARGURA_BOTAO
            
        x = MARGEM_X + col_idx * (LARGURA_BOTAO + ESPACO)
        y = INICIO_Y + linha_idx * (ALTURA_BOTAO + ESPACO)
        
        rect = pygame.Rect(x, y, largura_atual, ALTURA_BOTAO)
        
        # Categoriza o tipo do botão para aplicar a cor certa
        if texto in ['+', '-', '*', '/']:
            tipo = 'operacao'
        elif texto == '=':
            tipo = 'igual'
        elif texto in ['C', '+/-', '%']:
            tipo = 'especial'
        else:
            tipo = 'numero'
            
        botoes.append({'texto': texto, 'rect': rect, 'tipo': tipo})
        
        if texto == '0':
            col_idx += 2
        else:
            col_idx += 1


# ------------------------------------------------------------------------------
# 4. ESTADO DA CALCULADORA
# Variáveis que guardam o que o usuário digitou e o cálculo em andamento.
# ------------------------------------------------------------------------------

numero_atual = "0"
numero_anterior = None
operacao_pendente = None
historico_expressao = ""
limpar_na_proxima = False


# ------------------------------------------------------------------------------
# 5. LOOP PRINCIPAL DO PYGAME (GAME LOOP)
# Roda continuamente a 60 frames por segundo, escutando cliques e desenhando a tela.
# ------------------------------------------------------------------------------

relogio = pygame.time.Clock()
executando = True

while executando:
    posicao_mouse = pygame.mouse.get_pos()

    # --- PROCESSAMENTO DE EVENTOS ---
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            executando = False

        # Clique do Mouse
        elif evento.type == pygame.MOUSEBUTTONDOWN and evento.button == 1:
            for b in botoes:
                if b['rect'].collidepoint(evento.pos):
                    rotulo = b['texto']

                    # SE FOR NÚMERO OU PONTO
                    if rotulo in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']:
                        if limpar_na_proxima:
                            numero_atual = "0"
                            limpar_na_proxima = False

                        if rotulo == '.':
                            if '.' not in numero_atual:
                                numero_atual += '.'
                        else:
                            if numero_atual == "0":
                                numero_atual = rotulo
                            else:
                                numero_atual += rotulo

                    # SE FOR BOTÃO 'C' (LIMPAR TUDO)
                    elif rotulo == 'C':
                        numero_atual = "0"
                        numero_anterior = None
                        operacao_pendente = None
                        historico_expressao = ""

                    # SE FOR INVERSÃO DE SINAL (+/-)
                    elif rotulo == '+/-':
                        if numero_atual != "0" and "Erro" not in numero_atual:
                            if numero_atual.startswith('-'):
                                numero_atual = numero_atual[1:]
                            else:
                                numero_atual = '-' + numero_atual

                    # SE FOR UMA DAS QUATRO OPERAÇÕES (+, -, *, /)
                    elif rotulo in ['+', '-', '*', '/']:
                        if "Erro" in numero_atual:
                            continue
                            
                        # Se já havia uma operação pendente e o usuário apertou outro operador
                        if numero_anterior is not None and operacao_pendente is not None and not limpar_na_proxima:
                            num1 = float(numero_anterior)
                            num2 = float(numero_atual)
                            res = calcular(num1, num2, operacao_pendente)
                            if isinstance(res, str):
                                numero_atual = res
                                numero_anterior = None
                                operacao_pendente = None
                                historico_expressao = ""
                                limpar_na_proxima = True
                                continue
                            else:
                                numero_anterior = res
                                numero_atual = str(res)
                        else:
                            numero_anterior = float(numero_atual)

                        operacao_pendente = rotulo
                        historico_expressao = f"{numero_anterior} {operacao_pendente}"
                        limpar_na_proxima = True

                    # SE FOR O BOTÃO IGUAL (=)
                    elif rotulo == '=':
                        if numero_anterior is not None and operacao_pendente is not None:
                            num1 = float(numero_anterior)
                            num2 = float(numero_atual)
                            historico_expressao = f"{num1} {operacao_pendente} {num2} ="
                            
                            # Chama a nossa função condicional calcular!
                            resultado = calcular(num1, num2, operacao_pendente)

                            if isinstance(resultado, float):
                                # Remove .0 se for número inteiro para visual mais limpo
                                if resultado.is_integer():
                                    numero_atual = str(int(resultado))
                                else:
                                    numero_atual = f"{resultado:.6g}"
                            else:
                                numero_atual = str(resultado)

                            numero_anterior = None
                            operacao_pendente = None
                            limpar_na_proxima = True

        # Suporte ao Teclado Físico
        elif evento.type == pygame.KEYDOWN:
            if evento.key in [pygame.K_0, pygame.K_KP0]:
                numero_atual = ("0" if limpar_na_proxima or numero_atual == "0" else numero_atual + "0")
                limpar_na_proxima = False
            elif evento.key == pygame.K_ESCAPE:
                numero_atual = "0"
                numero_anterior = None
                operacao_pendente = None
                historico_expressao = ""
            elif evento.key == pygame.K_BACKSPACE:
                if len(numero_atual) > 1:
                    numero_atual = numero_atual[:-1]
                else:
                    numero_atual = "0"

    # --- DESENHO NA TELA (RENDERIZAÇÃO) ---
    # 1. Limpa a tela com a cor de fundo
    TELA.fill(COR_FUNDO)

    # 2. Desenha o Visor OLED Minimalista
    rect_visor = pygame.Rect(MARGEM_X, 24, LARGURA - (MARGEM_X * 2), 130)
    pygame.draw.rect(TELA, COR_VISOR, rect_visor, border_radius=16)
    pygame.draw.rect(TELA, COR_BORDA, rect_visor, width=1, border_radius=16)

    # Texto pequeno do histórico
    txt_hist = FONTE_VISOR_PEQ.render(historico_expressao, True, COR_SUBTEXTO)
    TELA.blit(txt_hist, (rect_visor.x + 18, rect_visor.y + 16))

    # Operador ativo no canto do visor
    if operacao_pendente:
        txt_op = FONTE_LABEL.render(f"OP: {operacao_pendente}", True, COR_DESTAQUE)
        TELA.blit(txt_op, (rect_visor.right - 60, rect_visor.y + 18))

    # Texto principal com o número atual ou resultado
    texto_para_exibir = numero_atual
    if len(texto_para_exibir) > 13:
        texto_para_exibir = texto_para_exibir[:13] + "..."
    surf_num = FONTE_VISOR_GRANDE.render(texto_para_exibir, True, COR_TEXTO)
    pos_num_x = rect_visor.right - surf_num.get_width() - 20
    pos_num_y = rect_visor.bottom - surf_num.get_height() - 16
    TELA.blit(surf_num, (pos_num_x, pos_num_y))

    # 3. Desenha cada um dos botões
    for b in botoes:
        esta_hover = b['rect'].collidepoint(posicao_mouse)
        
        # Escolhe a cor com base no tipo e no hover
        if b['tipo'] == 'igual':
            cor_botao = COR_BOTAO_IGUAL
        elif b['tipo'] in ['operacao', 'especial']:
            cor_botao = COR_BOTAO_OP_HOV if esta_hover else COR_BOTAO_OP
        else:
            cor_botao = COR_BOTAO_NUM_HOV if esta_hover else COR_BOTAO_NUM

        # Se for a operação ativa no momento, destaca o botão
        if b['texto'] == operacao_pendente and not limpar_na_proxima:
            cor_botao = COR_DESTAQUE

        pygame.draw.rect(TELA, cor_botao, b['rect'], border_radius=12)
        pygame.draw.rect(TELA, COR_BORDA, b['rect'], width=1, border_radius=12)

        # Cor do texto do botão
        cor_txt_botao = COR_TEXTO
        if b['texto'] == operacao_pendente and not limpar_na_proxima:
            cor_txt_botao = COR_VISOR

        surf_txt = FONTE_BOTAO.render(b['texto'], True, cor_txt_botao)
        centro_x = b['rect'].centerx - (surf_txt.get_width() // 2)
        centro_y = b['rect'].centery - (surf_txt.get_height() // 2)
        TELA.blit(surf_txt, (centro_x, centro_y))

    # 4. Atualiza o display e limita a 60 FPS
    pygame.display.flip()
    relogio.tick(60)

# Finaliza o Pygame
pygame.quit()
sys.exit()
`;
}

export function generateTerminalCode(): string {
  return `# ==============================================================================
# CALCULADORA BÁSICA EM PYTHON (VERSÃO CONSOLE / TERMINAL)
# Ideal para quem está dando os primeiros passos antes de ir para o Pygame!
# Utiliza apenas funções básicas (def) e estruturas condicionais (if, elif, else).
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. NOSSAS FUNÇÕES MATEMÁTICAS
# Uma função em Python é definida com a palavra-chave 'def', seguida pelo nome
# e pelos parâmetros entre parênteses. O comando 'return' envia o resultado de volta.
# ------------------------------------------------------------------------------

def somar(a, b):
    return a + b

def subtrair(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir(a, b):
    # A estrutura condicional IF verifica se o divisor é zero
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    else:
        return a / b

def calcular(num1, num2, operacao):
    # O IF / ELIF / ELSE testa qual símbolo o usuário escolheu
    if operacao == '+':
        return somar(num1, num2)
    elif operacao == '-':
        return subtrair(num1, num2)
    elif operacao == '*':
        return multiplicar(num1, num2)
    elif operacao == '/':
        return dividir(num1, num2)
    else:
        return "Operação não reconhecida!"


# ------------------------------------------------------------------------------
# 2. PROGRAMA PRINCIPAL
# Pede os valores ao usuário, converte para float (decimal) e exibe o resultado.
# ------------------------------------------------------------------------------

def main():
    print("=" * 45)
    print("     CALCULADORA SIMPLES EM PYTHON")
    print("=" * 45)
    print("Operações disponíveis:")
    print("  +  -> Soma")
    print("  -  -> Subtração")
    print("  *  -> Multiplicação")
    print("  /  -> Divisão")
    print("-" * 45)

    try:
        # Entrada do primeiro número
        num1 = float(input("Digite o primeiro número: "))

        # Escolha da operação
        operacao = input("Digite a operação (+, -, *, /): ").strip()

        # Entrada do segundo número
        num2 = float(input("Digite o segundo número: "))

        # Chamada da nossa função de cálculo com condicional
        resultado = calcular(num1, num2, operacao)

        print("-" * 45)
        print(f"Resultado: {num1} {operacao} {num2} = {resultado}")
        print("=" * 45)

    except ValueError:
        print("Erro: Por favor, digite apenas números válidos!")

# Executa o programa
if __name__ == "__main__":
    main()
`;
}

export interface ConceptExplanation {
  id: string;
  titulo: string;
  subtitulo: string;
  icone: string;
  resumo: string;
  codigoExemplo: string;
  pontosChave: string[];
}

export const EXPLANATIONS: ConceptExplanation[] = [
  {
    id: 'funcoes',
    titulo: '1. Funções Matemáticas Básicas (def)',
    subtitulo: 'Isolando cada operação em um bloco reutilizável',
    icone: 'Code2',
    resumo: 'Em Python, criamos uma função usando a palavra reservada `def`. Funções recebem argumentos de entrada e usam `return` para devolver o resultado.',
    codigoExemplo: `def somar(a, b):
    return a + b

def dividir(a, b):
    # Proteção de divisão por zero!
    if b == 0:
        return "Erro: Div por 0"
    return a / b`,
    pontosChave: [
      'Separação de responsabilidades: cada função faz exatamente uma coisa bem feita.',
      'Parâmetros (a, b) recebem os números informados pelo usuário.',
      'A instrução return entrega o resultado calculado para quem chamou a função.',
    ],
  },
  {
    id: 'condicionais',
    titulo: '2. Estruturas Condicionais (if / elif / else)',
    subtitulo: 'Tomando decisões lógicas no fluxo do código',
    icone: 'GitBranch',
    resumo: 'As condicionais permitem que o programa teste condições e escolha qual caminho seguir. No nosso código, usamos para verificar qual botão de operação foi pressionado.',
    codigoExemplo: `def calcular(num1, num2, operacao):
    if operacao == '+':
        return somar(num1, num2)
    elif operacao == '-':
        return subtrair(num1, num2)
    elif operacao == '*':
        return multiplicar(num1, num2)
    elif operacao == '/':
        return dividir(num1, num2)
    else:
        return "Operação Inválida"`,
    pontosChave: [
      'if: testa a primeira condição (se for soma, chama somar).',
      'elif: significa "senão, se..." e permite encadear múltiplos testes em ordem.',
      'else: caso de segurança executado se nenhuma das opções anteriores for verdadeira.',
    ],
  },
  {
    id: 'pygame-loop',
    titulo: '3. O Loop Principal do Pygame (Game Loop)',
    subtitulo: 'O coração de qualquer interface interativa a 60 FPS',
    icone: 'RotateCw',
    resumo: 'Diferente de um programa de console que roda e para, o Pygame precisa de um laço `while executando:` contínuo para manter a janela aberta, ouvir interações e redesenhar os pixels.',
    codigoExemplo: `relogio = pygame.time.Clock()
executando = True

while executando:
    # 1. Processa eventos (cliques, teclas)
    # 2. Atualiza estado da lógica
    # 3. Desenha os elementos na tela
    pygame.display.flip()
    relogio.tick(60) # Crava em 60 quadros por segundo`,
    pontosChave: [
      'while executando: mantém o app rodando até o usuário clicar em fechar.',
      'pygame.display.flip(): atualiza todos os pixels da tela no monitor.',
      'relogio.tick(60): impede que a CPU use 100% de uso desnecessariamente, mantendo a animação suave.',
    ],
  },
  {
    id: 'pygame-eventos',
    titulo: '4. Fila de Eventos e Detecção de Cliques',
    subtitulo: 'Como o Pygame sabe qual botão foi pressionado',
    icone: 'MousePointerClick',
    resumo: 'O Pygame armazena todas as ações do usuário (clique, movimento do mouse, teclas pressionadas) em uma fila consultada com `pygame.event.get()`.',
    codigoExemplo: `for evento in pygame.event.get():
    if evento.type == pygame.QUIT:
        executando = False
    elif evento.type == pygame.MOUSEBUTTONDOWN:
        # Verifica se o clique acertou o retângulo do botão
        if botao_rect.collidepoint(evento.pos):
            print("Botão clicado!")`,
    pontosChave: [
      'evento.type == pygame.QUIT: detecta quando o usuário clica no "X" da janela.',
      'rect.collidepoint(evento.pos): função matemática geométrica embutida no Pygame para testar se as coordenadas (X, Y) do clique estão dentro do retângulo do botão.',
      'evento.type == pygame.KEYDOWN: permite atalhos rápidos com o teclado numérico.',
    ],
  },
  {
    id: 'pygame-desenho',
    titulo: '5. Renderização Minimalista (draw e blit)',
    subtitulo: 'Desenhando superfícies, retângulos arredondados e tipografia',
    icone: 'Palette',
    resumo: 'Para criar uma estética limpa fora do padrão, usamos `pygame.draw.rect` com `border_radius` para cantos suaves e `fonte.render()` para textos nítidos.',
    codigoExemplo: `# Desenha um retângulo com cantos arredondados
pygame.draw.rect(tela, COR_BOTAO, retangulo, border_radius=12)

# Renderiza o texto do botão e cola na tela com blit
superficie_texto = fonte.render("7", True, COR_TEXTO)
tela.blit(superficie_texto, (pos_x, pos_y))`,
    pontosChave: [
      'RGB (Red, Green, Blue): tuplas de 0 a 255 definem as cores personalizadas.',
      'border_radius: cria cantos modernos e arredondados sem imagens pesadas.',
      'blit: significa "Block Transfer", desenha uma imagem/texto sobre a superfície principal da tela.',
    ],
  },
];
