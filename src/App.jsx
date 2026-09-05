import React, { useState, useEffect } from 'react';
import { Star, X, Heart } from 'lucide-react';

export default function App() {
  const [estrelasFundo, setEstrelasFundo] = useState([]);
  const [fotosVistas, setFotosVistas] = useState(new Set());
  const [modalAtivo, setModalAtivo] = useState(null); // Pode ser null, ou um objeto da foto, ou 'final'
  const [animarEntrada, setAnimarEntrada] = useState(false);

  // Gere estrelas de fundo aleatórias apenas uma vez quando o componente montar
  useEffect(() => {
    const gerarEstrelasDeFundo = () => {
      const estrelas = [];
      for (let i = 0; i < 80; i++) {
        estrelas.push({
          id: i,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          size: Math.random() * 2 + 1, // Tamanho entre 1px e 3px
          opacity: Math.random() * 0.8 + 0.2, // Opacidade variada
          animationDuration: `${Math.random() * 3 + 2}s`, // Tempo de piscar
          animationDelay: `${Math.random() * 2}s`
        });
      }
      return estrelas;
    };
    setEstrelasFundo(gerarEstrelasDeFundo());
    // Animação inicial de fade-in da tela
    setTimeout(() => setAnimarEntrada(true), 100);
  }, []);

  // =========================================================================
  // DADOS DAS ESTRELAS / FOTOS (VOCÊ VAI EDITAR AS URLs AQUI DEPOIS)
  // =========================================================================
  const [estrelasFotos] = useState(() => {
    const base = [
      { 
        id: 1, 
        top: '12%', 
        left: '25%', 
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
        mensagem: 'Nosso primeiro momento juntos...'
      },
      { 
        id: 2, 
        top: '28%', 
        left: '75%', 
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
        mensagem: 'O sorriso que me encanta.'
      },
      { 
        id: 3, 
        top: '48%', 
        left: '15%', 
        url: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=600&q=80',
        mensagem: 'Cada dia ao seu lado é especial.'
      },
      { 
        id: 4, 
        top: '65%', 
        left: '80%', 
        url: 'https://images.unsplash.com/photo-1501901609772-df0848060b33?auto=format&fit=crop&w=600&q=80',
        mensagem: 'Minha paz.'
      },
      { 
        id: 5, 
        top: '82%', 
        left: '35%', 
        url: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=600&q=80',
        mensagem: 'Para sempre nós.'
      }
    ];

    // Retorna as estrelas adicionando um tamanho aleatório entre 15px e 40px
    return base.map(estrela => ({
      ...estrela,
      tamanho: Math.floor(Math.random() * 26) + 15
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

  const handleClickFinal = () => {
    setModalAtivo({ tipo: 'final' });
  };

  const fecharModal = () => {
    setModalAtivo(null);
  };

  // Verifica se todas as 5 fotos foram vistas
  const todasVistas = fotosVistas.size === estrelasFotos.length;

  return (
    // Container principal: fixo, tela cheia, fundo escuro degradê
    <div className={`fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 overflow-hidden transition-opacity duration-1000 ${animarEntrada ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Estrelas de fundo geradas aleatoriamente (Efeito visual) */}
      {estrelasFundo.map((estrela) => (
        <div
          key={estrela.id}
          className="absolute rounded-full bg-white"
          style={{
            top: estrela.top,
            left: estrela.left,
            width: `${estrela.size}px`,
            height: `${estrela.size}px`,
            opacity: estrela.opacity,
            animation: `pulse ${estrela.animationDuration} infinite alternate`,
            animationDelay: estrela.animationDelay,
          }}
        />
      ))}

      {/* Título discreto no topo */}
      <div className="absolute top-6 left-0 right-0 text-center z-10 pointer-events-none">
        <p className="text-indigo-200/60 text-sm tracking-widest font-light font-serif">
          {todasVistas ? "O céu está completo" : "Toque nas estrelas..."}
        </p>
      </div>

      {/* As 5 Estrelas Interativas */}
      {estrelasFotos.map((estrela) => {
        const jaVista = fotosVistas.has(estrela.id);
        return (
          <div
            key={estrela.id}
            className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125"
            style={{ top: estrela.top, left: estrela.left }}
            onClick={() => handleClickFoto(estrela)}
          >
            {/* Efeito de brilho em volta da estrela */}
            <div className={`absolute inset-0 rounded-full blur-md ${jaVista ? 'bg-indigo-400/30' : 'bg-yellow-100/40 animate-pulse'}`}></div>
            <Star 
              size={estrela.tamanho}
              className={`relative ${jaVista ? 'text-indigo-300' : 'text-yellow-100'} drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`} 
              fill={jaVista ? "currentColor" : "none"} 
              strokeWidth={jaVista ? 1 : 2}
            />
          </div>
        );
      })}

      {/* A 6ª Estrela Especial (Aparece apenas se todasVistas for true) */}
      <div 
        className={`absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${todasVistas ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}
        style={{ top: estrelaFinal.top, left: estrelaFinal.left }}
        onClick={handleClickFinal}
      >
         <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl animate-ping opacity-60"></div>
         <div className="absolute inset-0 bg-yellow-100 rounded-full blur-md animate-pulse"></div>
         <Star 
           size={64}
           className="relative text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,1)]" 
           fill="currentColor" 
         />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
          <div className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_50px_rgba(167,139,250,0.4)] border border-purple-300/30 pointer-events-auto w-full max-w-md transform animate-in fade-in zoom-in duration-500 text-center">
             <button 
              onClick={fecharModal}
              className="absolute top-4 right-4 text-purple-200 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-6 animate-pulse" fill="currentColor" />
            
            <h1 className="text-2xl font-serif text-white mb-6 tracking-wide">Para meu amor</h1>
            
            {/* =========================================================================
                SEU TEXTO DE DECLARAÇÃO VAI AQUI
                ========================================================================= */}
            <div className="space-y-4 text-purple-50 font-light leading-relaxed">
              <p>
                [Escreva aqui o seu primeiro parágrafo de declaração...]
              </p>
              <p>
                [Escreva aqui o segundo parágrafo. Assim como estas estrelas, você ilumina minha vida de uma forma que eu nunca imaginei ser possível.]
              </p>
              <p>
                [Finalize com uma frase de impacto, eu te amo, etc...]
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CSS para as animações personalizadas */}
      <style dangerouslySetInnerHTML={{__html: `
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