// ==========================================
// CONFIGURAÇÃO
// ==========================================

let musicaTocando = false;


// ==========================================
// PLAYER DO YOUTUBE
// ==========================================

// Esta função é chamada automaticamente
// quando a API do YouTube termina de carregar.

const VIDEO_ID = "Af3uIsqu3pw";

let youtubePlayer = null;

function onYouTubeIframeAPIReady() {

    youtubePlayer = new YT.Player("youtubePlayer", {

        width: "320",
        height: "200",

        videoId: VIDEO_ID,

        playerVars: {
            autoplay: 0,
            controls: 1,
            loop: 1,
            playlist: VIDEO_ID
        },

        events: {

            onReady: function () {
                console.log("YouTube carregado corretamente!");
            },

            onStateChange: function (event) {

                const botao =
                    document.getElementById("botaoMusica");

                const icone =
                    document.getElementById("iconeMusica");

                const texto =
                    document.getElementById("textoMusica");

                if (event.data === YT.PlayerState.PLAYING) {

                    botao.classList.add("tocando");

                    icone.textContent = "⏸️";
                    texto.textContent = "Pausar música";

                }

                if (event.data === YT.PlayerState.PAUSED) {

                    botao.classList.remove("tocando");

                    icone.textContent = "▶️";
                    texto.textContent = "Tocar música";

                }

            },

            onError: function (event) {

                console.error(
                    "ERRO DO YOUTUBE:",
                    event.data
                );

                alert(
                    "O YouTube não conseguiu reproduzir o vídeo. Código: " +
                    event.data
                );

            }

        }

    });

}


function alternarMusica() {

    if (!youtubePlayer) {

        alert("O player ainda está carregando.");

        return;

    }


    const estado =
        youtubePlayer.getPlayerState();


    if (estado === YT.PlayerState.PLAYING) {

        youtubePlayer.pauseVideo();

    }

    else {

        youtubePlayer.playVideo();

    }

}


function abrirSite() {

    if (youtubePlayer) {

        youtubePlayer.playVideo();

    }


    document
        .getElementById("conteudo")
        .scrollIntoView({
            behavior: "smooth"
        });

}

// ==========================================
// TOCAR / PAUSAR
// ==========================================

function alternarMusica() {

    if (
        !youtubePlayer ||
        typeof youtubePlayer.getPlayerState !== "function"
    ) {

        console.log("Player ainda está carregando...");
        return;

    }

    const estado = youtubePlayer.getPlayerState();


    if (estado === YT.PlayerState.PLAYING) {

        youtubePlayer.pauseVideo();

    }

    else {

        youtubePlayer.playVideo();

    }

}


// ==========================================
// ATUALIZAR BOTÃO
// ==========================================

function atualizarBotaoMusica() {

    const botao =
        document.getElementById("botaoMusica");

    const icone =
        document.getElementById("iconeMusica");

    const texto =
        document.getElementById("textoMusica");


    if (!botao || !icone || !texto) {
        return;
    }


    if (musicaTocando) {

        botao.classList.add("tocando");
        botao.classList.remove("pausado");

        icone.textContent = "🎵";
        texto.textContent = "Tocando";

    }

    else {

        botao.classList.remove("tocando");
        botao.classList.add("pausado");

        icone.textContent = "🔇";
        texto.textContent = "Música";

    }

}


// ==========================================
// BOTÃO "NOSSA HISTÓRIA"
// ==========================================

function abrirSite() {

    // Inicia a música através do clique do usuário

    if (
        youtubePlayer &&
        typeof youtubePlayer.playVideo === "function"
    ) {

        youtubePlayer.playVideo();

    }


    // Desce para o conteúdo

    const conteudo =
        document.getElementById("conteudo");


    if (conteudo) {

        conteudo.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ==========================================
// CONTADOR DO RELACIONAMENTO
// ==========================================

// IMPORTANTE:
// Troque esta data pela data em que vocês começaram
// a namorar.
//
// Formato:
// ano, mês - 1, dia, hora, minuto
//
// Janeiro = 0
// Fevereiro = 1
// Março = 2
// ...
// Dezembro = 11

const inicioNamoro =
    new Date(2026, 0, 18, 0, 0, 0);


function atualizarContador() {

    const agora = new Date();

    let diferenca =
        agora.getTime() - inicioNamoro.getTime();


    // Evita números negativos

    if (diferenca < 0) {
        diferenca = 0;
    }


    const segundosTotais =
        Math.floor(diferenca / 1000);


    const dias =
        Math.floor(segundosTotais / 86400);


    const horas =
        Math.floor(
            (segundosTotais % 86400) / 3600
        );


    const minutos =
        Math.floor(
            (segundosTotais % 3600) / 60
        );


    const segundos =
        segundosTotais % 60;


    const elementoDias =
        document.getElementById("dias");

    const elementoHoras =
        document.getElementById("horas");

    const elementoMinutos =
        document.getElementById("minutos");

    const elementoSegundos =
        document.getElementById("segundos");


    if (elementoDias) {
        elementoDias.textContent = dias;
    }

    if (elementoHoras) {
        elementoHoras.textContent =
            String(horas).padStart(2, "0");
    }

    if (elementoMinutos) {
        elementoMinutos.textContent =
            String(minutos).padStart(2, "0");
    }

    if (elementoSegundos) {
        elementoSegundos.textContent =
            String(segundos).padStart(2, "0");
    }

}


// Atualiza imediatamente

atualizarContador();


// Atualiza a cada segundo

setInterval(
    atualizarContador,
    1000
);

// ==========================================
// CASAIS DOS UNIVERSOS
// ==========================================

function mostrarCasal(card) {

    const estavaAberto =
        card.classList.contains("aberto");


    // Fecha todos os cards
    document
        .querySelectorAll(".universo")
        .forEach(function (universo) {

            universo.classList.remove("aberto");

        });


    // Se estava fechado, abre
    if (!estavaAberto) {

        card.classList.add("aberto");

    }

}