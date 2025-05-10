
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";

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
    triggerTime: 0
  });
  
  // Determine the color based on audio level
  const targetColor = audioLevel >= 0.5 ? ACTIVE_COLOR_HIGH : ACTIVE_COLOR_LOW;
  
  // Springs for animations
  const { scale, intensity, color } = useSpring({
    scale: audioLevel > 0.2 ? 1.2 : 1,
    intensity: audioLevel > 0.2 ? baseIntensity * 1.5 : baseIntensity,
    color: audioLevel > 0.2 ? targetColor : IDLE_COLOR,
    delay: audioLevel > 0.2 ? delay * 1000 : 0,
    config: { tension: 120, friction: 14 }
  });

  // Effect to handle audio level changes
  useEffect(() => {
    if (audioLevel > 0.2) {
      // Mark as active
      timeRef.current.active = true;
      timeRef.current.triggerTime = 0;
      
      // Schedule reset to idle state
      const resetTimer = setTimeout(() => {
        timeRef.current.active = false;
      }, 700 + delay * 1000); // Active duration + delay
      
      return () => clearTimeout(resetTimer);
    }
  }, [audioLevel, delay]);

  // Idle animation loop
  useFrame((_state, delta) => {
    if (!timeRef.current.active) {
      timeRef.current.elapsed += delta;
      
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
      // When active, track trigger time for transition back to idle
      timeRef.current.triggerTime += delta;
    }
  });

  return (
    <animated.mesh 
      ref={meshRef} 
      position={position} 
      scale={scale}
    >
      <sphereGeometry args={[radius, 32, 16]} />
      <animated.meshStandardMaterial
        ref={materialRef}
        roughness={0.3}
        metalness={0.2}
        emissive={color}
        emissiveIntensity={intensity}
        toneMapped={false}
        color="#ffffff"
      />
    </animated.mesh>
  );
};

export default Sphere;
