import React, { useRef, useState, useEffect, useMemo } from 'react';
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

// Reusable Geometries and Materials
const heartGeo = new THREE.SphereGeometry(0.05, 8, 8);
const heartMat = new THREE.MeshStandardMaterial({ color: "#ff69b4", emissive: "#ff1493" });

// Lily petals are longer and more pointed
const petalGeo = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI / 4, 0, Math.PI);
const stemGeo = new THREE.CylinderGeometry(0.02, 0.02, 2, 6);
const coreGeo = new THREE.CylinderGeometry(0.03, 0.01, 0.3, 6);

const stemMat = new THREE.MeshStandardMaterial({ color: "#1a4a1a" });
const coreMat = new THREE.MeshStandardMaterial({ color: "#ffd700", emissive: "#ffaa00" });

const HeartParticle = () => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += 0.02;
      ref.current.rotation.y += 0.02;
      ref.current.scale.multiplyScalar(0.99);
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

const PetalLayer = ({ count, radius, layerScale, layerOffset, petalRotation, clicked }: any) => {
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: clicked ? "#ff85c0" : "#ffb6c1", // Soft pink / Light pink
    roughness: 0.4, 
    metalness: 0.1,
    emissive: clicked ? "#ff1493" : "#220011",
    side: THREE.DoubleSide
  }), [clicked]);

  const petals = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      items.push(
        <mesh 
          key={i} 
          geometry={petalGeo}
          material={material}
          position={[
            Math.cos(angle) * radius, 
            layerOffset, 
            Math.sin(angle) * radius
          ]}
          rotation={[
            petalRotation, 
            -angle + Math.PI / 2, 
            0
          ]}
          scale={[0.4, 1.5, 1]} // Stretch to make it look like a lily petal
        />
      );
    }
    return items;
  }, [count, radius, layerOffset, petalRotation, material]);

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
      // Bloom the whole group first
      gsap.to(groupRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 2,
        delay: delay,
        ease: "power2.out",
        onComplete: () => setHasBloomed(true)
      });

      gsap.to(petalsRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 3,
        delay: delay + 0.5,
        ease: "power2.out"
      });

      gsap.from(petalsRef.current.rotation, {
        y: Math.PI / 2,
        duration: 4,
        delay: delay + 0.5,
        ease: "power2.out"
      });
    }
  }, [isStarted, delay, scale]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (clicked) return;
    setClicked(true);
    setHearts(prev => [...prev, Date.now()]);
    setTimeout(() => {
      setClicked(false);
      setHearts(prev => prev.slice(1));
    }, 2000);
  };

  useFrame((state) => {
    if (groupRef.current && hasBloomed) {
      const targetScale = hovered ? scale * 1.1 : scale;
      vec.set(targetScale, targetScale, targetScale);
      groupRef.current.scale.lerp(vec, 0.1);
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
      <mesh position={[0, -1, 0]} geometry={stemGeo} material={stemMat} />

      <group ref={petalsRef} scale={0.1}>
        {/* Anthers/Pistil (Lily core) */}
        <group position={[0, 0.2, 0]}>
            {[0, 1, 2, 3, 4].map(i => (
                <mesh key={i} geometry={coreGeo} material={coreMat} rotation={[0.4, (i/5) * Math.PI * 2, 0]} position={[0.05, 0.1, 0]} />
            ))}
        </group>
        
        {/* Lily usually has 6 petals in two layers of 3 */}
        <PetalLayer count={3} radius={0.05} layerScale={1} layerOffset={0} petalRotation={0.6} clicked={clicked} />
        <PetalLayer count={3} radius={0.05} layerScale={1.1} layerOffset={0.05} petalRotation={1.1} clicked={clicked} />
      </group>

      {hearts.map(id => (
        <HeartParticle key={id} />
      ))}

      {clicked && (
        <pointLight intensity={5} distance={3} color="#ff69b4" position={[0, 0.5, 0]} />
      )}
    </group>
  );
}
