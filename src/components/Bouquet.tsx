import React, { useMemo } from 'react';
import Lily from './Lily';
import * as THREE from 'three';

interface BouquetProps {
  isStarted: boolean;
}

export default function Bouquet({ isStarted }: BouquetProps) {
  // Generate a collection of lilies in a bouquet shape
  const lilies = useMemo(() => {
    const count = 12; // Fewer lilies for better performance and stability
    const items = [];
    const sphereRadius = 1.8;

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution for a natural look
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.sin(phi) * Math.sin(theta) + 0.5; // Offset upwards
      const z = sphereRadius * Math.cos(phi);

      // Randomize slightly
      const position: [number, number, number] = [
        x * (0.8 + Math.random() * 0.4),
        y * (0.8 + Math.random() * 0.4),
        z * (0.8 + Math.random() * 0.4)
      ];

      const rotation: [number, number, number] = [
        Math.atan2(y, z),
        Math.atan2(x, z),
        0
      ];

      const scale = 0.8 + Math.random() * 0.4;
      const delay = Math.random() * 2; // Staggered blooming

      items.push({
        position,
        rotation,
        scale,
        delay,
        id: i
      });
    }
    return items;
  }, []);

  return (
    <group position={[0, -0.5, 0]}>
      {/* Bouquet Wrap / Leaves base */}
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[2, 4, 32, 1, true]} />
        <meshStandardMaterial 
          color="#0f3d0f" 
          roughness={0.8} 
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* The Lilies */}
      {lilies.map((lily) => (
        <Lily 
          key={lily.id}
          position={lily.position}
          rotation={lily.rotation}
          scale={lily.scale}
          delay={lily.delay}
          isStarted={isStarted}
        />
      ))}
    </group>
  );
}
