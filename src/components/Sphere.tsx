
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface SphereProps {
  position: [number, number, number];
  radius: number;
  baseIntensity: number;
  audioLevel: number;
  delay: number;
}

// Colors
const IDLE_COLOR = "#FFC107"; // Yellow
const ACTIVE_COLOR_HIGH = "#E53935"; // Red
const ACTIVE_COLOR_LOW = "#43A047"; // Green

const Sphere = ({ position, radius, baseIntensity, audioLevel, delay }: SphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Time tracking for animations
  const timeRef = useRef({
    elapsed: Math.random() * 1.5, // Random phase offset for idle pulsing
    active: false,
    triggerTime: 0,
    targetScale: 1,
    currentScale: 1,
    targetIntensity: baseIntensity,
    currentIntensity: baseIntensity,
    targetColor: new THREE.Color(IDLE_COLOR),
    currentColor: new THREE.Color(IDLE_COLOR)
  });
  
  // Effect to handle audio level changes
  useEffect(() => {
    const targetColor = audioLevel >= 0.5 ? ACTIVE_COLOR_HIGH : ACTIVE_COLOR_LOW;
    
    if (audioLevel > 0.2) {
      // Mark as active and set animation targets
      timeRef.current.active = true;
      timeRef.current.triggerTime = 0;
      timeRef.current.targetScale = 1.2;
      timeRef.current.targetIntensity = baseIntensity * 1.5;
      timeRef.current.targetColor = new THREE.Color(targetColor);
      
      // Schedule reset to idle state
      const resetTimer = setTimeout(() => {
        timeRef.current.active = false;
        timeRef.current.targetScale = 1;
        timeRef.current.targetIntensity = baseIntensity;
        timeRef.current.targetColor = new THREE.Color(IDLE_COLOR);
      }, 700 + delay * 1000); // Active duration + delay
      
      return () => clearTimeout(resetTimer);
    } else {
      // Return to idle state
      timeRef.current.active = false;
      timeRef.current.targetScale = 1;
      timeRef.current.targetIntensity = baseIntensity;
      timeRef.current.targetColor = new THREE.Color(IDLE_COLOR);
    }
  }, [audioLevel, delay, baseIntensity]);

  // Animation loop
  useFrame((_state, delta) => {
    timeRef.current.elapsed += delta;
    
    if (!timeRef.current.active) {
      // Idle pulsing animation
      const pulseIntensity = baseIntensity * (0.5 + Math.sin(timeRef.current.elapsed * 2) * 0.15);
      const pulseScale = 0.9 + Math.sin(timeRef.current.elapsed * 2) * 0.1;
      
      if (materialRef.current) {
        materialRef.current.emissiveIntensity = pulseIntensity;
      }
      
      if (meshRef.current) {
        meshRef.current.scale.setScalar(pulseScale);
      }
    } else {
      // When active, track trigger time and interpolate values
      timeRef.current.triggerTime += delta;
      
      // Smoothly interpolate current values towards target values
      const t = Math.min(1, delta * 10); // Interpolation factor
      
      // Update scale
      timeRef.current.currentScale += (timeRef.current.targetScale - timeRef.current.currentScale) * t;
      if (meshRef.current) {
        meshRef.current.scale.setScalar(timeRef.current.currentScale);
      }
      
      // Update intensity
      timeRef.current.currentIntensity += (timeRef.current.targetIntensity - timeRef.current.currentIntensity) * t;
      if (materialRef.current) {
        materialRef.current.emissiveIntensity = timeRef.current.currentIntensity;
      }
      
      // Update color
      if (materialRef.current) {
        materialRef.current.emissive.lerp(timeRef.current.targetColor, t);
      }
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
    >
      <sphereGeometry args={[radius, 32, 16]} />
      <meshStandardMaterial
        ref={materialRef}
        roughness={0.3}
        metalness={0.2}
        emissive={IDLE_COLOR}
        emissiveIntensity={baseIntensity}
        toneMapped={false}
        color="#ffffff"
      />
    </mesh>
  );
};

export default Sphere;
