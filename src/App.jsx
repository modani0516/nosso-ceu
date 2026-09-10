import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Volume2, VolumeX } from 'lucide-react';

export default function App() {
  // Cole aqui o link completo do YouTube OU apenas o ID do vídeo.
  // Exemplos aceitos:
  // https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // https://youtu.be/dQw4w9WgXcQ
  // dQw4w9WgXcQ
  const YOUTUBE_VIDEO = 'https://youtu.be/A6lHB7EZvYQ';

  const extrairYoutubeId = (valor) => {
    if (!valor || valor.includes('COLE_AQUI')) return '';

    // Se já for somente o ID do vídeo.
    if (/^[a-zA-Z0-9_-]{11}$/.test(valor.trim())) return valor.trim();

    try {
      const url = new URL(valor.trim());

      if (url.hostname.includes('youtu.be')) {
        return url.pathname.split('/').filter(Boolean)[0] || '';
      }

      if (url.hostname.includes('youtube.com')) {
        const idQuery = url.searchParams.get('v');
        if (idQuery) return idQuery;

        const partes = url.pathname.split('/').filter(Boolean);
        const indiceEmbed = partes.findIndex((parte) => ['embed', 'shorts', 'live'].includes(parte));
        if (indiceEmbed !== -1 && partes[indiceEmbed + 1]) return partes[indiceEmbed + 1];
      }
    } catch (erro) {
      return '';
    }

    return '';
  };

  const youtubeVideoId = extrairYoutubeId(YOUTUBE_VIDEO);
  const youtubeIframeRef = useRef(null);

  const [estrelasFundo, setEstrelasFundo] = useState([]);
  const [fotosVistas, setFotosVistas] = useState(new Set());
  const [modalAtivo, setModalAtivo] = useState(null); // Pode ser null, ou um objeto da foto, ou 'final'
  const [animarEntrada, setAnimarEntrada] = useState(false);
  const [musicaMutada, setMusicaMutada] = useState(false);

  // Gere estrelas de fundo aleatórias apenas uma vez quando o componente montar
  useEffect(() => {
    const gerarEstrelasDeFundo = () => {
      const estrelas = [];

      for (let i = 0; i < 220; i++) {
        const chance = Math.random();
        const size = chance > 0.97
          ? Math.random() * 1.7 + 1.8
          : chance > 0.82
            ? Math.random() * 0.9 + 1
            : Math.random() * 0.65 + 0.35;

        const temperatura = Math.random();
        const cor = temperatura > 0.88
          ? 'rgba(255, 229, 190, 1)'
          : temperatura < 0.16
            ? 'rgba(205, 223, 255, 1)'
            : 'rgba(245, 248, 255, 1)';

        estrelas.push({
          id: i,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          size,
          opacity: Math.random() * 0.58 + 0.22,
          cor,
          halo: chance > 0.9 ? Math.random() * 7 + 3 : Math.random() * 2 + 0.5,
          animationDuration: `${Math.random() * 5 + 4}s`,
          animationDelay: `${Math.random() * 6}s`,
          estrelaBrilhante: chance > 0.965,
        });
      }

      return estrelas;
    };

    setEstrelasFundo(gerarEstrelasDeFundo());

    // Animação inicial de fade-in da tela
    setTimeout(() => setAnimarEntrada(true), 100);
  }, []);

  // Ajustes globais para ocupar toda a tela em celulares e evitar faixas brancas
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    html.style.margin = '0';
    html.style.padding = '0';
    html.style.width = '100%';
    html.style.height = '100%';
    html.style.backgroundColor = '#010207';
    html.style.overflow = 'hidden';
    html.style.colorScheme = 'dark';

    body.style.margin = '0';
    body.style.padding = '0';
    body.style.width = '100%';
    body.style.height = '100%';
    body.style.minHeight = '100dvh';
    body.style.backgroundColor = '#010207';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';

    if (root) {
      root.style.width = '100%';
      root.style.height = '100%';
      root.style.minHeight = '100dvh';
      root.style.backgroundColor = '#010207';
      root.style.overflow = 'hidden';
    }

    // Permite que o conteúdo avance até as bordas físicas da tela (notch / Dynamic Island).
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute(
      'content',
      'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'
    );

    // Faz a interface do navegador usar uma cor compatível com o céu quando suportado.
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#010207');

    let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleStatusBar) {
      appleStatusBar = document.createElement('meta');
      appleStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(appleStatusBar);
    }
    appleStatusBar.setAttribute('content', 'black-translucent');
  }, []);

  // =========================================================================
  // DADOS DAS ESTRELAS / FOTOS (VOCÊ VAI EDITAR AS URLs AQUI DEPOIS)
  // =========================================================================
  const [estrelasFotos] = useState(() => {
    const base = [
      {
        id: 1,
        url: 'https://i.imgur.com/LHa0dc3.png',
        mensagem: 'Entregando felicidade pro nosso filhinho! 💖'
      },
      {
        id: 2,
        url: 'https://i.imgur.com/AgAlIkN.png',
        mensagem: 'O sorriso que me encanta. 🥺'
      },
      {
        id: 3,
        url: 'https://i.imgur.com/49e7w9B.png',
        mensagem: 'Cada dia ao seu lado é especial. 💛'
      },
      {
        id: 4,
        url: 'https://i.imgur.com/ZHivlFU.png',
        mensagem: 'Minha paz. 🪷'
      },
      {
        id: 5,
        url: 'https://i.imgur.com/1w2j5Ez.png',
        mensagem: 'Para sempre nós. 💗'
      }
    ];

    // Gera novas posições a cada carregamento, evitando estrelas muito próximas
    // entre si e deixando o centro livre para a estrela final.
    const posicoes = [];
    const distanciaMinima = 20;

    const criarPosicao = () => ({
      top: Math.random() * 72 + 14,  // 14% a 86%
      left: Math.random() * 82 + 9,  // 9% a 91%
    });

    for (let i = 0; i < base.length; i++) {
      let posicao;
      let tentativas = 0;

      do {
        posicao = criarPosicao();
        tentativas += 1;

        const muitoPertoDeOutra = posicoes.some((anterior) => {
          const dx = posicao.left - anterior.left;
          const dy = posicao.top - anterior.top;
          return Math.sqrt(dx * dx + dy * dy) < distanciaMinima;
        });

        const distanciaDoCentro = Math.sqrt(
          Math.pow(posicao.left - 50, 2) + Math.pow(posicao.top - 50, 2)
        );
        const pertoDaEstrelaFinal = distanciaDoCentro < 15;

        if (!muitoPertoDeOutra && !pertoDaEstrelaFinal) break;
      } while (tentativas < 150);

      posicoes.push(posicao);
    }

    return base.map((estrela, index) => ({
      ...estrela,
      top: `${posicoes[index].top}%`,
      left: `${posicoes[index].left}%`,
      tamanho: Math.floor(Math.random() * 7) + 24,
      animationDelay: `${Math.random() * 2.5}s`,
    }));
  });

  // A estrela final que aparece depois das 5
  const estrelaFinal = { top: '50%', left: '50%' };

  // =========================================================================
  // LÓGICA DE CLIQUE
  // =========================================================================
  const handleClickFoto = (estrela) => {
    const novasVistas = new Set(fotosVistas);
    novasVistas.add(estrela.id);
    setFotosVistas(novasVistas);
    setModalAtivo({ tipo: 'foto', dados: estrela });
  };

  const enviarComandoYoutube = (func, args = []) => {
    const iframe = youtubeIframeRef.current;
    if (!iframe?.contentWindow || !youtubeVideoId) return;

    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func,
        args,
      }),
      '*'
    );
  };

  const handleClickFinal = () => {
    setModalAtivo({ tipo: 'final' });
    setMusicaMutada(false);

    // O player já está carregado invisivelmente. Como estes comandos são enviados
    // diretamente a partir do toque/clique do usuário, há maior compatibilidade
    // com as políticas de autoplay dos navegadores móveis.
    enviarComandoYoutube('setVolume', [100]);
    enviarComandoYoutube('unMute');
    enviarComandoYoutube('playVideo');
  };

  const alternarMudo = () => {
    if (musicaMutada) {
      enviarComandoYoutube('setVolume', [100]);
      enviarComandoYoutube('unMute');
      enviarComandoYoutube('playVideo');
      setMusicaMutada(false);
    } else {
      enviarComandoYoutube('mute');
      setMusicaMutada(true);
    }
  };

  const fecharModal = () => {
    setModalAtivo(null);
  };

  // Verifica se todas as 5 fotos foram vistas
  const todasVistas = fotosVistas.size === estrelasFotos.length;

  return (
    // Container principal: fixo, tela cheia, céu noturno profundo
    <div className={`fixed inset-0 app-viewport overflow-hidden transition-opacity duration-1000 ${animarEntrada ? 'opacity-100' : 'opacity-0'}`}>

      {/* Player do YouTube invisível: somente o áudio será percebido.
          Troque YOUTUBE_VIDEO no início do arquivo pelo link ou ID desejado. */}
      {youtubeVideoId && (
        <iframe
          ref={youtubeIframeRef}
          title="Trilha sonora"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&playsinline=1&controls=0&rel=0&modestbranding=1`}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          aria-hidden="true"
          className="youtube-audio-player"
        />
      )}

      {/* Fundo com profundidade de um céu noturno real */}
      <div className="absolute inset-0 night-sky-base pointer-events-none"></div>
      <div className="absolute inset-0 milky-way pointer-events-none"></div>
      <div className="absolute inset-0 night-haze pointer-events-none"></div>
      <div className="absolute inset-0 night-vignette pointer-events-none"></div>

      {/* Estrelas de fundo geradas aleatoriamente */}
      {estrelasFundo.map((estrela) => (
        <div
          key={estrela.id}
          className={`absolute rounded-full real-star ${estrela.estrelaBrilhante ? 'real-star-bright' : ''}`}
          style={{
            top: estrela.top,
            left: estrela.left,
            width: `${estrela.size}px`,
            height: `${estrela.size}px`,
            opacity: estrela.opacity,
            backgroundColor: estrela.cor,
            boxShadow: `0 0 ${estrela.halo}px ${estrela.cor}`,
            animationDuration: estrela.animationDuration,
            animationDelay: estrela.animationDelay,
          }}
        >
          {estrela.estrelaBrilhante && (
            <>
              <span className="star-flare star-flare-v"></span>
              <span className="star-flare star-flare-h"></span>
            </>
          )}
        </div>
      ))}

      {/* Título discreto no topo */}
      <div className="absolute mobile-safe-title left-0 right-0 text-center z-10 pointer-events-none">
        <p className="text-slate-200/55 text-sm tracking-[0.28em] font-light font-serif drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
          {todasVistas ? "O céu está completo" : "Toque nas estrelas..."}
        </p>
      </div>

      {/* As 5 Estrelas Interativas */}
      {estrelasFotos.map((estrela) => {
        const jaVista = fotosVistas.has(estrela.id);
        return (
          <div
            key={estrela.id}
            className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 hover:scale-125 group"
            style={{ top: estrela.top, left: estrela.left }}
            onClick={() => handleClickFoto(estrela)}
          >
            {/* Estrela fotográfica: ponto luminoso + raios de difração */}
            <div
              className={`photo-star ${jaVista ? 'photo-star-seen' : 'photo-star-unseen'}`}
              style={{
                width: `${estrela.tamanho}px`,
                height: `${estrela.tamanho}px`,
                animationDelay: estrela.animationDelay,
              }}
            >
              <span className="photo-star-glow"></span>
              <span className="photo-star-ray photo-star-ray-v"></span>
              <span className="photo-star-ray photo-star-ray-h"></span>
              <span className="photo-star-ray photo-star-ray-d1"></span>
              <span className="photo-star-ray photo-star-ray-d2"></span>
              <span className="photo-star-core"></span>
            </div>
          </div>
        );
      })}

      {/* A 6ª Estrela Especial (Aparece apenas se todasVistas for true) */}
      <div
        className={`absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${todasVistas ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}
        style={{ top: estrelaFinal.top, left: estrelaFinal.left }}
        onClick={handleClickFinal}
      >
        <div className="final-star">
          <span className="final-star-aura"></span>
          <span className="final-star-ray final-star-ray-v"></span>
          <span className="final-star-ray final-star-ray-h"></span>
          <span className="final-star-ray final-star-ray-d1"></span>
          <span className="final-star-ray final-star-ray-d2"></span>
          <span className="final-star-core"></span>
        </div>
      </div>

      {/* =========================================================================
          MODAIS (JANELAS FLUTUANTES)
          ========================================================================= */}

      {/* Fundo escuro quando um modal está aberto */}
      {modalAtivo && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          onClick={fecharModal}
        ></div>
      )}

      {/* Modal de Foto */}
      {modalAtivo?.tipo === 'foto' && (
        <div className="fixed inset-0 mobile-safe-modal z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 pointer-events-auto w-full max-w-sm transform animate-in fade-in zoom-in duration-300 animate-float">
            <button
              onClick={fecharModal}
              className="absolute -top-4 -right-4 bg-slate-800 text-white p-2 rounded-full shadow-lg hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-slate-800">
              <img
                src={modalAtivo.dados.url}
                alt="Nossa lembrança"
                className="object-cover w-full h-full"
              />
            </div>
            {/* Mensagem opcional abaixo da foto */}
            <p className="text-center text-white mt-4 font-serif italic text-lg shadow-black drop-shadow-md">
              {modalAtivo.dados.mensagem}
            </p>
          </div>
        </div>
      )}

      {/* Modal da Declaração Final */}
      {modalAtivo?.tipo === 'final' && (
        <div className="fixed inset-0 mobile-safe-modal z-50 flex items-center justify-center pointer-events-none">
          <div className="relative overflow-hidden bg-slate-950/75 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_0_70px_rgba(160,195,255,0.14)] border border-slate-200/15 pointer-events-auto w-full max-w-md transform animate-in fade-in zoom-in duration-500 text-center">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(150,190,255,0.10),transparent_48%)]"></div>
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-sky-100/[0.035] blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
            <button
              onClick={fecharModal}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <Heart className="w-10 h-10 text-slate-200/80 mx-auto mb-6 final-heart" fill="currentColor" />

            <h1 className="text-2xl font-serif text-white mb-6 tracking-wide">Para meu amor</h1>

            {/* =========================================================================
                SEU TEXTO DE DECLARAÇÃO VAI AQUI
                ========================================================================= */}
            <div className="space-y-4 text-slate-200/85 font-light leading-relaxed">
              <p>
                Cada estrela faz parte da nossa história. Cada momento.
              </p>
              <p>
                Assim como estas estrelas, você ilumina minha vida de uma forma que eu nunca imaginei ser possível.
              </p>
              <p>
                Obrigado por ser a luz da minha vida. Te amo! 💖
              </p>
            </div>

            {youtubeVideoId && (
              <button
                type="button"
                onClick={alternarMudo}
                className="audio-toggle-button"
                aria-label={musicaMutada ? 'Ativar som' : 'Mutar som'}
                title={musicaMutada ? 'Ativar som' : 'Mutar som'}
              >
                {musicaMutada ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
                <span>{musicaMutada ? 'Ativar som' : 'Som ligado'}</span>
              </button>
            )}
            </div>
          </div>
        </div>
      )}

      {/* CSS para o céu, estrelas e animações personalizadas */}
      <style dangerouslySetInnerHTML={{__html: `
        .youtube-audio-player {
          position: fixed;
          width: 1px;
          height: 1px;
          left: -9999px;
          bottom: 0;
          opacity: 0;
          pointer-events: none;
          border: 0;
        }

        .audio-toggle-button {
          margin: 1.5rem auto 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.55rem 0.8rem;
          border-radius: 9999px;
          border: 1px solid rgba(226, 232, 240, 0.14);
          background: rgba(15, 23, 42, 0.36);
          color: rgba(226, 232, 240, 0.72);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 0 22px rgba(148, 184, 235, 0.06);
          transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }

        .audio-toggle-button:hover {
          background: rgba(30, 41, 59, 0.5);
          color: rgba(255, 255, 255, 0.92);
          border-color: rgba(226, 232, 240, 0.22);
        }

        .audio-toggle-button:active {
          transform: scale(0.96);
        }

        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          min-height: 100% !important;
          background: #010207 !important;
          overflow: hidden !important;
          overscroll-behavior: none;
        }

        html {
          color-scheme: dark;
        }

        body {
          position: fixed;
          inset: 0;
          min-height: 100dvh !important;
          -webkit-text-size-adjust: 100%;
          -webkit-tap-highlight-color: transparent;
        }

        #root {
          min-height: 100dvh !important;
          isolation: isolate;
        }

        .app-viewport {
          position: fixed;
          inset: 0;
          width: 100vw;
          width: 100dvw;
          height: 100vh;
          height: 100svh;
          height: 100dvh;
          min-height: 100dvh;
          background: #010207;
          overflow: hidden;
          overscroll-behavior: none;
          touch-action: manipulation;
        }

        .mobile-safe-title {
          top: calc(env(safe-area-inset-top, 0px) + 1.5rem);
          padding-left: calc(env(safe-area-inset-left, 0px) + 1rem);
          padding-right: calc(env(safe-area-inset-right, 0px) + 1rem);
        }

        .mobile-safe-modal {
          padding-top: calc(env(safe-area-inset-top, 0px) + 1.5rem);
          padding-right: calc(env(safe-area-inset-right, 0px) + 1.5rem);
          padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1.5rem);
          padding-left: calc(env(safe-area-inset-left, 0px) + 1.5rem);
        }

        @supports not (height: 100dvh) {
          .app-viewport, body, #root {
            height: 100vh !important;
            min-height: 100vh !important;
          }
        }

        @media (max-width: 640px) {
          .mobile-safe-title {
            top: calc(env(safe-area-inset-top, 0px) + 1rem);
          }

          .mobile-safe-modal {
            padding-top: calc(env(safe-area-inset-top, 0px) + 1rem);
            padding-right: calc(env(safe-area-inset-right, 0px) + 1rem);
            padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
            padding-left: calc(env(safe-area-inset-left, 0px) + 1rem);
          }
        }

        .night-sky-base {
          background:
            radial-gradient(ellipse at 50% 115%, rgba(35, 57, 91, 0.54) 0%, rgba(10, 21, 39, 0.2) 35%, transparent 62%),
            radial-gradient(circle at 82% 18%, rgba(28, 48, 82, 0.22) 0%, transparent 30%),
            radial-gradient(circle at 18% 34%, rgba(17, 31, 58, 0.18) 0%, transparent 34%),
            linear-gradient(180deg, #010207 0%, #02050d 28%, #040913 58%, #07111d 100%);
        }

        .milky-way {
          inset: -24%;
          opacity: 0.55;
          transform: rotate(-17deg) scale(1.12);
          filter: blur(20px);
          background:
            linear-gradient(
              105deg,
              transparent 27%,
              rgba(105, 125, 158, 0.015) 34%,
              rgba(152, 171, 198, 0.07) 43%,
              rgba(212, 219, 229, 0.13) 49%,
              rgba(133, 155, 190, 0.065) 55%,
              rgba(63, 85, 121, 0.015) 63%,
              transparent 71%
            );
        }

        .night-haze {
          opacity: 0.8;
          background:
            radial-gradient(ellipse at 65% 72%, rgba(69, 88, 118, 0.06) 0%, transparent 33%),
            radial-gradient(ellipse at 29% 64%, rgba(77, 94, 125, 0.045) 0%, transparent 27%);
        }

        .night-vignette {
          box-shadow: inset 0 0 160px 42px rgba(0, 0, 0, 0.58);
          background: linear-gradient(180deg, rgba(0,0,0,0.16), transparent 22%, transparent 76%, rgba(0,0,0,0.13));
        }

        .real-star {
          z-index: 2;
          animation-name: natural-twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: opacity, transform;
        }

        .real-star-bright {
          z-index: 3;
        }

        .star-flare {
          position: absolute;
          left: 50%;
          top: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, rgba(230, 239, 255, 0.7), transparent);
          opacity: 0.45;
        }

        .star-flare-v {
          width: 1px;
          height: 8px;
          background: linear-gradient(180deg, transparent, rgba(230, 239, 255, 0.72), transparent);
        }

        .star-flare-h {
          width: 8px;
          height: 1px;
        }

        .photo-star {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease;
          will-change: opacity, filter, transform;
        }

        /* Ainda não clicada: brilho discreto, mas pulsando para ser fácil de encontrar */
        .photo-star-unseen {
          opacity: 0.56;
          filter: drop-shadow(0 0 3px rgba(205, 222, 248, 0.42));
          animation: photo-star-unseen-pulse 2.9s ease-in-out infinite;
        }

        .photo-star-glow {
          position: absolute;
          width: 30%;
          height: 30%;
          border-radius: 9999px;
          background: rgba(232, 241, 255, 0.12);
          box-shadow:
            0 0 6px 2px rgba(203, 222, 250, 0.12),
            0 0 14px 5px rgba(154, 187, 232, 0.04);
          filter: blur(2px);
          transition: all 0.5s ease;
        }

        .photo-star-core {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 9999px;
          background: rgba(244, 248, 255, 0.9);
          box-shadow:
            0 0 2px 1px rgba(255,255,255,0.58),
            0 0 6px 2px rgba(205,224,251,0.36);
          transition: all 0.5s ease;
        }

        .photo-star-ray {
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: center;
          border-radius: 9999px;
          opacity: 0.34;
          transition: opacity 0.5s ease;
        }

        .photo-star-ray-v {
          width: 1px;
          height: 100%;
          transform: translate(-50%, -50%);
          background: linear-gradient(180deg, transparent, rgba(240,246,255,0.95), #fff, rgba(240,246,255,0.95), transparent);
        }

        .photo-star-ray-h {
          width: 100%;
          height: 1px;
          transform: translate(-50%, -50%);
          background: linear-gradient(90deg, transparent, rgba(240,246,255,0.92), #fff, rgba(240,246,255,0.92), transparent);
        }

        .photo-star-ray-d1,
        .photo-star-ray-d2 {
          width: 72%;
          height: 1px;
          opacity: 0.28;
          background: linear-gradient(90deg, transparent, rgba(222,235,255,0.85), transparent);
        }

        .photo-star-ray-d1 {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .photo-star-ray-d2 {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        .photo-star-seen {
          opacity: 1;
          filter: drop-shadow(0 0 8px rgba(220, 234, 255, 0.95));
          animation: photo-star-seen-breathe 4.6s ease-in-out infinite;
        }

        .photo-star-seen .photo-star-core {
          width: 4px;
          height: 4px;
          background: #ffffff;
          box-shadow:
            0 0 3px 1px rgba(255,255,255,1),
            0 0 10px 3px rgba(217,233,255,0.94),
            0 0 24px 7px rgba(157,194,244,0.38);
        }

        .photo-star-seen .photo-star-glow {
          width: 38%;
          height: 38%;
          background: rgba(241, 247, 255, 0.3);
          box-shadow:
            0 0 10px 4px rgba(213, 230, 255, 0.3),
            0 0 24px 10px rgba(147, 184, 235, 0.11);
        }

        .photo-star-seen .photo-star-ray {
          opacity: 0.9;
        }

        .final-star {
          position: relative;
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: final-star-breathe 3s ease-in-out infinite;
        }

        .final-star-aura {
          position: absolute;
          width: 70%;
          height: 70%;
          border-radius: 9999px;
          background: rgba(255, 241, 194, 0.08);
          box-shadow:
            0 0 18px 8px rgba(255, 235, 171, 0.18),
            0 0 45px 18px rgba(255, 215, 128, 0.08);
          filter: blur(4px);
        }

        .final-star-core {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background: #fff8d6;
          box-shadow:
            0 0 5px 2px rgba(255,248,214,1),
            0 0 14px 5px rgba(255,231,158,0.95),
            0 0 35px 12px rgba(255,209,102,0.34);
        }

        .final-star-ray {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 9999px;
          transform-origin: center;
        }

        .final-star-ray-v {
          width: 1px;
          height: 92%;
          transform: translate(-50%, -50%);
          background: linear-gradient(180deg, transparent, rgba(255,242,204,0.8), #fff8d6, rgba(255,242,204,0.8), transparent);
        }

        .final-star-ray-h {
          width: 92%;
          height: 1px;
          transform: translate(-50%, -50%);
          background: linear-gradient(90deg, transparent, rgba(255,242,204,0.8), #fff8d6, rgba(255,242,204,0.8), transparent);
        }

        .final-star-ray-d1,
        .final-star-ray-d2 {
          width: 58%;
          height: 1px;
          opacity: 0.38;
          background: linear-gradient(90deg, transparent, rgba(255,232,175,0.9), transparent);
        }

        .final-star-ray-d1 {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .final-star-ray-d2 {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        @keyframes natural-twinkle {
          0%, 100% { transform: scale(0.94); filter: brightness(0.88); }
          45% { transform: scale(1); filter: brightness(1); }
          60% { transform: scale(1.08); filter: brightness(1.16); }
        }

        @keyframes photo-star-unseen-pulse {
          0%, 100% {
            opacity: 0.50;
            transform: scale(0.96);
            filter: drop-shadow(0 0 2px rgba(205, 222, 248, 0.30)) brightness(0.92);
          }
          50% {
            opacity: 0.76;
            transform: scale(1.08);
            filter: drop-shadow(0 0 7px rgba(215, 231, 255, 0.68)) brightness(1.18);
          }
        }

        @keyframes photo-star-seen-breathe {
          0%, 100% { transform: scale(0.98); }
          50% { transform: scale(1.035); }
        }

        @keyframes final-star-breathe {
          0%, 100% { transform: scale(0.96); filter: brightness(0.95); }
          50% { transform: scale(1.06); filter: brightness(1.15); }
        }


        .final-heart {
          filter: drop-shadow(0 0 10px rgba(210, 228, 255, 0.18));
          animation: finalHeartGlow 3.4s ease-in-out infinite;
        }

        @keyframes finalHeartGlow {
          0%, 100% { opacity: 0.68; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.035); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
