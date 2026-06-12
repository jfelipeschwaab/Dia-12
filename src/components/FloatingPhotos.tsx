import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

const photoFiles = [
  'photo1.jpeg',
  'photo2.jpeg',
  'photo3.jpeg',
  'photo4.jpeg',
  'photo5.jpeg',
  'photo6.jpeg',
  'photo7.jpeg'
];

function Polaroid({ url, index, total }: { url: string; index: number; total: number }) {
  const texture = useTexture(url);
  
  // Basic optimization for textures
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const ref = useRef<THREE.Group>(null);
  
  // Orbit parameters
  const angle = (index / total) * Math.PI * 2;
  const radius = 2.5 + Math.random() * 1.5; // Reduced from 4+ to be inside camera z=6
  const speed = 0.1 + Math.random() * 0.1;
  const yOffset = (Math.random() - 0.5) * 2;

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed + angle;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 0.5) * 0.5 + yOffset;
      
      // Look at center (bouquet)
      ref.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={ref} scale={0.6}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* White Polaroid Frame */}
        <mesh>
          <planeGeometry args={[1.2, 1.5]} />
          <meshStandardMaterial color="white" />
        </mesh>
        
        {/* The Actual Photo */}
        <mesh position={[0, 0.1, 0.01]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Decorative Heart */}
        <Text
          position={[0, -0.6, 0.02]}
          fontSize={0.1}
          color="#8B0000"
        >
          Nós ❤️
        </Text>
      </Float>
    </group>
  );
}

export default function FloatingPhotos({ isStarted }: { isStarted: boolean }) {
  if (!isStarted) return null;

  return (
    <group>
      {photoFiles.map((file, i) => (
        <Polaroid key={i} url={`/${file}`} index={i} total={photoFiles.length} />
      ))}
    </group>
  );
}
