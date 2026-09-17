// ==========================================
// CONFIGURAÇÕES DA MÚSICA
// ==========================================

const VIDEO_PRINCIPAL = "Af3uIsqu3pw";

let youtubePlayer;
let playerPronto = false;

let videoAtual = VIDEO_PRINCIPAL;
let tempoMusicaPrincipal = 0;

let transicaoMusical = 0;


// ==========================================
// API DO YOUTUBE
// ==========================================

function onYouTubeIframeAPIReady() {

    youtubePlayer = new YT.Player("youtubePlayer", {

        height: "200",
        width: "200",

        videoId: VIDEO_PRINCIPAL,

        playerVars: {

            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,

            loop: 1,
            playlist: VIDEO_PRINCIPAL

        },

        events: {

            onReady: function () {

                playerPronto = true;

                youtubePlayer.setVolume(100);

                atualizarBotaoMusica();

            },

            onStateChange: function () {

                atualizarBotaoMusica();

            }

        }

    });

}


// ==========================================
// BOTÃO DE MÚSICA
// ==========================================

function alternarMusica() {

    if (!playerPronto || !youtubePlayer) {
        return;
    }

    const estado =
        youtubePlayer.getPlayerState();


    if (estado === YT.PlayerState.PLAYING) {

        youtubePlayer.pauseVideo();

    } else {

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


    if (
        !botao ||
        !icone ||
        !texto ||
        !playerPronto ||
        !youtubePlayer
    ) {
        return;
    }


    const estado =
        youtubePlayer.getPlayerState();


    if (estado === YT.PlayerState.PLAYING) {

        botao.classList.add("tocando");
        botao.classList.remove("pausado");

        icone.textContent = "🎵";
        texto.textContent = "Pausar";

    } else {

        botao.classList.remove("tocando");
        botao.classList.add("pausado");

        icone.textContent = "🔇";
        texto.textContent = "Música";

    }

}


// ==========================================
// TRANSIÇÃO SUAVE ENTRE MÚSICAS
// ==========================================

function alterarVolumeSuavemente(
    volumeInicial,
    volumeFinal,
    duracao,
    idTransicao,
    callback
) {

    const inicio =
        performance.now();


    function animar(tempoAtual) {

        /*
            Se outra música tiver sido
            selecionada durante a animação,
            cancela a transição anterior.
        */

        if (idTransicao !== transicaoMusical) {
            return;
        }


        const progresso =
            Math.min(
                (tempoAtual - inicio) / duracao,
                1
            );


        const volume =
            volumeInicial +
            (volumeFinal - volumeInicial) *
            progresso;


        try {

            youtubePlayer.setVolume(
                Math.round(volume)
            );

        } catch (erro) {

            return;

        }


        if (progresso < 1) {

            requestAnimationFrame(animar);

        } else if (callback) {

            callback();

        }

    }


    requestAnimationFrame(animar);

}


// ==========================================
// TROCAR MÚSICA COM FADE
// ==========================================

function trocarMusicaSuavemente(
    videoId,
    inicio = 0
) {

    if (!playerPronto || !youtubePlayer) {
        return;
    }


    /*
        Cria um identificador novo.

        Isso impede que duas transições
        aconteçam ao mesmo tempo.
    */

    transicaoMusical++;

    const minhaTransicao =
        transicaoMusical;


    let volumeAtual = 100;


    try {

        volumeAtual =
            youtubePlayer.getVolume();

    } catch (erro) {

        volumeAtual = 100;

    }


    // Diminui a música atual.

    alterarVolumeSuavemente(

        volumeAtual,
        0,
        650,
        minhaTransicao,

        function () {

            if (
                minhaTransicao !==
                transicaoMusical
            ) {
                return;
            }


            /*
                Troca o vídeo somente
                quando o volume chegou
                praticamente a zero.
            */

            youtubePlayer.loadVideoById({

                videoId: videoId,

                startSeconds:
                    inicio || 0

            });


            youtubePlayer.setVolume(0);


            /*
                Pequeno intervalo para
                o novo vídeo carregar.
            */

            setTimeout(

                function () {

                    if (
                        minhaTransicao !==
                        transicaoMusical
                    ) {
                        return;
                    }


                    // Aumenta o volume novamente.

                    alterarVolumeSuavemente(

                        0,
                        100,
                        900,
                        minhaTransicao

                    );

                },

                180

            );

        }

    );

}


// ==========================================
// TOCAR MÚSICA DO CASAL
// ==========================================

function tocarMusicaCasal(videoId) {

    if (
        !playerPronto ||
        !youtubePlayer ||
        !videoId
    ) {
        return;
    }


    /*
        Guarda o momento da música
        principal antes de trocar.
    */

    if (
        videoAtual ===
        VIDEO_PRINCIPAL
    ) {

        try {

            tempoMusicaPrincipal =
                youtubePlayer.getCurrentTime();

        } catch (erro) {

            tempoMusicaPrincipal = 0;

        }

    }


    videoAtual =
        videoId;


    trocarMusicaSuavemente(
        videoId,
        0
    );

}


// ==========================================
// VOLTAR PARA MÚSICA PRINCIPAL
// ==========================================

function voltarMusicaPrincipal() {

    if (
        !playerPronto ||
        !youtubePlayer
    ) {
        return;
    }


    if (
        videoAtual ===
        VIDEO_PRINCIPAL
    ) {
        return;
    }


    videoAtual =
        VIDEO_PRINCIPAL;


    trocarMusicaSuavemente(

        VIDEO_PRINCIPAL,

        tempoMusicaPrincipal || 0

    );

}


// ==========================================
// BOTÃO "NOSSA HISTORINHA"
// ==========================================

function abrirSite() {

    if (
        playerPronto &&
        youtubePlayer
    ) {

        youtubePlayer.playVideo();

    }


    const conteudo =
        document.getElementById(
            "conteudo"
        );


    if (conteudo) {

        conteudo.scrollIntoView({

            behavior: "smooth"

        });

    }

}


// ==========================================
// CONTADOR DO NAMORO
// ==========================================

const dataInicioNamoro =
    new Date(
        2026,
        0,
        18,
        0,
        0,
        0
    );


function atualizarContador() {

    const agora =
        new Date();


    let diferenca =
        agora - dataInicioNamoro;


    if (diferenca < 0) {
        diferenca = 0;
    }


    const segundo = 1000;

    const minuto =
        segundo * 60;

    const hora =
        minuto * 60;

    const dia =
        hora * 24;


    const dias =
        Math.floor(
            diferenca / dia
        );


    const horas =
        Math.floor(
            (diferenca % dia) /
            hora
        );


    const minutos =
        Math.floor(
            (diferenca % hora) /
            minuto
        );


    const segundos =
        Math.floor(
            (diferenca % minuto) /
            segundo
        );


    const elementoDias =
        document.getElementById("dias");

    const elementoHoras =
        document.getElementById("horas");

    const elementoMinutos =
        document.getElementById("minutos");

    const elementoSegundos =
        document.getElementById("segundos");


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


atualizarContador();


setInterval(
    atualizarContador,
    1000
);


// ==========================================
// CASAIS DOS UNIVERSOS
// ==========================================

function mostrarCasal(card) {

    if (!card) {
        return;
    }


    const estavaAberto =
        card.classList.contains(
            "aberto"
        );


    const todosCards =
        document.querySelectorAll(
            ".universo"
        );


    todosCards.forEach(

        function (outroCard) {

            outroCard.classList.remove(
                "aberto"
            );

        }

    );
    /*
        Clicou novamente no mesmo card:
        fecha e volta para a música principal.
    */

    if (estavaAberto) {

        voltarMusicaPrincipal();

        return;

    }


    /*
        Abre o novo card.
    */

    card.classList.add(
        "aberto"
    );
    /*
        Música do casal.
    */

    const musica =
        card.dataset.musica;


    if (musica) {

        tocarMusicaCasal(
            musica
        );

    }

}


// ==========================================
// CORAÇÃO AO CLICAR
// ==========================================

document.addEventListener(

    "click",

    function (evento) {

        /*
            Não cria coração sobre
            botões ou cards.
        */

        if (
            evento.target.closest("button") ||
            evento.target.closest(".universo")
        ) {
            return;
        }


        const coracao =
            document.createElement(
                "span"
            );


        coracao.textContent =
            "❤";


        coracao.style.position =
            "fixed";


        coracao.style.left =
            evento.clientX + "px";


        coracao.style.top =
            evento.clientY + "px";


        coracao.style.pointerEvents =
            "none";


        coracao.style.zIndex =
            "9999";


        coracao.style.color =
            "#f47fa4";


        coracao.style.fontSize =
            "18px";


        coracao.style.opacity =
            "1";


        coracao.style.transform =
            "translate(-50%, -50%) scale(1)";


        coracao.style.transition =
            "all 1s ease";


        document.body.appendChild(
            coracao
        );


        requestAnimationFrame(

            function () {

                coracao.style.top =
                    evento.clientY -
                    60 +
                    "px";


                coracao.style.opacity =
                    "0";


                coracao.style.transform =
                    "translate(-50%, -50%) scale(1.5)";

            }

        );


        setTimeout(

            function () {

                coracao.remove();

            },

            1000

        );

    }

);


// ==========================================
// ABRIR CARTA
// ==========================================

function abrirCarta() {

    const container =
        document.getElementById(
            "cartaContainer"
        );


    if (!container) {
        return;
    }


    const jaEstavaAberta =
        container.classList.contains(
            "aberta"
        );


    container.classList.add(
        "aberta"
    );


    /*
        As pétalas aparecem apenas
        na primeira abertura.
    */

    if (!jaEstavaAberta) {

        setTimeout(

            soltarPetalasDaCarta,

            250

        );

    }

}


// ==========================================
// JARDIM ROMÂNTICO DO SITE
// ==========================================

function iniciarJardimDoSite() {

    /*
        Remove e adiciona a classe
        em frames separados.

        Isso garante que o navegador
        realmente execute a animação
        inicial das vinhas.
    */

    document.body.classList.remove(
        "jardim-ativo"
    );


    requestAnimationFrame(

        function () {

            requestAnimationFrame(

                function () {

                    document.body.classList.add(
                        "jardim-ativo"
                    );

                }

            );

        }

    );

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(

        "DOMContentLoaded",

        iniciarJardimDoSite

    );

} else {

    iniciarJardimDoSite();

}


// ==========================================
// 1. CORAÇÕES CADENTES OCASIONAIS
// ==========================================

function criarCoracaoCadente() {

    const camada =
        document.getElementById(
            "coracoesCadentes"
        );


    if (
        !camada ||
        document.hidden
    ) {
        return;
    }


    const coracao =
        document.createElement(
            "span"
        );


    coracao.className =
        "coracao-cadente";


    /*
        Corações vazios aparecem
        com maior frequência porque
        são mais discretos.
    */

    coracao.textContent =
        Math.random() > 0.25
            ? "♡"
            : "♥";


    /*
        Começa em uma posição
        aleatória na parte superior.
    */

    coracao.style.left =
        (
            8 +
            Math.random() * 84
        ) +
        "vw";


    coracao.style.setProperty(
    "--tamanho",
    (
        20 +
        Math.random() * 14
    ) +
    "px"
);


    coracao.style.setProperty(

        "--duracao",

        (
            6 +
            Math.random() * 3
        ) +
        "s"

    );


    coracao.style.setProperty(

        "--desvio",

        (
            -80 +
            Math.random() * 160
        ) +
        "px"

    );


    coracao.style.setProperty(

        "--giro",

        (
            120 +
            Math.random() * 300
        ) +
        "deg"

    );


    camada.appendChild(
        coracao
    );


    /*
        Segurança:
        remove o coração mesmo caso
        animationend não seja disparado.
    */

    const remover = function () {

        if (coracao.isConnected) {

            coracao.remove();

        }

    };


    coracao.addEventListener(
        "animationend",
        remover
    );


    setTimeout(
        remover,
        11000
    );

}


// ==========================================
// AGENDAR CORAÇÕES CADENTES
// ==========================================

function agendarProximoCoracaoCadente() {

    // Próxima queda entre 1,5 e 3,5 segundos
    const espera =
        1500 +
        Math.random() * 2000;


    setTimeout(

        function () {

            // Sempre cria pelo menos 1 coração
            criarCoracaoCadente();


            const chance =
                Math.random();


            // 25% de chance de cair 3 corações
            if (chance < 0.25) {

                setTimeout(
                    criarCoracaoCadente,
                    250
                );

                setTimeout(
                    criarCoracaoCadente,
                    550
                );

            }

            // 35% de chance de cair 2 corações
            else if (chance < 0.60) {

                setTimeout(
                    criarCoracaoCadente,
                    350
                );

            }


            // Agenda a próxima queda
            agendarProximoCoracaoCadente();

        },

        espera

    );

}

setTimeout(
    criarCoracaoCadente,
    1800
);


agendarProximoCoracaoCadente();

// ==========================================
// 2. CORAÇÕES SEGUINDO O MOUSE
// ==========================================

let ultimoCoracaoMouse = 0;


document.addEventListener(

    "pointermove",

    function (evento) {

        /*
            Não executa em toque.
        */

        if (
            evento.pointerType &&
            evento.pointerType !== "mouse"
        ) {
            return;
        }


        const agora =
            performance.now();


        /*
            Evita criar partículas
            em todos os movimentos
            do mouse.
        */

        if (
            agora -
            ultimoCoracaoMouse <
            120
        ) {
            return;
        }


        ultimoCoracaoMouse =
            agora;


        /*
            Nem todo movimento gera
            um coração. Isso deixa
            o efeito mais delicado.
        */

        if (
            Math.random() >
            0.42
        ) {
            return;
        }


        const coracao =
            document.createElement(
                "span"
            );


        coracao.className =
            "coracao-mouse";


        coracao.textContent =
            Math.random() > 0.5
                ? "♥"
                : "♡";


        const variacaoX =
            -5 +
            Math.random() * 10;


        const variacaoY =
            -5 +
            Math.random() * 10;


        coracao.style.left =
            evento.clientX +
            variacaoX +
            "px";


        coracao.style.top =
            evento.clientY +
            variacaoY +
            "px";


        document.body.appendChild(
            coracao
        );


        const remover =
            function () {

                if (
                    coracao.isConnected
                ) {

                    coracao.remove();

                }

            };


        coracao.addEventListener(
            "animationend",
            remover
        );


        setTimeout(
            remover,
            1500
        );

    }

);

// ==========================================
// 3. PÉTALAS AO ABRIR A CARTA
// ==========================================

function soltarPetalasDaCarta() {

    const camada =
        document.getElementById(
            "petalasCarta"
        );


    const carta =
        document.getElementById(
            "carta"
        );


    if (
        !camada ||
        !carta
    ) {
        return;
    }


    const retangulo =
        carta.getBoundingClientRect();


    /*
        Origem aproximada das pétalas:
        parte superior da carta.
    */

    const origemY =
        Math.max(
            retangulo.top + 30,
            70
        );


    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const petala =
            document.createElement(
                "span"
            );


        petala.className =
            "petala-carta-solta";


        /*
            Espalha as pétalas pela
            região central da carta.
        */

        const origemX =

            retangulo.left +

            retangulo.width *

            (
                0.18 +
                Math.random() * 0.64
            );


        petala.style.left =
            origemX + "px";


        petala.style.top =

            (
                origemY +
                Math.random() * 35
            ) +

            "px";


        /*
            Movimento lateral.
        */

        petala.style.setProperty(

            "--desvio-petala",

            (
                -130 +
                Math.random() * 260
            ) +

            "px"

        );


        /*
            Rotação.
        */

        petala.style.setProperty(

            "--giro-petala",

            (
                200 +
                Math.random() * 420
            ) +

            "deg"

        );


        /*
            Cada pétala possui
            velocidade diferente.
        */

        petala.style.setProperty(

            "--duracao-petala",

            (
                3 +
                Math.random() * 1.8
            ) +

            "s"

        );


        petala.style.animationDelay =

            (
                Math.random() * 0.75
            ) +

            "s";


        camada.appendChild(
            petala
        );


        const remover = function () {

            if (petala.isConnected) {

                petala.remove();

            }

        };


        petala.addEventListener(
            "animationend",
            remover
        );


        setTimeout(
            remover,
            6500
        );

    }

}


// ==========================================
// 6. FUNDO REAGINDO AO SCROLL
// ==========================================

let scrollPendente = false;


function atualizarFundoComScroll() {

    const documento =
        document.documentElement;


    const alturaTotal =

        Math.max(

            documento.scrollHeight -
            window.innerHeight,

            1

        );


    const progresso =

        Math.max(

            0,

            Math.min(

                window.scrollY /
                alturaTotal,

                1

            )

        );


    /*
        Em vez de usar cálculo dentro
        do rgba(), calculamos os valores
        diretamente no JavaScript.

        Isso aumenta a compatibilidade
        entre navegadores.
    */


    const rosa =
        0.08 +
        progresso * 0.16;


    const roxo =
        0.04 +
        progresso * 0.14;


    document.body.style.setProperty(

        "--scroll-rosa",

        rosa.toFixed(3)

    );


    document.body.style.setProperty(

        "--scroll-roxo",

        roxo.toFixed(3)

    );


    /*
        Também deixamos uma variável
        geral disponível caso queira
        criar mais efeitos depois.
    */

    document.body.style.setProperty(

        "--progresso-scroll",

        progresso.toFixed(3)

    );


    scrollPendente = false;

}


// ==========================================
// DETECTAR SCROLL
// ==========================================

window.addEventListener(

    "scroll",

    function () {

        if (scrollPendente) {
            return;
        }


        scrollPendente = true;


        requestAnimationFrame(
            atualizarFundoComScroll
        );

    },

    {
        passive: true
    }

);


// ==========================================
// REDIMENSIONAMENTO DA JANELA
// ==========================================

window.addEventListener(

    "resize",

    function () {

        atualizarFundoComScroll();

    }

);


// Define o fundo inicial.

atualizarFundoComScroll();


// ==========================================
// CORAÇÃO INTERATIVO DO FINAL
// ==========================================

const somCoracaoFinal = new Audio(
    "sons/mambomambo.mp3"
);

somCoracaoFinal.volume = 0.8;


function efeitoCoracaoFinal(coracao) {

    // Toca o efeito sonoro enviado
    somCoracaoFinal.currentTime = 0;

    somCoracaoFinal.play().catch(function (erro) {
        console.log("Não foi possível tocar o efeito:", erro);
    });


    // Reinicia a animação do coração
    coracao.classList.remove("coracao-clicado");

    void coracao.offsetWidth;

    coracao.classList.add("coracao-clicado");


    // Posição central do coração
    const retangulo = coracao.getBoundingClientRect();

    const centroX =
        retangulo.left + retangulo.width / 2;

    const centroY =
        retangulo.top + retangulo.height / 2;


    // Cria vários corações ao redor
    for (let i = 0; i < 12; i++) {

        const particula =
            document.createElement("span");

        particula.className =
            "particula-coracao-final";

        particula.textContent =
            Math.random() > 0.5 ? "♥" : "♡";


        particula.style.left =
            centroX + "px";

        particula.style.top =
            centroY + "px";


        // Distribui as partículas em círculo
        const angulo =
            (Math.PI * 2 / 12) * i +
            (Math.random() * 0.3 - 0.15);


        const distancia =
            55 + Math.random() * 55;


        const x =
            Math.cos(angulo) * distancia;

        const y =
            Math.sin(angulo) * distancia;


        particula.style.setProperty(
            "--x-coracao",
            x + "px"
        );

        particula.style.setProperty(
            "--y-coracao",
            y + "px"
        );


        // Pequenas diferenças entre partículas
        particula.style.fontSize =
            (12 + Math.random() * 10) + "px";


        document.body.appendChild(particula);


        setTimeout(function () {

            particula.remove();

        }, 1100);
    }


    // Remove a classe depois da animação
    setTimeout(function () {

        coracao.classList.remove(
            "coracao-clicado"
        );

    }, 650);
}