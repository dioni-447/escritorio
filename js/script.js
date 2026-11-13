/* =========================================================
   FACHADA INSTITUCIONAL — script.js
   JavaScript puro. Responsável por:
   1. Menu mobile
   2. Primeira confirmação
   3. Segunda confirmação + botão NÃO que foge
   4. Redirecionamento para carta.html
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Configuração ---------- */
  var CARTA_URL = "carta.html"; // caminho relativo: funciona no GitHub Pages

  /* ---------- Referências ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var menu = document.getElementById("menuPrincipal");
  var btnSuspeito = document.getElementById("btnSuspeito");

  var modal1 = document.getElementById("modal1");
  var m1Voltar = document.getElementById("m1-voltar");
  var m1Continuar = document.getElementById("m1-continuar");

  var modal2 = document.getElementById("modal2");
  var arena = document.getElementById("arena");
  var btnSim = document.getElementById("btnSim");
  var btnNao = document.getElementById("btnNao");

  var ultimoFoco = null; // para devolver o foco ao fechar a caixa

  /* =======================================================
     1. MENU MOBILE
     ======================================================= */
  function fecharMenu() {
    menu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }

  menuToggle.addEventListener("click", function () {
    var aberto = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(aberto));
    menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  // Fecha o menu ao escolher um item
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") fecharMenu();
  });

  /* =======================================================
     Utilitários de caixas de confirmação
     ======================================================= */
  function abrir(modal, focoInicial) {
    ultimoFoco = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden"; // trava a rolagem do fundo
    if (focoInicial) focoInicial.focus();
  }

  function fechar(modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  /* =======================================================
     2. PRIMEIRA CONFIRMAÇÃO
     ======================================================= */
  btnSuspeito.addEventListener("click", function () {
    abrir(modal1, m1Voltar);
  });

  m1Voltar.addEventListener("click", function () {
    fechar(modal1);
  });

  m1Continuar.addEventListener("click", function () {
    modal1.hidden = true; // fecha sem devolver o foco ao botão suspeito
    abrir(modal2, btnSim);
    posicionarInicial();
  });

  // Clicar fora da caixa 1 também volta
  modal1.addEventListener("click", function (e) {
    if (e.target === modal1) fechar(modal1);
  });

  // ESC fecha a primeira caixa (a segunda é "sem saída" de propósito)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal1.hidden) fechar(modal1);
  });

  /* =======================================================
     3. SEGUNDA CONFIRMAÇÃO
     ======================================================= */

  // SIM -> carta
  btnSim.addEventListener("click", function () {
    window.location.href = CARTA_URL;
  });

  /* ---- Botão NÃO que foge ---- */

  // Coloca os dois botões lado a lado, na linha de baixo da arena.
  // O SIM fica sempre ali; o NÃO tem todo o espaço acima para fugir.
  function posicionarInicial() {
    var areaW = arena.clientWidth;
    var areaH = arena.clientHeight;
    var largSim = btnSim.offsetWidth;
    var largNao = btnNao.offsetWidth;
    var espaco = 16;
    var total = largSim + largNao + espaco;
    var inicio = Math.max(8, (areaW - total) / 2);
    var linhaBaixo = areaH - btnSim.offsetHeight - 14;

    btnSim.style.left = inicio + "px";
    btnSim.style.top = linhaBaixo + "px";
    btnSim.style.transform = "none";

    semTransicao(function () {
      btnNao.style.left = inicio + largSim + espaco + "px";
      btnNao.style.top = linhaBaixo + "px";
      btnNao.style.transform = "none";
    });
  }

  // Aplica uma posição sem animar (usado só na posição inicial)
  function semTransicao(fn) {
    btnNao.style.transition = "none";
    fn();
    void btnNao.offsetWidth; // força o navegador a aplicar
    btnNao.style.transition = "";
  }

  function retangulosSeSobrepoem(r1, r2, folga) {
    return !(
      r1.right + folga < r2.left ||
      r1.left - folga > r2.right ||
      r1.bottom + folga < r2.top ||
      r1.top - folga > r2.bottom
    );
  }

  // Sorteia uma nova posição DENTRO da arena, longe do SIM
  function fugir() {
    var areaW = arena.clientWidth;
    var areaH = arena.clientHeight;
    var w = btnNao.offsetWidth;
    var h = btnNao.offsetHeight;
    var margem = 6;

    var maxX = Math.max(margem, areaW - w - margem);
    var maxY = Math.max(margem, areaH - h - margem);

    var sim = {
      left: btnSim.offsetLeft,
      top: btnSim.offsetTop,
      right: btnSim.offsetLeft + btnSim.offsetWidth,
      bottom: btnSim.offsetTop + btnSim.offsetHeight
    };
    var atualX = btnNao.offsetLeft;
    var atualY = btnNao.offsetTop;

    // Posição de reserva, sempre segura: linha de cima, em x aleatório
    // (o SIM fica na linha de baixo, então nunca há sobreposição)
    var x = margem + Math.random() * (maxX - margem);
    var y = margem;

    // Tenta achar um ponto que não cubra o SIM
    // e que fique a uma distância mínima da posição atual
    for (var i = 0; i < 40; i++) {
      var cx = margem + Math.random() * (maxX - margem);
      var cy = margem + Math.random() * (maxY - margem);
      var cand = { left: cx, top: cy, right: cx + w, bottom: cy + h };
      var longe = Math.abs(cx - atualX) + Math.abs(cy - atualY) > 70;

      if (!retangulosSeSobrepoem(cand, sim, 10) && longe) {
        x = cx; y = cy;
        break;
      }
    }

    // Garantia final: nunca sai da arena
    x = Math.min(Math.max(x, margem), maxX);
    y = Math.min(Math.max(y, margem), maxY);

    btnNao.style.left = x + "px";
    btnNao.style.top = y + "px";
    btnNao.style.transform = "none";

  }

  // Mouse: foge quando o cursor chega perto
  btnNao.addEventListener("mouseenter", fugir);

  // Toque: foge ANTES do clique ser registrado (iPhone e Android)
  btnNao.addEventListener("touchstart", function (e) {
    e.preventDefault(); // evita o "click" fantasma depois do toque
    fugir();
  }, { passive: false });

  // Teclado / segurança: se algum clique passar, ele também foge
  btnNao.addEventListener("click", function (e) {
    e.preventDefault();
    fugir();
  });

  // Se a tela girar ou redimensionar, mantém o NÃO dentro da arena
  window.addEventListener("resize", function () {
    if (!modal2.hidden) posicionarInicial();
  });
})();
