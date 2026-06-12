import React, { useRef, useEffect, useState, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Stars, 
  Float, 
  Sparkles,
  Environment,
  ContactShadows,
  BakeShadows
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import Bouquet from './Bouquet';
import FloatingPetals from './FloatingPetals';
import FloatingPhotos from './FloatingPhotos';

interface ExperienceProps {
  isStarted: boolean;
}

export default function Experience({ isStarted }: ExperienceProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [controlsEnabled, setControlsEnabled] = useState(false);

  useEffect(() => {
    if (isStarted && cameraRef.current) {
      // Intro camera animation
      gsap.fromTo(
        cameraRef.current.position,
        { z: 15, x: 0, y: 5 },
        { 
          z: 6, x: 0, y: 1, 
          duration: 5, 
          ease: "power2.inOut",
          onComplete: () => setControlsEnabled(true)
        }
      );
    }
  }, [isStarted]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 5, 15]} fov={45} />
      <OrbitControls 
        enabled={controlsEnabled}
        enablePan={false} 
        enableZoom={true} 
        minDistance={4} 
        maxDistance={12}
        autoRotate 
        autoRotateSpeed={0.5}
        makeDefault
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        color="#ffcccc"
      />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#8B0000" />
      <pointLight position={[0, 5, 0]} intensity={1.5} color="#ffd700" />

      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={10} size={1} speed={0.4} opacity={0.5} color="#ffd700" />
      <FloatingPetals />
      
      <Suspense fallback={null}>
        <FloatingPhotos isStarted={isStarted} />
      </Suspense>
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Bouquet isStarted={isStarted} />
      </Float>

      <ContactShadows 
        position={[0, -2.5, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />

      <Environment preset="night" />

      <BakeShadows />
    </>
  );
}

