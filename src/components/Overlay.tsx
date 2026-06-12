import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Mail, Heart } from 'lucide-react';

interface OverlayProps {
  onShowLetter: () => void;
  music: boolean;
  toggleMusic: () => void;
}

const romanticQuotes = [
  "Você transformou meus dias comuns em momentos inesquecíveis.",
  "Meu lugar favorito no mundo continua sendo ao seu lado.",
  "Entre bilhões de pessoas, meu coração escolheu você.",
  "Obrigado por existir."
];

export default function Overlay({ onShowLetter, music, toggleMusic }: OverlayProps) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showMainMessage, setShowMainMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMainMessage(true), 2000);
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % romanticQuotes.length);
    }, 6000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 md:p-12">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Heart className="text-romance-red fill-romance-red" size={24} />
          <span className="font-serif italic text-romance-pink tracking-widest text-lg">Eternamente Seu</span>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={toggleMusic}
          className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 transition-colors"
        >
          {music ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </motion.button>
      </div>

      {/* Main Message */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence>
          {showMainMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative"
            >
              <h2 className="text-5xl md:text-8xl font-serif font-bold magic-text mb-4 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] px-4">
                Feliz Dia dos Namorados ❤️
              </h2>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="h-12 flex items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentQuote}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 1 }}
                    className="text-lg md:text-2xl font-serif italic text-romance-pink/80 max-w-2xl px-6"
                  >
                    "{romanticQuotes[currentQuote]}"
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col items-center gap-6 pointer-events-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 4 }}
          className="text-sm font-sans tracking-[0.3em] uppercase"
        >
          Toque em um lírio para iluminar nosso amor
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5, duration: 1 }}
          onClick={onShowLetter}
          className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          <Mail className="group-hover:rotate-12 transition-transform" />
          <span className="font-sans tracking-widest font-semibold">VER CARTA SURPRESA</span>
        </motion.button>
      </div>
    </div>
  );
}
