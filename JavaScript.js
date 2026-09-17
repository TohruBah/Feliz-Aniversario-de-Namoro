// ==========================================
// CONFIGURAÇÕES DA MÚSICA LOCAL
// ==========================================

const MUSICA_PRINCIPAL =
    "sons/Musica principal.mp3";

const audioPrincipal =
    new Audio(MUSICA_PRINCIPAL);

audioPrincipal.preload = "auto";
audioPrincipal.loop = true;
audioPrincipal.volume = 1;


// Áudio usado para os Universos
const audioUniverso =
    new Audio();

audioUniverso.preload = "auto";
audioUniverso.loop = true;
audioUniverso.volume = 1;


// Música que está ativa no momento
let musicaAtual =
    MUSICA_PRINCIPAL;


// Guarda o ponto onde a música principal parou
let tempoMusicaPrincipal = 0;


// Controla as animações de fade
let transicaoMusical = 0;


// ==========================================
// BOTÃO DE MÚSICA
// ==========================================

function alternarMusica() {

    // Se algum Universo estiver tocando
    if (
        musicaAtual !==
        MUSICA_PRINCIPAL
    ) {

        if (audioUniverso.paused) {

            audioUniverso
                .play()
                .catch(function (erro) {

                    console.log(
                        "Não foi possível tocar a música:",
                        erro
                    );

                });

        } else {

            audioUniverso.pause();

        }

    }

    // Música principal
    else {

        if (audioPrincipal.paused) {

            audioPrincipal
                .play()
                .catch(function (erro) {

                    console.log(
                        "Não foi possível tocar a música principal:",
                        erro
                    );

                });

        } else {

            audioPrincipal.pause();

        }

    }


    atualizarBotaoMusica();
}


// ==========================================
// ATUALIZAR BOTÃO DE MÚSICA
// ==========================================

function atualizarBotaoMusica() {

    const botao =
        document.getElementById(
            "botaoMusica"
        );

    const icone =
        document.getElementById(
            "iconeMusica"
        );

    const texto =
        document.getElementById(
            "textoMusica"
        );


    if (
        !botao ||
        !icone ||
        !texto
    ) {
        return;
    }


    let estaTocando = false;


    if (
        musicaAtual ===
        MUSICA_PRINCIPAL
    ) {

        estaTocando =
            !audioPrincipal.paused;

    } else {

        estaTocando =
            !audioUniverso.paused;

    }


    if (estaTocando) {

        botao.classList.add(
            "tocando"
        );

        botao.classList.remove(
            "pausado"
        );

        icone.textContent = "🎵";

        texto.textContent =
            "Pausar";

    } else {

        botao.classList.remove(
            "tocando"
        );

        botao.classList.add(
            "pausado"
        );

        icone.textContent = "🔇";

        texto.textContent =
            "Música";

    }
}


// ==========================================
// FADE DE ÁUDIO
// ==========================================

function alterarVolumeSuavemente(
    audio,
    volumeInicial,
    volumeFinal,
    duracao,
    idTransicao,
    callback
) {

    const inicio =
        performance.now();


    function animar(
        tempoAtual
    ) {

        if (
            idTransicao !==
            transicaoMusical
        ) {
            return;
        }


        const progresso =
            Math.min(
                (
                    tempoAtual -
                    inicio
                ) /
                duracao,
                1
            );


        const volume =
            volumeInicial +
            (
                volumeFinal -
                volumeInicial
            ) *
            progresso;


        audio.volume =
            Math.max(
                0,
                Math.min(
                    1,
                    volume
                )
            );


        if (
            progresso < 1
        ) {

            requestAnimationFrame(
                animar
            );

        } else if (
            callback
        ) {

            callback();

        }
    }


    requestAnimationFrame(
        animar
    );
}


// ==========================================
// TOCAR MÚSICA DO UNIVERSO
// ==========================================

