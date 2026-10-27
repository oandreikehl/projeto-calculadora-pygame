# 🧮 Calculadora Minimalista em Python & Pygame

Uma calculadora com design minimalista desenvolvida em **Python** utilizando a biblioteca **Pygame**. O projeto foi criado com fins didáticos para iniciantes em programação, demonstrando o uso prático de **funções básicas (`def`)** e **estruturas condicionais (`if / elif / else`)** para executar as quatro operações matemáticas fundamentais com tratamento de erros e interface gráfica interativa.

---

## ✨ Características

- **Design Minimalista**: Interface moderna, limpa e funcional inspirada em conceitos de design industrial e produtos como os da Braun e Teenage Engineering.
- **Quatro Operações Básicas**: Adição (`+`), subtração (`-`), multiplicação (`*`) e divisão (`/`).
- **Prevenção de Erros**: Tratamento condicional contra o erro matemático de divisão por zero (`if b == 0`).
- **Dois Temas Visuais**:
  - 🌙 **Tema Escuro (Black)**: Tons grafite profundos, visor OLED e acentos em cor âmbar.
  - ☀️ **Tema Claro (Branco)**: Fundo branco limpo, botões suaves e alta legibilidade.
- **Totalmente Interativa**: Suporte a cliques com o mouse (detecção geométrica com `rect.collidepoint`) e entrada por teclado físico (números 0–9, operadores, `Enter` e `Esc`).
- **Código Limpo e Comentado**: Funções modulares e game loop a 60 FPS bem estruturado para fácil leitura e estudo.

---

## 🛠️ Tecnologias Utilizadas

- **[Python 3.10+](https://www.python.org/)** — Linguagem principal.
- **[Pygame](https://www.pygame.org/)** — Biblioteca para renderização gráfica da janela, desenho de superfícies e processamento da fila de eventos.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter o Python 3 instalado no seu computador. Verifique executando:
```bash
python --version
```

### 1. Clonar ou Baixar o Repositório
```bash
git clone https://github.com/seu-usuario/calculadora-pygame-minimalista.git
cd calculadora-pygame-minimalista
```

### 2. Instalar a biblioteca Pygame
No terminal ou prompt de comando, execute:
```bash
pip install pygame
```

### 3. Rodar a Calculadora
```bash
python calculadora_pygame.py
```

---

## ⌨️ Atalhos do Teclado

| Tecla | Ação |
| :--- | :--- |
| `0` a `9` | Digitar números |
| `.` | Ponto decimal |
| `+`, `-`, `*`, `/` | Selecionar a operação matemática |
| `Enter` ou `=` | Calcular o resultado |
| `Esc` ou `C` | Limpar visor e resetar o cálculo |
| `Backspace` | Apagar o último dígito digitado |

---

## 🧠 Como o Código Funciona

O projeto é estruturado em três pilares fundamentais:

### 1. Funções Matemáticas (`def`)
Cada operação é isolada em sua própria função pura, tornando o código reutilizável e legível:
```python
def somar(a, b):
    return a + b

def subtrair(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir(a, b):
    if b == 0:
        return "Erro: Div por 0"
    return a / b
```

### 2. Estrutura Condicional (`if / elif / else`)
A função controladora `calcular` decide qual função chamar com base no operador selecionado:
```python
def calcular(num1, num2, operacao):
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
```

### 3. O Game Loop do Pygame
Um laço contínuo `while executando:` que escuta eventos a 60 quadros por segundo, atualiza o visor e redesenha a tela:
```python
while executando:
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            executando = False
        elif evento.type == pygame.MOUSEBUTTONDOWN:
            # Detecta se clicou em algum botão
            ...
    
    # Desenho da interface gráfica
    TELA.fill(COR_FUNDO)
    ...
    pygame.display.flip()
    relogio.tick(60)
```

---

## 📄 Licença

Este projeto é de código aberto sob a licença [MIT](LICENSE). Sinta-se à vontade para estudar, modificar e compartilhar!
