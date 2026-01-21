# Quiz Câmara dos Deputados 🏛️

Um jogo de perguntas e respostas interativo desenvolvido com **Phaser 3** para auxiliar nos estudos para o concurso da Câmara dos Deputados. O foco é em **Direito Constitucional** e **Regimento Interno**.

## 🎮 Como Jogar

1.  **Acesse o Jogo**: Abra `index.html` no seu navegador ou acesse o link da versão online.
2.  **Inicie**: Clique em "INICIAR QUIZ".
3.  **Responda**: Você tem **20 segundos** por questão.
4.  **Admin**: Use o botão "Gerenciar Questões" no menu para importar seus próprios simulados.

## 🚀 Como Colocar Online

### Opção 1: Netlify (Conexão com GitHub - Recomendado ⭐️)
Isso garante que toda vez que você atualizar o código no GitHub, o site atualiza sozinho.

1.  Acesse [app.netlify.com](https://app.netlify.com).
2.  Clique em **"Add new site"** > **"Import an existing project"**.
3.  Escolha **GitHub**.
4.  Procure por `quiz-camara` e selecione.
5.  Clique em **Deploy Site**.

### Opção 2: Netlify Drop (Manual)
1.  Acesse [app.netlify.com/drop](https://app.netlify.com/drop).
2.  Arraste a pasta `quiz-camara` inteira para a área indicada.

### Opção 2: GitHub Pages
1.  Crie um repositório no GitHub.
2.  Suba os arquivos (`index.html`, `game.js`, `questions.js`, etc.).
3.  Vá em **Settings > Pages**.
4.  Em "Source", selecione a branch `main` e salve.

## 🛠️ Tecnologias
*   HTML5 & CSS3
*   JavaScript (ES6+)
*   Phaser 3 (Game Framework)

## ⚙️ Personalização (Modo Admin)
O jogo possui um sistema de **Admin** embutido que salva simulados no seu navegador (`LocalStorage`).
*   Gere questões com IA (ChatGPT/Gemini) usando o prompt fornecido na aba Admin.
*   Importe o JSON e jogue seus próprios simulados.

---
*Bons estudos!*