function tocarMusicaCasal(
    caminho
) {

    if (!caminho) {
        return;
    }


    transicaoMusical++;

    const minhaTransicao =
        transicaoMusical;


    // Guarda o ponto atual da música principal
    if (
        musicaAtual ===
        MUSICA_PRINCIPAL
    ) {

        tempoMusicaPrincipal =
            audioPrincipal.currentTime ||
            0;

    }


    const iniciarUniverso =
        function () {

            if (
                minhaTransicao !==
                transicaoMusical
            ) {
                return;
            }


            audioPrincipal.pause();

            audioUniverso.pause();


            audioUniverso.src =
                caminho;

            audioUniverso.currentTime =
                0;

            audioUniverso.volume =
                0;


            musicaAtual =
                caminho;


            audioUniverso
                .play()
                .then(
                    function () {

                        alterarVolumeSuavemente(
                            audioUniverso,
                            0,
                            1,
                            900,
                            minhaTransicao
                        );

                        atualizarBotaoMusica();

                    }
                )
                .catch(
                    function (erro) {

                        console.log(
                            "Não foi possível tocar a música do Universo:",
                            erro
                        );

                    }
                );
        };


    // Se a principal estiver tocando,
    // faz fade antes da troca
    if (
        !audioPrincipal.paused
    ) {

        alterarVolumeSuavemente(
            audioPrincipal,
            audioPrincipal.volume,
            0,
            650,
            minhaTransicao,
            iniciarUniverso
        );

    }

    // Se já existe música de Universo,
    // faz fade antes de trocar
    else if (
        !audioUniverso.paused
    ) {

        alterarVolumeSuavemente(
            audioUniverso,
            audioUniverso.volume,
            0,
            650,
            minhaTransicao,
            iniciarUniverso
        );

    }

    else {

        iniciarUniverso();

    }
}


// ==========================================
// VOLTAR PARA A MÚSICA PRINCIPAL
// ==========================================

function voltarMusicaPrincipal() {

    if (
        musicaAtual ===
        MUSICA_PRINCIPAL
    ) {
        return;
    }


    transicaoMusical++;

    const minhaTransicao =
        transicaoMusical;


    const voltar =
        function () {

            if (
                minhaTransicao !==
                transicaoMusical
            ) {
                return;
            }


            audioUniverso.pause();

            audioUniverso.removeAttribute(
                "src"
            );

            audioUniverso.load();


            musicaAtual =
                MUSICA_PRINCIPAL;


            audioPrincipal.currentTime =
                tempoMusicaPrincipal ||
                0;

            audioPrincipal.volume =
                0;


            audioPrincipal
                .play()
                .then(
                    function () {

                        alterarVolumeSuavemente(
                            audioPrincipal,
                            0,
                            1,
                            900,
                            minhaTransicao
                        );

                        atualizarBotaoMusica();

                    }
                )
                .catch(
                    function (erro) {

                        console.log(
                            "Não foi possível voltar para a música principal:",
                            erro
                        );

                    }
                );
        };


    if (
        !audioUniverso.paused
    ) {

        alterarVolumeSuavemente(
            audioUniverso,
            audioUniverso.volume,
            0,
            650,
            minhaTransicao,
            voltar
        );

    } else {

        voltar();

    }
}


// ==========================================
// ATUALIZA BOTÃO QUANDO O ÁUDIO MUDA
// ==========================================

audioPrincipal.addEventListener(
    "play",
    atualizarBotaoMusica
);

audioPrincipal.addEventListener(
    "pause",
    atualizarBotaoMusica
);

audioUniverso.addEventListener(
    "play",
    atualizarBotaoMusica
);

audioUniverso.addEventListener(
    "pause",
    atualizarBotaoMusica
);


// ==========================================
// BOTÃO "NOSSA HISTORINHA"
// ==========================================

