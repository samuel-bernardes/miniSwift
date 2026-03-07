# 🛠️ MiniSwift — Interpretador de Linguagem

> Interpretador para uma linguagem de programação inspirada em **Swift**, desenvolvido em **TypeScript** como projeto da disciplina **Linguagens de Programação** no CEFET-MG.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Pré-requisitos e Instalação](#-pré-requisitos-e-instalação)
- [Como Executar](#-como-executar)
- [Gramática da Linguagem](#-gramática-da-linguagem)
- [Sistema de Tipos](#-sistema-de-tipos)
- [Funcionalidades da Linguagem](#-funcionalidades-da-linguagem)
- [Exemplos de Código](#-exemplos-de-código)
- [Estrutura de Arquivos](#-estrutura-de-arquivos)
- [Tratamento de Erros](#-tratamento-de-erros)
- [Autores](#-autores)

---

## 🔍 Visão Geral

O **MiniSwift** é um interpretador _tree-walk_ (interpretação por caminhamento na árvore) que processa código-fonte em 3 fases:

```
Código-fonte (.mswift)
        │
        ▼
┌──────────────────┐
│ Análise Léxica   │  → Transforma caracteres em tokens
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Análise Sintática│  → Transforma tokens em AST (árvore de comandos)
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Interpretação    │  → Executa a AST diretamente
└──────────────────┘
```

A linguagem suporta **tipagem estática**, **variáveis mutáveis e constantes**, **estruturas de controle**, **tipos compostos** (Array e Dict), **conversão de tipos**, e **funções embutidas**.

---

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura modular dividida em 4 módulos principais:

### 1. Módulo Léxico (`src/lexical/`)

| Arquivo              | Responsabilidade                                                             |
| -------------------- | ---------------------------------------------------------------------------- |
| `Token.ts`           | Define a classe `Token` e o enum `TokenType` com todos os 63 tipos de tokens |
| `LexicalAnalysis.ts` | Implementa o **autômato de estados finitos** com 15 estados para tokenização |

O analisador léxico utiliza um autômato com os seguintes estados principais:

- **Estado 1**: Estado inicial — identifica o tipo do caractere e transiciona
- **Estados 2-4**: Tratamento de comentários de bloco (`/* ... */`)
- **Estado 5**: Operadores compostos (`==`, `!=`, `<=`, `>=`)
- **Estados 6-7**: Operadores lógicos (`&&`, `||`)
- **Estado 8**: Identificadores e palavras reservadas
- **Estados 9-10**: Literais numéricos (inteiros e float)
- **Estados 11-12**: Literais de caractere (`'c'`)
- **Estado 13**: Literais de string (`"texto"`)
- **Estado 14**: Estado final — token completo (palavra-chave ou nome)
- **Estado 15**: Estado final — token literal ou erro

### 2. Módulo Sintático (`src/syntatic/`)

| Arquivo                | Responsabilidade                                                         |
| ---------------------- | ------------------------------------------------------------------------ |
| `SyntaticAnalysis.ts`  | Parser **descendente recursivo** — 938 linhas com 30+ regras gramaticais |
| `SyntaticException.ts` | Exceção para erros sintáticos                                            |

O parser constrói a AST (Abstract Syntax Tree) consumindo tokens e instanciando nós de `Command` e `Expr` correspondentes. Cada regra gramatical é implementada como um método `proc*()`.

### 3. Módulo Interpretador (`src/interpreter/`)

Dividido em 4 subpacotes:

#### 3.1 Comandos (`command/`)

| Classe              | Descrição                                                    |
| ------------------- | ------------------------------------------------------------ |
| `Command`           | Classe abstrata base com método `execute()`                  |
| `BlocksCommand`     | Executa uma sequência de comandos                            |
| `InitializeCommand` | Inicializa variáveis com um valor                            |
| `AssignCommand`     | Atribui valor a uma expressão l-value                        |
| `PrintCommand`      | Saída com `print()` (sem quebra) ou `println()` (com quebra) |
| `DumpCommand`       | Debug — imprime o objeto `Value` completo via `console.log`  |
| `IfCommand`         | Condicional `if`/`else`                                      |
| `WhileCommand`      | Laço `while`                                                 |
| `ForCommand`        | Laço `for-in` sobre Arrays e Strings                         |

#### 3.2 Expressões (`expr/`)

| Classe            | Descrição                                                                    |
| ----------------- | ---------------------------------------------------------------------------- |
| `Expr`            | Classe abstrata base com método `expr(): Value`                              |
| `SetExpr`         | Expressão que pode receber atribuição (l-value)                              |
| `Variable`        | Variável — implementa leitura, escrita e verificação de tipo/constância      |
| `ConstExpr`       | Literal constante                                                            |
| `BinaryExpr`      | Operações binárias (aritméticas, relacionais, lógicas)                       |
| `UnaryExpr`       | Operadores unários (`!` negação lógica, `-` negação aritmética)              |
| `ConditionalExpr` | Operador ternário (`cond ? expr1 : expr2`)                                   |
| `ActionExpr`      | Ações de I/O — `read()` e `random()`                                         |
| `CastExpr`        | Casting de tipos (`toBool`, `toInt`, `toFloat`, `toChar`, `toString`)        |
| `ArrayExpr`       | Criação de arrays                                                            |
| `DictExpr`        | Criação de dicionários                                                       |
| `FunctionExpr`    | Funções embutidas (`count`, `empty`, `keys`, `values`, `append`, `contains`) |
| `AccessExpr`      | Acesso por índice em Arrays, Dicts e Strings                                 |

#### 3.3 Sistema de Tipos (`type/`)

| Classe                                                       | Descrição                                         |
| ------------------------------------------------------------ | ------------------------------------------------- |
| `Type`                                                       | Classe abstrata com `Category` e método `match()` |
| `PrimitiveType`                                              | Base para tipos primitivos (Singleton)            |
| `BoolType`, `IntType`, `FloatType`, `CharType`, `StringType` | Tipos primitivos                                  |
| `ComposedType`, `ArrayType`, `DictType`                      | Tipos compostos parametrizados                    |

#### 3.4 Valores (`value/`)

| Classe  | Descrição                                                            |
| ------- | -------------------------------------------------------------------- |
| `Value` | Encapsula `type: Type` + `data: unknown` com validação no construtor |

### 4. Módulo de Erros (`src/error/`)

| Classe              | Descrição                                                              |
| ------------------- | ---------------------------------------------------------------------- |
| `LanguageException` | Erros da linguagem (léxicos, sintáticos, semânticos) com linha do erro |
| `InternalException` | Erros internos do interpretador (bugs)                                 |

---

## 📦 Pré-requisitos e Instalação

### Pré-requisitos

- **Node.js** (versão 16+)
- **TypeScript** (versão 5.2+)

Verifique as instalações:

```bash
node --version
tsc --version
```

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd miniSwifit

# Instale as dependências
npm install

# Compile o projeto
tsc
```

---

## 🚀 Como Executar

### Modo Arquivo

Executa um arquivo `.mswift`:

```bash
node dist/msi.js "caminho/para/arquivo.mswift"
```

### Modo Interativo (REPL)

Abre um prompt para digitar comandos:

```bash
node dist/msi.js
```

---

## 📖 Gramática da Linguagem

A gramática é definida em **EBNF** (Extended Backus-Naur Form):

```ebnf
<code>      ::= { <cmd> }

<cmd>       ::= <block> | <decl> | <print> | <dump> | <if> | <while> | <for> | <assign>

<block>     ::= '{' <code> '}'

<decl>      ::= <var> | <let>

<var>       ::= 'var' <name> ':' <type> [ '=' <expr> ] { ',' <name> ':' <type> [ '=' <expr> ] } [';']

<let>       ::= 'let' <name> ':' <type> '=' <expr> { ',' <name> ':' <type> '=' <expr> } [';']

<print>     ::= ('print' | 'println') '(' <expr> ')' [';']

<dump>      ::= 'dump' '(' <expr> ')' [';']

<if>        ::= 'if' <expr> <cmd> [ 'else' <cmd> ]

<while>     ::= 'while' <expr> <cmd>

<for>       ::= 'for' ( <name> | ('var' | 'let') <name> ':' <type> ) 'in' <expr> <cmd>

<assign>    ::= <expr> '=' <expr> [';']

<type>      ::= <primitive> | <composed>

<primitive> ::= 'Bool' | 'Int' | 'Float' | 'Char' | 'String'

<composed>  ::= <arraytype> | <dicttype>

<arraytype> ::= 'Array' '<' <type> '>'

<dicttype>  ::= 'Dict' '<' <type> ',' <type> '>'

<expr>      ::= <cond> [ '?' <expr> ':' <expr> ]

<cond>      ::= <rel> { ('&&' | '||') <rel> }

<rel>       ::= <arith> [ ('<' | '>' | '<=' | '>=' | '==' | '!=') <arith> ]

<arith>     ::= <term> { ('+' | '-') <term> }

<term>      ::= <prefix> { ('*' | '/') <prefix> }

<prefix>    ::= [ '!' | '-' ] <factor>

<factor>    ::= ( '(' <expr> ')' | <rvalue> ) <function>

<rvalue>    ::= <const> | <action> | <cast> | <array> | <dict> | <lvalue>

<const>     ::= <bool> | <int> | <float> | <char> | <string>

<action>    ::= ('read' | 'random') '(' ')'

<cast>      ::= ('toBool' | 'toInt' | 'toFloat' | 'toChar' | 'toString') '(' <expr> ')'

<array>     ::= <arraytype> '(' [ <expr> { ',' <expr> } ] ')'

<dict>      ::= <dicttype> '(' [ <expr> ':' <expr> { ',' <expr> ':' <expr> } ] ')'

<lvalue>    ::= <name> { '[' <expr> ']' }

<function>  ::= { '.' ( <fnoargs> | <fonearg> ) }

<fnoargs>   ::= ('count' | 'empty' | 'keys' | 'values') '(' ')'

<fonearg>   ::= ('append' | 'contains') '(' <expr> ')'
```

### Precedência de Operadores (menor → maior)

| Nível | Operadores                  | Associatividade |
| ----- | --------------------------- | --------------- |
| 1     | `? :` (ternário)            | Direita         |
| 2     | `\|\|`                      | Esquerda        |
| 3     | `&&`                        | Esquerda        |
| 4     | `==` `!=` `<` `>` `<=` `>=` | —               |
| 5     | `+` `-`                     | Esquerda        |
| 6     | `*` `/`                     | Esquerda        |
| 7     | `!` `-` (unários)           | —               |

---

## 🎯 Sistema de Tipos

### Tipos Primitivos

| Tipo     | Descrição            | Exemplo         |
| -------- | -------------------- | --------------- |
| `Bool`   | Booleano             | `true`, `false` |
| `Int`    | Inteiro              | `42`, `-7`      |
| `Float`  | Ponto flutuante      | `3.14`, `-0.5`  |
| `Char`   | Caractere único      | `'a'`, `'Z'`    |
| `String` | Cadeia de caracteres | `"olá mundo"`   |

### Tipos Compostos

| Tipo        | Descrição         | Exemplo de declaração                                |
| ----------- | ----------------- | ---------------------------------------------------- |
| `Array<T>`  | Lista tipada      | `var nums: Array<Int> = Array<Int>(1, 2, 3)`         |
| `Dict<K,V>` | Dicionário tipado | `var m: Dict<String,Int> = Dict<String,Int>("a": 1)` |

### Conversão de Tipos (Casting)

| Função           | Descrição                                             |
| ---------------- | ----------------------------------------------------- |
| `toBool(expr)`   | Converte para Bool (Arrays/Dicts: vazio = false)      |
| `toInt(expr)`    | Converte para Int (Float trunca, Char → código ASCII) |
| `toFloat(expr)`  | Converte para Float                                   |
| `toChar(expr)`   | Converte código numérico para caractere               |
| `toString(expr)` | Converte qualquer valor para String                   |

---

## ⚙️ Funcionalidades da Linguagem

### Declaração de Variáveis

```swift
var x: Int = 10          /* variável mutável */
let pi: Float = 3.14     /* constante (imutável) */
var a: Int, b: Int = 5   /* declaração múltipla */
```

### Estruturas de Controle

```swift
/* Condicional */
if x > 0 {
    println("positivo")
} else {
    println("não-positivo")
}

/* Laço while */
var i: Int = 0
while i < 10 {
    println(i)
    i = i + 1
}

/* Laço for-in (sobre array) */
var nums: Array<Int> = Array<Int>(1, 2, 3)
for let n: Int in nums {
    println(n)
}

/* Laço for-in (sobre string) */
for let c: Char in "hello" {
    print(c)
}
```

### Entrada e Saída

```swift
print("Digite seu nome: ")
var nome: String = read()       /* leitura de string do terminal */
println("Olá, " + nome)

var r: Float = random()         /* número aleatório entre 0.0 e 1.0 */

dump(nome)                      /* debug: imprime o objeto Value completo */
```

### Operador Ternário

```swift
var status: String = x > 0 ? "positivo" : "não-positivo"
```

### Arrays

```swift
var lista: Array<Int> = Array<Int>(10, 20, 30)
println(lista[0])                           /* acesso por índice: 10 */
lista[1] = 25                               /* atribuição por índice */
println(lista.count())                      /* tamanho: 3 */
println(lista.empty())                      /* está vazio?: false */
println(lista.contains(20))                 /* contém 20?: false (foi alterado para 25) */
lista = lista.append(40)                    /* adicionar elemento */
```

### Dicionários

```swift
var map: Dict<String,Int> = Dict<String,Int>("um": 1, "dois": 2)
println(map["um"])                          /* acesso por chave: 1 */
map["tres"] = 3                             /* inserir novo par */

var chaves: Array<String> = map.keys()      /* obter chaves */
var valores: Array<Int> = map.values()      /* obter valores */
println(map.empty())                        /* está vazio?: false */
```

### Concatenação

```swift
/* Strings */
var saudacao: String = "Olá" + " " + "Mundo"

/* Arrays */
var a: Array<Int> = Array<Int>(1, 2) + Array<Int>(3, 4)

/* Dicionários */
var d: Dict<String,Int> = Dict<String,Int>("a": 1) + Dict<String,Int>("b": 2)
```

### Comentários

```swift
/* Este é um comentário de bloco */
var x: Int = 42 /* comentário inline */
```

> **Nota:** A linguagem suporta apenas comentários de bloco (`/* ... */`), não suporta comentários de linha (`//`).

---

## 📁 Estrutura de Arquivos

```
miniSwifit/
├── src/
│   ├── msi.ts                          # Ponto de entrada (CLI)
│   ├── lexical/
│   │   ├── Token.ts                    # Token + TokenType enum
│   │   └── LexicalAnalysis.ts          # Analisador léxico (autômato)
│   ├── syntatic/
│   │   ├── SyntaticAnalysis.ts         # Parser descendente recursivo
│   │   └── SyntaticException.ts        # Exceção sintática
│   ├── interpreter/
│   │   ├── Interpreter.ts              # Classe principal do interpretador
│   │   ├── Environment.ts              # Tabela de símbolos (escopos encadeados)
│   │   ├── command/                    # Nós de comando da AST
│   │   │   ├── Command.ts
│   │   │   ├── BlocksCommand.ts
│   │   │   ├── AssignCommand.ts
│   │   │   ├── InitializeCommand.ts
│   │   │   ├── PrintCommand.ts
│   │   │   ├── DumpCommand.ts
│   │   │   ├── IfCommand.ts
│   │   │   ├── WhileCommand.ts
│   │   │   └── ForCommand.ts
│   │   ├── expr/                       # Nós de expressão da AST
│   │   │   ├── Expr.ts
│   │   │   ├── SetExpr.ts
│   │   │   ├── Variable.ts
│   │   │   ├── ConstExpr.ts
│   │   │   ├── BinaryExpr.ts
│   │   │   ├── UnaryExpr.ts
│   │   │   ├── ConditionalExpr.ts
│   │   │   ├── ActionExpr.ts
│   │   │   ├── CastExpr.ts
│   │   │   ├── ArrayExpr.ts
│   │   │   ├── DictExpr.ts
│   │   │   ├── FunctionExpr.ts
│   │   │   └── AccessExpr.ts
│   │   ├── type/                       # Sistema de tipos
│   │   │   ├── Type.ts
│   │   │   ├── TypeException.ts
│   │   │   ├── primitive/
│   │   │   │   ├── PrimitiveType.ts
│   │   │   │   └── types/
│   │   │   │       ├── BoolType.ts
│   │   │   │       ├── IntType.ts
│   │   │   │       ├── FloatType.ts
│   │   │   │       ├── CharType.ts
│   │   │   │       ├── StringType.ts
│   │   │   │       └── index.ts
│   │   │   └── composed/
│   │   │       └── ComposedType.ts
│   │   └── value/
│   │       └── Value.ts               # Encapsulamento tipo + dado
│   └── error/
│       ├── LanguageException.ts        # Erros da linguagem
│       └── InternalException.ts        # Erros internos
├── package.json
├── tsconfig.json
└── README.md
```

---

## ❌ Tratamento de Erros

Todas as mensagens de erro incluem o **número da linha** onde ocorreu o problema:

| Erro                      | Mensagem                            | Causa                                   |
| ------------------------- | ----------------------------------- | --------------------------------------- |
| `InvalidLexeme`           | Lexema inválido                     | Caractere não reconhecido               |
| `UnexpectedEOF`           | Fim de arquivo inesperado           | Arquivo termina no meio de um token     |
| `UnexpectedLexeme`        | Lexema não esperado                 | Token inesperado na posição atual       |
| `UndeclaredVariable`      | Variável não declarada              | Uso de variável sem declaração prévia   |
| `AlreadyDeclaredVariable` | Variável já declarada anteriormente | Redeclaração no mesmo escopo            |
| `UninitializedVariable`   | Variável não inicializada           | Leitura de variável sem valor atribuído |
| `ConstantAssignment`      | Atribuição em variável constante    | Tentar modificar uma variável `let`     |
| `InvalidType`             | Tipo inválido                       | Operação entre tipos incompatíveis      |
| `InvalidOperation`        | Operação inválida                   | Operação não suportada para o tipo      |
| `InvalidValue`            | Valor inesperado                    | Valor literal mal formado               |

---

## 👥 Autores

- **Samuel Bernardes**
- **John Martins**

Projeto desenvolvido para a disciplina de **Linguagens de Programação** — CEFET-MG.
