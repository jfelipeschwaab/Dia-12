import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';

interface LetterProps {
  onClose: () => void;
}

export default function Letter({ onClose }: LetterProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="fixed top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <X size={32} />
      </button>

      {/* Envelope Container */}
      <motion.div
        initial={{ y: 100, scale: 0.8, rotateX: 45 }}
        animate={{ y: 0, scale: 1, rotateX: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative w-full max-w-2xl aspect-[4/3] perspective-1000"
      >
        {/* 1. Envelope Back */}
        <div className="absolute inset-0 bg-[#6b0000] rounded-lg shadow-xl z-0" />

        {/* 2. The Letter (Starts inside, slides out) */}
        <motion.div
          initial={{ y: 0, zIndex: 10, rotateX: 0 }}
          animate={{ y: -220, zIndex: 30, rotateX: 2 }}
          transition={{ 
            y: { delay: 1, duration: 1.5, ease: "easeOut" },
            zIndex: { delay: 1.5 }, // Wait for it to clear the top edge, then pop forward
            rotateX: { delay: 1.5, duration: 0.5 }
          }}
          className="absolute inset-x-[5%] top-[10%] bottom-[10%] bg-[#fdfaf3] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] rounded-sm p-6 md:p-10 flex flex-col items-center overflow-y-auto"
        >
          <div className="mb-4 text-romance-red">
            <Heart size={32} fill="currentColor" />
          </div>

          <h3 className="text-xl md:text-3xl font-serif text-romance-deep mb-4 text-center leading-tight">
            Meu Amor,
          </h3>

          <div className="space-y-4 text-sm md:text-base font-serif text-gray-800 italic leading-relaxed text-center">
            <p>
              Hoje, enquanto olhamos para este buquê digital, quero que saiba que cada pétala 
              representa um momento, um sorriso ou uma palavra que compartilhamos.
            </p>
            <p>
              Você é a melodia que acalma meu coração e a luz que ilumina meus dias mais escuros. 
              Estar ao seu lado é a maior aventura e o privilégio mais doce da minha vida.
            </p>
            <p>
              Que nosso amor continue florescendo, mais vibrante e profundo a cada dia, 
              assim como estes lírios que nunca murcham.
            </p>
            <p className="pt-4 font-bold text-lg">
              Com todo o meu amor, para sempre. ❤️
            </p>
          </div>

          <div className="mt-6 w-16 h-px bg-romance-pink" />
          <p className="mt-2 font-sans uppercase tracking-[0.4em] text-[8px] text-romance-pink">
            12 de Junho, 2026
          </p>
        </motion.div>

        {/* 3. Envelope Front (Pocket) */}
        <div className="absolute inset-0 bg-[#8B0000] rounded-lg shadow-2xl pointer-events-none transform-gpu flex items-center justify-center overflow-hidden border-4 border-romance-gold/30 z-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-romance-red to-romance-deep opacity-50" />
          <div className="relative flex flex-col items-center">
            <div className="w-16 h-16 border-2 border-romance-gold/50 rounded-full flex items-center justify-center mb-2">
               <span className="text-romance-gold text-3xl font-serif">S</span>
            </div>
            <p className="text-romance-gold/70 font-sans tracking-[0.5em] text-xs uppercase">Para Você</p>
          </div>
          
          {/* Decorative Triangles */}
          <div className="absolute inset-0 border-[30px] border-transparent border-t-[#4B0000]/20 pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
}