function abrirSite() {

    if (
        audioPrincipal.paused
    ) {

        audioPrincipal
            .play()
            .catch(
                function (erro) {

                    console.log(
                        "Não foi possível iniciar a música:",
                        erro
                    );

                }
            );
    }


    musicaAtual =
        MUSICA_PRINCIPAL;


    atualizarBotaoMusica();


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


    // Se clicou no card que já está
    // ampliado, fecha.
    if (card.classList.contains("ampliado")) {

        fecharUniversoAmpliado();

        return;
    }


    // Fecha qualquer outro universo aberto
    document
        .querySelectorAll(".universo.aberto")
        .forEach(function (outroCard) {

            outroCard.classList.remove(
                "aberto",
                "ampliado"
            );

        });


    // Abre o universo escolhido
    card.classList.add(
        "aberto",
        "ampliado"
    );

    mostrarBotoesNavegacao("universos");


    // ======================================
    // CRIA O FUNDO ESCURO
    // ======================================

    let overlay =
        document.querySelector(
            ".universo-overlay"
        );


    if (!overlay) {

        overlay =
            document.createElement("div");

        overlay.className =
            "universo-overlay";


        document.body.appendChild(
            overlay
        );


        // Clicar fora fecha o Universo
        overlay.addEventListener(
            "click",
            fecharUniversoAmpliado
        );

    }


    // Mostra o overlay
    requestAnimationFrame(function () {

        overlay.classList.add(
            "ativo"
        );

    });


    // Bloqueia o scroll do fundo
    document.body.classList.add(
        "universo-aberto"
    );


    // ======================================
    // MÚSICA DO CASAL
    // ======================================

    const musica =
        card.dataset.musica;


    if (musica) {

        tocarMusicaCasal(
            musica
        );

    }

}

// ==========================================
// FECHAR UNIVERSO AMPLIADO
// ==========================================

function fecharUniversoAmpliado() {

    const card =
        document.querySelector(
            ".universo.ampliado"
        );


    const overlay =
        document.querySelector(
            ".universo-overlay"
        );


    // Fecha o card
    if (card) {

        card.classList.remove(
            "ampliado",
            "aberto"
        );

    }


    // Esconde o fundo
    if (overlay) {

        overlay.classList.remove(
            "ativo"
        );

    }


    // Libera o scroll
    document.body.classList.remove(
        "universo-aberto"
    );

    esconderBotoesNavegacao();

    // Volta para a música principal
    // usando o fade suave já existente
    voltarMusicaPrincipal();

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
        document.getElementById("cartaContainer");

    if (!container) {
        return;
    }

    const estaAberta =
        container.classList.contains("aberta");


    // ==========================
    // FECHAR CARTA
    // ==========================

    if (estaAberta) {

        // Inicia a animação de fechamento
        container.classList.add("fechando");

        // Espera a animação terminar
        setTimeout(function () {

            container.classList.remove("aberta");
            container.classList.remove("fechando");

        }, 600);

        return;
    }


    // ==========================
    // ABRIR CARTA
    // ==========================

    container.classList.add("aberta");

    setTimeout(
        soltarPetalasDaCarta,
        250
    );
}

function fecharCarta(evento) {

    if (evento) {
        evento.stopPropagation();
    }

    const container =
        document.getElementById("cartaContainer");

    if (!container) {
        return;
    }

    container.classList.remove("aberta");
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

const observadorCards = new IntersectionObserver(
    function (entradas) {

        entradas.forEach(function (entrada) {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("visivel");

                observadorCards.unobserve(
                    entrada.target
                );
            }

        });

    },

    {
        threshold: 0.15
    }
);


document.querySelectorAll(".universo").forEach(
    function (card) {

        observadorCards.observe(card);

    }

    

);

// ==========================================
// ÁUDIO LOCAL DAS SURPRESINHAS
// ==========================================

const audioSurpresinha = new Audio();

audioSurpresinha.volume = 0;

let transicaoSurpresinha = 0;


// ==========================================
// FADE DO ÁUDIO LOCAL
// ==========================================

