import React, { useMemo } from 'react';
import Lily from './Lily';
import * as THREE from 'three';

interface BouquetProps {
  isStarted: boolean;
}

export default function Bouquet({ isStarted }: BouquetProps) {
  // Generate a collection of lilies in a structured florist arrangement
  const lilies = useMemo(() => {
    const items: any[] = [];
    const dummy = new THREE.Object3D();
    
    // Convergence point for the stems (the bottom of the bouquet wrap)
    const basePoint = new THREE.Vector3(0, -2.5, 0);

    // Arranging in 3 concentric layers for a classic dome bouquet shape
    const layers = [
      { num: 1, radius: 0, height: 1.8 },      // Top center
      { num: 4, radius: 0.9, height: 1.0 },    // Middle ring
      { num: 7, radius: 1.6, height: 0.0 }     // Outer ring
    ];

    let id = 0;
    layers.forEach(layer => {
      for (let i = 0; i < layer.num; i++) {
        // Distribute evenly around the ring
        const angle = (i / layer.num) * Math.PI * 2;
        
        // Add subtle organic variation so it doesn't look artificially perfect
        const rOffset = (Math.random() - 0.5) * 0.2;
        const hOffset = (Math.random() - 0.5) * 0.3;
        const aOffset = (Math.random() - 0.5) * 0.2;

        const currentRadius = layer.radius + rOffset;
        const x = Math.cos(angle + aOffset) * currentRadius;
        const z = Math.sin(angle + aOffset) * currentRadius;
        const y = layer.height + hOffset;

        const position: [number, number, number] = [x, y, z];

        // --- Rotation Logic ---
        // 1. Place dummy at flower head position
        dummy.position.set(x, y, z);
        
        // 2. Calculate direction from base to flower head
        const dir = new THREE.Vector3(x, y, z).sub(basePoint).normalize();
        
        // 3. Make dummy look along that direction. 
        // lookAt makes the -Z axis point to the target.
        const target = new THREE.Vector3(x, y, z).add(dir);
        dummy.lookAt(target);
        
        // 4. The Lily component is modeled facing UP (+Y axis). 
        // We rotate the dummy so its +Y axis aligns with the outward direction (-Z).
        dummy.rotateX(Math.PI / 2);

        // Optional: Spin the flower slightly around its own stem for variety
        dummy.rotateY(Math.random() * Math.PI * 2);

        const rotation: [number, number, number] = [
          dummy.rotation.x,
          dummy.rotation.y,
          dummy.rotation.z
        ];

        const scale = 0.8 + Math.random() * 0.3;
        const delay = Math.random() * 1.5;

        items.push({ position, rotation, scale, delay, id: id++ });
      }
    });

    return items;
  }, []);

  return (
    <group position={[0, -0.5, 0]}>
      {/* Bouquet Wrap / Leaves base */}
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.5, 3.5, 32, 1, true]} />
        <meshStandardMaterial 
          color="#0a2a0a" 
          roughness={0.9} 
          metalness={0.1}
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
