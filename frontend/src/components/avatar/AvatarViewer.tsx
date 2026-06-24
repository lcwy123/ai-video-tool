'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';

function PlaceholderModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.8, 1, 1.5, 8]} />
        <meshStandardMaterial color="#60a5fa" roughness={0.4} />
      </mesh>
      <mesh position={[-0.4, 0.3, 0.9]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.4, 0.3, 0.9]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </Float>
  );
}

interface AvatarViewerProps {
  modelUrl?: string | null;
  className?: string;
}

export default function AvatarViewer({ modelUrl, className = '' }: AvatarViewerProps) {
  return (
    <div className={`bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, 5, -5]} intensity={0.3} />
          <PlaceholderModel />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={5} blur={2} />
          <OrbitControls
            enablePan={false}
            minDistance={2.5}
            maxDistance={8}
            minPolarAngle={0.5}
            maxPolarAngle={2.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