function alterarVolumeSurpresinha(
    volumeInicial,
    volumeFinal,
    duracao,
    idTransicao,
    callback
) {

    const inicio = performance.now();

    function animar(tempoAtual) {

        if (idTransicao !== transicaoSurpresinha) {
            return;
        }

        const progresso = Math.min(
            (tempoAtual - inicio) / duracao,
            1
        );

        const volume =
            volumeInicial +
            (volumeFinal - volumeInicial) *
            progresso;

        audioSurpresinha.volume = Math.max(
            0,
            Math.min(1, volume)
        );

        if (progresso < 1) {

            requestAnimationFrame(animar);

        } else if (callback) {

            callback();

        }
    }

    requestAnimationFrame(animar);
}


// ==========================================
// TOCAR MÚSICA DA SURPRESINHA
// ==========================================

function tocarMusicaSurpresinha(caminho) {

    if (!caminho) {
        return;
    }

    transicaoSurpresinha++;

    const minhaTransicao =
        transicaoSurpresinha;


    // Guarda o ponto atual do YouTube
    // antes de pausar.

    if (
        playerPronto &&
        youtubePlayer
    ) {

        try {

            if (
                videoAtual ===
                VIDEO_PRINCIPAL
            ) {

                tempoMusicaPrincipal =
                    youtubePlayer.getCurrentTime();
            }

            youtubePlayer.pauseVideo();

        } catch (erro) {

            console.log(
                "Não foi possível pausar o YouTube:",
                erro
            );
        }
    }


    // Se já existe um MP3 tocando,
    // diminui o volume antes de trocar.

    const volumeAtual =
        audioSurpresinha.volume;

    alterarVolumeSurpresinha(
        volumeAtual,
        0,
        500,
        minhaTransicao,

        function () {

            if (
                minhaTransicao !==
                transicaoSurpresinha
            ) {
                return;
            }

            audioSurpresinha.pause();

            audioSurpresinha.src =
                caminho;

            audioSurpresinha.currentTime =
                0;

            audioSurpresinha.volume =
                0;

            audioSurpresinha.play()
                .then(function () {

                    alterarVolumeSurpresinha(
                        0,
                        1,
                        800,
                        minhaTransicao
                    );

                })
                .catch(function (erro) {

                    console.log(
                        "Não foi possível tocar a música:",
                        erro
                    );

                });
        }
    );
}


// ==========================================
// PARAR MÚSICA DA SURPRESINHA
// ==========================================

function pararMusicaSurpresinha() {

    transicaoSurpresinha++;

    const minhaTransicao =
        transicaoSurpresinha;

    const volumeAtual =
        audioSurpresinha.volume;

    alterarVolumeSurpresinha(
        volumeAtual,
        0,
        500,
        minhaTransicao,

        function () {

            audioSurpresinha.pause();

            audioSurpresinha.currentTime =
                0;

            audioSurpresinha.removeAttribute(
                "src"
            );

            audioSurpresinha.load();


            // Retoma o YouTube.

            if (
                playerPronto &&
                youtubePlayer
            ) {

                try {

                    youtubePlayer.playVideo();

                } catch (erro) {

                    console.log(
                        "Não foi possível retomar o YouTube:",
                        erro
                    );

                }
            }
        }
    );
}

// ==========================================
// SURPRESINHA
// ==========================================

