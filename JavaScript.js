// ==========================================
// SISTEMA DE MÚSICA - YOUTUBE
// ==========================================

const VIDEO_PRINCIPAL = "Af3uIsqu3pw";

let youtubePlayer = null;
let musicaAtual = VIDEO_PRINCIPAL;
let tempoMusicaPrincipal = 0;
let musicaTocando = false;


// ==========================================
// CRIA O PLAYER DO YOUTUBE
// ==========================================

function onYouTubeIframeAPIReady() {

    youtubePlayer = new YT.Player("youtubePlayer", {

        width: "320",
        height: "200",

        videoId: VIDEO_PRINCIPAL,

        playerVars: {

            autoplay: 0,
            controls: 0,

            loop: 1,
            playlist: VIDEO_PRINCIPAL,

            playsinline: 1
        },

        events: {

            onReady: function () {

                atualizarBotaoMusica();

            },

            onStateChange: function (event) {

                musicaTocando =
                    event.data === YT.PlayerState.PLAYING;

                atualizarBotaoMusica();

            },

            onError: function (event) {

                console.error(
                    "Erro do YouTube:",
                    event.data
                );

            }

        }

    });

}


// ==========================================
// TOCAR / PAUSAR MÚSICA
// ==========================================

function alternarMusica() {

    if (
        !youtubePlayer ||
        typeof youtubePlayer.getPlayerState !== "function"
    ) {
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


// ==========================================
// ATUALIZAR BOTÃO DE MÚSICA
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


        if (musicaAtual === VIDEO_PRINCIPAL) {

            texto.textContent = "Tocando";

        }

        else {

            texto.textContent = "Música do casal";

        }

    }

    else {

        botao.classList.remove("tocando");
        botao.classList.add("pausado");

        icone.textContent = "🔇";

        texto.textContent = "Música";

    }

}


// ==========================================
// TOCAR MÚSICA DO CASAL
// ==========================================

function tocarMusicaCasal(videoId) {

    if (
        !youtubePlayer ||
        typeof youtubePlayer.loadVideoById !== "function"
    ) {
        return;
    }


    // Guarda onde a música principal estava

    if (
        musicaAtual === VIDEO_PRINCIPAL &&
        typeof youtubePlayer.getCurrentTime === "function"
    ) {

        tempoMusicaPrincipal =
            youtubePlayer.getCurrentTime() || 0;

    }


    // Define a música do casal

    musicaAtual = videoId;


    // Começa a música do casal do início

    youtubePlayer.loadVideoById({

        videoId: videoId,

        startSeconds: 0

    });

}


// ==========================================
// VOLTAR PARA A MÚSICA PRINCIPAL
// ==========================================

function voltarMusicaPrincipal() {

    if (
        !youtubePlayer ||
        typeof youtubePlayer.loadVideoById !== "function"
    ) {
        return;
    }


    if (musicaAtual === VIDEO_PRINCIPAL) {
        return;
    }


    musicaAtual = VIDEO_PRINCIPAL;


    // Volta exatamente de onde a música estava

    youtubePlayer.loadVideoById({

        videoId: VIDEO_PRINCIPAL,

        startSeconds:
            tempoMusicaPrincipal || 0

    });

}


// ==========================================
// BOTÃO "NOSSA HISTÓRINHA"
// ==========================================

function abrirSite() {

    // Começa a música principal

    if (
        youtubePlayer &&
        typeof youtubePlayer.playVideo === "function"
    ) {

        youtubePlayer.playVideo();

    }


    // Desce suavemente para o conteúdo

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

// Data de início:
// 18/01/2026

const inicioNamoro =
    new Date(2026, 0, 18, 0, 0, 0);


function atualizarContador() {

    const agora =
        new Date();


    let diferenca =
        agora.getTime() -
        inicioNamoro.getTime();


    // Evita números negativos

    if (diferenca < 0) {

        diferenca = 0;

    }


    const segundosTotais =
        Math.floor(
            diferenca / 1000
        );


    const dias =
        Math.floor(
            segundosTotais / 86400
        );


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


    // Pega os elementos do HTML

    const elementoDias =
        document.getElementById("dias");

    const elementoHoras =
        document.getElementById("horas");

    const elementoMinutos =
        document.getElementById("minutos");

    const elementoSegundos =
        document.getElementById("segundos");


    // Atualiza os valores

    if (elementoDias) {

        elementoDias.textContent =
            dias;

    }


    if (elementoHoras) {

        elementoHoras.textContent =
            String(horas).padStart(
                2,
                "0"
            );

    }


    if (elementoMinutos) {

        elementoMinutos.textContent =
            String(minutos).padStart(
                2,
                "0"
            );

    }


    if (elementoSegundos) {

        elementoSegundos.textContent =
            String(segundos).padStart(
                2,
                "0"
            );

    }

}


// Atualiza assim que a página abre

atualizarContador();


// Atualiza a cada segundo

setInterval(
    atualizarContador,
    1000
);


// ==========================================
// CASAIS DOS UNIVERSOS + MÚSICAS
// ==========================================

function mostrarCasal(card) {

    const estavaAberto =
        card.classList.contains("aberto");


    // Fecha todos os outros cards

    document
        .querySelectorAll(".universo")
        .forEach(function (universo) {

            universo.classList.remove("aberto");

        });


    // Se clicou no casal que já estava aberto,
    // fecha e volta para a música principal

    if (estavaAberto) {

        voltarMusicaPrincipal();

        return;

    }


    // Abre o casal selecionado

    card.classList.add("aberto");


    // Pega a música configurada no HTML

    const musicaId =
        card.dataset.musica;


    if (musicaId) {

        tocarMusicaCasal(
            musicaId
        );

    }

}


// ==========================================
// CORAÇÃO AO CLICAR NA TELA
// ==========================================

document.addEventListener("click", function (event) {

    const coracao = document.createElement("span");

    coracao.classList.add("coracao-clique");
    coracao.innerHTML = "❤";

    coracao.style.left = event.clientX + "px";
    coracao.style.top = event.clientY + "px";

    document.body.appendChild(coracao);

    setTimeout(function () {
        coracao.remove();
    }, 1200);

});


// ==========================================
// ABRIR CARTA
// ==========================================

function abrirCarta() {

    const container = document.getElementById("cartaContainer");

    if (!container) {
        console.error("cartaContainer não foi encontrado.");
        return;
    }

    container.classList.add("aberta");

}

