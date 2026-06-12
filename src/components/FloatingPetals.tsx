import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FloatingPetals() {
  const count = 40;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const petals = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          Math.random() * 10 - 2,
          (Math.random() - 0.5) * 15
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          -0.01 - Math.random() * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        spin: Math.random() * 0.01
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    petals.forEach((petal, i) => {
      // Update position
      petal.position.add(petal.velocity);
      petal.rotation.x += petal.spin;
      petal.rotation.y += petal.spin;

      // Wrap around
      if (petal.position.y < -5) petal.position.y = 5;
      if (petal.position.x > 8) petal.position.x = -8;
      if (petal.position.x < -8) petal.position.x = 8;
      if (petal.position.z > 8) petal.position.z = -8;
      if (petal.position.z < -8) petal.position.z = 8;

      dummy.position.copy(petal.position);
      dummy.rotation.copy(petal.rotation);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial 
        color="#8B0000" 
        roughness={0.8} 
        transparent 
        opacity={0.6} 
        side={THREE.DoubleSide} 
      />
    </instancedMesh>
  );
}