function abrirSurpresinha() {

    const conteudo =
        document.getElementById(
            "surpresinhaConteudo"
        );

    const botao =
        document.getElementById(
            "botaoSurpresinha"
        );


    if (!conteudo) {
        return;
    }


    const estaAberta =
        conteudo.classList.contains(
            "aberta"
        );


    // FECHAR SURPRESA
    if (estaAberta) {

        conteudo.classList.remove(
            "aberta"
        );

        if (botao) {
            botao.innerHTML =
                "🎁 Surpresinha hehe";
        }

        return;
    }


    // ABRIR SURPRESA
    conteudo.classList.add(
        "aberta"
    );


    if (botao) {
        botao.innerHTML =
            "🎁 Esconder surpresinha";
    }


    setTimeout(function () {

        conteudo.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 150);
}



// ==========================================
// ABRIR CARD DA SURPRESINHA
// ==========================================

function mostrarSurpresa(card) {

    if (!card) {
        return;
    }


    // Se já estiver ampliado,
    // clicar novamente fecha.

    if (
        card.classList.contains(
            "ampliado"
        )
    ) {

        fecharSurpresaAmpliada();

        return;
    }


    // Fecha qualquer outro card aberto.

    document
        .querySelectorAll(
            ".surpresa-card.aberto"
        )
        .forEach(function (outroCard) {

            outroCard.classList.remove(
                "aberto",
                "ampliado"
            );

        });


    // Abre o card escolhido.

    card.classList.add(
        "aberto",
        "ampliado"
    );


    // Ativa as setas.

    mostrarBotoesNavegacao(
        "surpresinha"
    );


    // Cria o fundo escuro.

    let overlay =
        document.querySelector(
            ".surpresa-overlay"
        );


    if (!overlay) {

        overlay =
            document.createElement("div");

        overlay.className =
            "surpresa-overlay";

        document.body.appendChild(
            overlay
        );


        overlay.addEventListener(
            "click",
            fecharSurpresaAmpliada
        );
    }


    requestAnimationFrame(
        function () {

            overlay.classList.add(
                "ativo"
            );

        }
    );


    document.body.classList.add(
        "surpresa-aberta"
    );


    // Música MP3 do card.

    const musica =
        card.dataset.musica;


    if (musica) {

        tocarMusicaSurpresinha(
            musica
        );

    }
}



// ==========================================
// FECHAR CARD AMPLIADO DA SURPRESINHA
// ==========================================

function fecharSurpresaAmpliada() {

    const card =
        document.querySelector(
            ".surpresa-card.ampliado"
        );


    const overlay =
        document.querySelector(
            ".surpresa-overlay"
        );


    if (card) {

        card.classList.remove(
            "ampliado",
            "aberto"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "ativo"
        );

    }


    document.body.classList.remove(
        "surpresa-aberta"
    );


    esconderBotoesNavegacao();


    // Para o MP3 e volta ao YouTube.

    pararMusicaSurpresinha();
}

// ==========================================
// NAVEGAÇÃO DOS CARDS AMPLIADOS
// UNIVERSOS + SURPRESINHA
// ==========================================

let tipoGaleriaAtual = null;

let inicioSwipeX = 0;
let inicioSwipeY = 0;


// ==========================================
// CRIAR BOTÕES DE NAVEGAÇÃO
// ==========================================

function criarBotoesNavegacao() {

    if (
        document.querySelector(
            ".botao-navegacao-card"
        )
    ) {
        return;
    }


    const anterior =
        document.createElement("button");

    anterior.type = "button";

    anterior.className =
        "botao-navegacao-card anterior";

    anterior.innerHTML = "‹";

    anterior.setAttribute(
        "aria-label",
        "Anterior"
    );


    const proximo =
        document.createElement("button");

    proximo.type = "button";

    proximo.className =
        "botao-navegacao-card proximo";

    proximo.innerHTML = "›";

    proximo.setAttribute(
        "aria-label",
        "Próximo"
    );


    anterior.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();

            navegarGaleria(-1);

        }
    );


    proximo.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();

            navegarGaleria(1);

        }
    );


    document.body.appendChild(anterior);
    document.body.appendChild(proximo);

}


// ==========================================
// MOSTRAR SETAS
// ==========================================

function mostrarBotoesNavegacao(tipo) {

    tipoGaleriaAtual = tipo;

    criarBotoesNavegacao();


    document
        .querySelectorAll(
            ".botao-navegacao-card"
        )
        .forEach(function (botao) {

            botao.classList.add("ativo");

        });

}


