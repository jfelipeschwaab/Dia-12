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
      // CHANGED: Reduced opacity and blur so the 3D scene (photos/lilies) stays visible
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="fixed top-4 right-4 md:top-8 md:right-8 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-[110]"
      >
        <X size={24} className="md:w-8 md:h-8" />
      </button>

      {/* Envelope Container */}
      <motion.div
        initial={{ y: 100, scale: 0.8, rotateX: 45 }}
        animate={{ y: 0, scale: 1, rotateX: 0 }}
        transition={{ type: "spring", damping: 15 }}
        // CHANGED: Made height responsive (70vh on mobile to fit the screen better)
        className="relative w-full max-w-2xl h-[70vh] md:h-auto md:aspect-[4/3] perspective-1000 mt-12 md:mt-0"
      >
        {/* 1. Envelope Back */}
        <div className="absolute inset-0 bg-[#6b0000] rounded-lg shadow-xl z-0" />

        {/* 2. The Letter (Starts inside, slides out) */}
        <motion.div
          initial={{ y: 0, zIndex: 10, rotateX: 0 }}
          animate={{ y: "-20%", zIndex: 30, rotateX: 2 }} // Slides out proportionally
          transition={{ 
            y: { delay: 1, duration: 1.5, ease: "easeOut" },
            zIndex: { delay: 1.5 }, // Wait for it to clear the top edge, then pop forward
            rotateX: { delay: 1.5, duration: 0.5 }
          }}
          // CHANGED: Adjusted paddings and centering so it fits mobile without scrolling
          className="absolute inset-x-[2%] top-[2%] bottom-[2%] md:inset-x-[5%] md:top-[10%] md:bottom-[10%] bg-[#fdfaf3] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] rounded-sm p-4 md:p-10 flex flex-col items-center justify-center overflow-y-auto"
        >
          <div className="mb-2 md:mb-4 text-romance-red">
            <Heart size={24} fill="currentColor" className="md:w-8 md:h-8" />
          </div>

          <h3 className="text-xl md:text-3xl font-serif text-romance-deep mb-3 md:mb-4 text-center leading-tight">
            Meu Amor,
          </h3>

          {/* CHANGED: Reduced text size on mobile to prevent scrolling */}
          <div className="space-y-2 md:space-y-4 text-xs md:text-base font-serif text-gray-800 italic leading-relaxed text-center">
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
            <p className="pt-2 md:pt-4 font-bold text-sm md:text-lg">
              Com todo o meu amor, para sempre. ❤️
            </p>
          </div>

          <div className="mt-4 md:mt-6 w-12 md:w-16 h-px bg-romance-pink" />
          <p className="mt-2 font-sans uppercase tracking-[0.4em] text-[8px] md:text-[10px] text-romance-pink">
            12 de Junho, 2026
          </p>
        </motion.div>

        {/* 3. Envelope Front (Pocket) */}
        <div className="absolute inset-0 bg-[#8B0000] rounded-lg shadow-2xl pointer-events-none transform-gpu flex items-center justify-center overflow-hidden border-4 border-romance-gold/30 z-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-romance-red to-romance-deep opacity-50" />
          <div className="relative flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-romance-gold/50 rounded-full flex items-center justify-center mb-2">
               <span className="text-romance-gold text-2xl md:text-3xl font-serif">S</span>
            </div>
            <p className="text-romance-gold/70 font-sans tracking-[0.5em] text-[10px] md:text-xs uppercase">Para Você</p>
          </div>
          
          {/* Decorative Triangles */}
          <div className="absolute inset-0 border-[30px] border-transparent border-t-[#4B0000]/20 pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
}
