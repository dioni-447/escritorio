# Surpresa 💗

Site estático (HTML, CSS e JavaScript puro) que começa como um site de escritório de advocacia e termina em uma carta romântica.

## Estrutura

```text
surpresa/
├── index.html        → fachada institucional
├── carta.html        → página secreta (carta)
├── css/style.css     → estilo da fachada e das caixas de confirmação
├── css/carta.css     → estilo da carta
├── js/script.js      → botão suspeito, confirmações, botão NÃO que foge
├── js/carta.js       → envelope, revelação, música
└── assets/
    ├── images/       → coloque suas fotos aqui
    └── music/        → coloque sua música aqui
```

## Como testar no computador

Basta dar dois cliques em `index.html` (abre no navegador). Não precisa de servidor.

Para testar no celular antes de publicar, publique no GitHub Pages (abaixo) e abra o link.

## Como escrever a carta

1. Abra `carta.html` em um editor de texto.
2. Procure o comentário `ESPAÇO RESERVADO` (dentro de `<div class="letter-body">`).
3. Apague o bloco `<div class="placeholder">` e escreva seus parágrafos assim:

```html
<p>Primeiro parágrafo.</p>
<p>Segundo parágrafo.<br>Nova linha dentro do mesmo parágrafo.</p>
```

4. Mais abaixo, troque `[ Seu nome ]` pela sua assinatura (e a frase "Com todo o meu carinho," se quiser).

## Fotos (opcional)

1. Copie as fotos para `assets/images/` (prefira JPG com até ~300 KB cada, para carregar rápido no celular).
2. Em `carta.html`, procure `FOTOS E LEMBRANÇAS`, descomente as `<figure>` e ajuste `src`, `alt` e a legenda.
3. A seção só aparece se houver pelo menos uma `<figure>`. Sem fotos, nada é exibido.

## Música (opcional)

1. Use uma faixa instrumental **livre de direitos autorais** (ex.: sua própria gravação, ou músicas com licença livre/royalty-free).
2. Copie o arquivo (ex.: `fundo.mp3`) para `assets/music/`.
3. Em `carta.html`, preencha: `<audio id="musica" loop preload="none" src="assets/music/fundo.mp3"></audio>`
4. A música começa quando ela toca no envelope (exigência dos navegadores) e há um botão ♪ para pausar/ligar. Sem `src`, o botão fica oculto.

## Personalizações rápidas

- **Nome do escritório fictício:** troque "Almeida Duarte" em `index.html`.
- **Cores:** variáveis em `:root` no topo de cada CSS.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `surpresa`), público.
2. Envie **o conteúdo** da pasta (com `index.html` na raiz do repositório). Pelo site: *Add file → Upload files*, arraste tudo e faça o commit.
3. Vá em **Settings → Pages**.
4. Em *Build and deployment*, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`, e clique em **Save**.
5. Em 1 a 2 minutos o link aparece no topo: `https://SEU-USUARIO.github.io/surpresa/`.

Todos os caminhos são relativos, então funciona dentro de `/surpresa/` sem ajustes.

> Dica: abra o link no seu celular antes de enviar, e depois de editar a carta use "recarregar sem cache" se não ver a mudança.