// ==========================================
// ESCONDER SETAS
// ==========================================

function esconderBotoesNavegacao() {

    tipoGaleriaAtual = null;


    document
        .querySelectorAll(
            ".botao-navegacao-card"
        )
        .forEach(function (botao) {

            botao.classList.remove("ativo");

        });

}


// ==========================================
// NAVEGAR
// ==========================================

function navegarGaleria(direcao) {

    let seletor;


    if (tipoGaleriaAtual === "universos") {

        seletor = ".universo";

    }

    else if (
        tipoGaleriaAtual === "surpresinha"
    ) {

        seletor = ".surpresa-card";

    }

    else {

        return;

    }


    const cards =
        Array.from(
            document.querySelectorAll(seletor)
        );


    if (!cards.length) {
        return;
    }


    const cardAtual =
        cards.find(function (card) {

            return card.classList.contains(
                "ampliado"
            );

        });


    if (!cardAtual) {
        return;
    }


    let indiceAtual =
        cards.indexOf(cardAtual);


    let novoIndice =
        indiceAtual + direcao;


    // Último → primeiro
    if (novoIndice >= cards.length) {

        novoIndice = 0;

    }


    // Primeiro → último
    if (novoIndice < 0) {

        novoIndice =
            cards.length - 1;

    }


    const novoCard =
        cards[novoIndice];


    // Remove o atual
    cardAtual.classList.remove(
        "aberto",
        "ampliado"
    );


    // Abre o próximo
    novoCard.classList.add(
        "aberto",
        "ampliado"
    );


    // Troca a música
    const musica =
        novoCard.dataset.musica;


    if (
        musica &&
        typeof tocarMusicaCasal === "function"
    ) {

        tocarMusicaCasal(musica);

    }

}


// ==========================================
// TECLADO
// ==========================================

document.addEventListener(
    "keydown",
    function (evento) {

        if (!tipoGaleriaAtual) {
            return;
        }


        if (evento.key === "ArrowRight") {

            navegarGaleria(1);

        }


        else if (
            evento.key === "ArrowLeft"
        ) {

            navegarGaleria(-1);

        }


        else if (
            evento.key === "Escape"
        ) {

            if (
                tipoGaleriaAtual ===
                "universos"
            ) {

                fecharUniversoAmpliado();

            }

            else if (
                tipoGaleriaAtual ===
                "surpresinha"
            ) {

                fecharSurpresaAmpliada();

            }

        }

    }
);


// ==========================================
// SWIPE NO CELULAR
// ==========================================

document.addEventListener(
    "touchstart",
    function (evento) {

        if (!tipoGaleriaAtual) {
            return;
        }


        if (
            evento.touches.length !== 1
        ) {
            return;
        }


        inicioSwipeX =
            evento.touches[0].clientX;

        inicioSwipeY =
            evento.touches[0].clientY;

    },
    {
        passive: true
    }
);


document.addEventListener(
    "touchend",
    function (evento) {

        if (!tipoGaleriaAtual) {
            return;
        }


        if (
            evento.changedTouches.length !== 1
        ) {
            return;
        }


        const finalX =
            evento.changedTouches[0].clientX;

        const finalY =
            evento.changedTouches[0].clientY;


        const diferencaX =
            finalX - inicioSwipeX;

        const diferencaY =
            finalY - inicioSwipeY;


        // Ignora movimentos verticais
        if (
            Math.abs(diferencaY) >
            Math.abs(diferencaX)
        ) {
            return;
        }


        // Exige pelo menos 55px
        if (
            Math.abs(diferencaX) < 55
        ) {
            return;
        }


        // Arrastou para esquerda
        if (diferencaX < 0) {

            navegarGaleria(1);

        }

        // Arrastou para direita
        else {

            navegarGaleria(-1);

        }

    },
    {
        passive: true
    }
);