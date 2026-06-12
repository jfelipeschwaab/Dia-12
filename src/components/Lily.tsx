import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface LilyProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  delay: number;
  isStarted: boolean;
}

// ==========================================
// UX/UI 3D EXPERT: RESOURCE OPTIMIZATION
// Pre-compiling geometries and advanced materials 
// to maintain 60FPS while delivering AAA visual fidelity.
// ==========================================

// 1. Geometries
const heartGeo = new THREE.SphereGeometry(0.05, 8, 8);
const stemGeo = new THREE.CylinderGeometry(0.015, 0.025, 2, 8);

// Anatomically correct Lily parts
const pistilGeo = new THREE.CylinderGeometry(0.008, 0.015, 0.8, 8);
const filamentGeo = new THREE.CylinderGeometry(0.003, 0.006, 0.7, 5);
const antherGeo = new THREE.CapsuleGeometry(0.015, 0.08, 4, 8);

// Petal: A slice of a sphere, perfectly scaled to mimic a Lily Tepal
const petalGeo = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI / 2.5, 0, Math.PI);
// Pre-translate so the pivot point (hinge) is exactly at the bottom base
petalGeo.translate(0, 0.4, 0); 

// 2. Materials
// Using MeshPhysicalMaterial for Subsurface Scattering (Transmission).
// This allows light to pass through the petals, creating a soft, organic, translucent look.
const petalMat = new THREE.MeshPhysicalMaterial({
  color: "#ffb6c1",       // Soft, elegant pink
  emissive: "#1a0008",    // Subtle dark red emission for depth
  roughness: 0.25,        // Soft sheen
  metalness: 0.0,
  transmission: 0.6,      // The magic property: glass-like translucency
  thickness: 0.1,         // Refraction volume
  clearcoat: 0.1,         // Slight morning dew effect
  side: THREE.DoubleSide
});

const clickedPetalMat = new THREE.MeshPhysicalMaterial({
  color: "#ff66a3",       // Brighter, flushed pink on interaction
  emissive: "#4a001e",    // Warmer core
  roughness: 0.15,
  metalness: 0.1,
  transmission: 0.8,      // Becomes more translucent when "alive"
  thickness: 0.2,
  clearcoat: 0.4,
  side: THREE.DoubleSide
});

const heartMat = new THREE.MeshStandardMaterial({ color: "#ff1493", emissive: "#ff1493", toneMapped: false });
const stemMat = new THREE.MeshStandardMaterial({ color: "#1a4a1a", roughness: 0.9 });
const pistilMat = new THREE.MeshStandardMaterial({ color: "#ccffcc", roughness: 0.5 });
const filamentMat = new THREE.MeshStandardMaterial({ color: "#e6ffe6", roughness: 0.6 });
const antherMat = new THREE.MeshStandardMaterial({ color: "#d2691e", roughness: 0.9 }); // Pollen orange/brown

// ==========================================
// COMPONENTS
// ==========================================

const HeartParticle = () => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.position.y += 0.015;
      ref.current.rotation.y += 0.02;
      ref.current.scale.multiplyScalar(0.98);
    }
  });
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <group ref={ref}>
        <mesh geometry={heartGeo} material={heartMat} />
      </group>
    </Float>
  );
};

// Generates a ring of petals radiating outward from the center
const PetalLayer = ({ count, layerScale, outwardAngle, offsetAngle = 0, clicked }: any) => {
  const petals = [];
  const mat = clicked ? clickedPetalMat : petalMat;
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + offsetAngle;
    petals.push(
      <group key={i} rotation={[0, angle, 0]}>
        {/* Hinge group for organic bending */}
        <group rotation={[outwardAngle, 0, 0]}>
          <mesh 
            geometry={petalGeo}
            material={mat}
            scale={[0.7, 1.8, 0.4]} // Stretch into a lily petal shape
            rotation={[0, -Math.PI / 5, 0]} // Center the curve
          />
        </group>
      </group>
    );
  }
  return <group scale={layerScale}>{petals}</group>;
};

const vec = new THREE.Vector3();

export default function Lily({ position, rotation, scale, delay, isStarted }: LilyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const petalsRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);
  const [hasBloomed, setHasBloomed] = useState(false);

  useEffect(() => {
    if (isStarted && petalsRef.current && groupRef.current) {
      // 1. Grow the entire plant
      gsap.to(groupRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 2.5,
        delay: delay,
        ease: "back.out(1.2, 0.8)",
        onComplete: () => setHasBloomed(true)
      });

      // 2. Unfurl the flower head
      gsap.to(petalsRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 3,
        delay: delay + 0.8,
        ease: "power2.out"
      });

      // 3. Graceful bloom rotation
      gsap.from(petalsRef.current.rotation, {
        y: Math.PI * 0.8,
        duration: 4.5,
        delay: delay + 0.5,
        ease: "power3.out"
      });
    }
  }, [isStarted, delay, scale]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (clicked) return;
    
    // Satisfying micro-interaction pop
    if (groupRef.current) {
      gsap.fromTo(groupRef.current.scale, 
        { x: scale * 0.9, y: scale * 0.9, z: scale * 0.9 }, 
        { x: scale * 1.15, y: scale * 1.15, z: scale * 1.15, duration: 0.4, ease: "elastic.out(1, 0.3)" }
      );
    }

    setClicked(true);
    setHearts(prev => [...prev, Date.now()]);
    setTimeout(() => {
      setClicked(false);
      setHearts(prev => prev.slice(1));
    }, 2500);
  };

  useFrame(() => {
    if (groupRef.current && hasBloomed && !clicked) {
      // Smooth, fluid hover state
      const targetScale = hovered ? scale * 1.08 : scale;
      vec.set(targetScale, targetScale, targetScale);
      groupRef.current.scale.lerp(vec, 0.08);
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation} 
      scale={0} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Structural Stem */}
      <mesh position={[0, -1, 0]} geometry={stemGeo} material={stemMat} />

      {/* Flower Head */}
      <group ref={petalsRef} scale={0.1}>
        
        {/* Anatomical Core: Pistil */}
        <mesh position={[0, 0.4, 0]} geometry={pistilGeo} material={pistilMat} />

        {/* Anatomical Core: 6 Stamens with Anthers */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <group key={`stamen-${i}`} rotation={[0.25, angle, 0]}>
              <mesh position={[0, 0.35, 0]} geometry={filamentGeo} material={filamentMat} />
              <mesh position={[0, 0.7, 0]} rotation={[0.4, 0, 0]} geometry={antherGeo} material={antherMat} />
            </group>
          );
        })}
        
        {/* Outer Tepals (3) */}
        <PetalLayer count={3} layerScale={1.1} outwardAngle={0.9} offsetAngle={0} clicked={clicked} />
        
        {/* Inner Petals (3) */}
        <PetalLayer count={3} layerScale={1.0} outwardAngle={0.7} offsetAngle={Math.PI / 3} clicked={clicked} />
      </group>

      {/* VFX: Love Particles */}
      {hearts.map(id => (
        <HeartParticle key={id} />
      ))}

      {/* VFX: Organic Glow */}
      {clicked && (
        <pointLight intensity={4} distance={3} color="#ff69b4" position={[0, 0.8, 0]} />
      )}
    </group>
  );
}
