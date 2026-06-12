import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Float, Sparkles } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Music, Volume2, VolumeX, Send } from 'lucide-react';
import Experience from './components/Experience';
import Overlay from './components/Overlay';
import Letter from './components/Letter';

export default function App() {
  const [started, setStarted] = useState(false);
  const [music, setMusic] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (started && music) {
      audioRef.current?.play().catch(e => console.log("Audio play blocked", e));
    } else {
      audioRef.current?.pause();
    }
  }, [started, music]);

  return (
    <div className="w-full h-full bg-[#050505]">
      {/* Audio Element - Placeholder URL for a romantic melody */}
      <audio 
        ref={audioRef} 
        loop 
        src="/music.mp4" 
      />

      {!started && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <Heart size={80} className="text-romance-red fill-romance-red shadow-2xl" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-8 tracking-widest text-center px-4">
            Uma surpresa para você...
          </h1>
          <button
            onClick={() => {
              setStarted(true);
              setMusic(true);
            }}
            className="px-8 py-3 bg-romance-red hover:bg-red-700 text-white rounded-full font-sans tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(139,0,0,0.5)]"
          >
            ABRIR PRESENTE
          </button>
        </motion.div>
      )}

      {started && (
        <>
          <Canvas shadows dpr={[1, 2]}>
            <Suspense fallback={null}>
              <Experience isStarted={started} />
            </Suspense>
          </Canvas>

          <Overlay 
            onShowLetter={() => setShowLetter(true)} 
            music={music}
            toggleMusic={() => setMusic(!music)}
          />

          <AnimatePresence>
            {showLetter && (
              <Letter onClose={() => setShowLetter(false)} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
