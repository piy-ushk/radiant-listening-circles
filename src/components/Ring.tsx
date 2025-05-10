
import { useMemo } from "react";
import * as THREE from "three";
import Sphere from "./Sphere";

interface RingProps {
  count: number;
  radius: number;
  sphereRadius: number;
  radialJitter: number;
  tangentialJitter: number;
  baseIntensity: number;
  levels: number[];
  angleOffset: number;
}

const Ring = ({ 
  count, 
  radius, 
  sphereRadius, 
  radialJitter, 
  tangentialJitter,
  baseIntensity,
  levels,
  angleOffset
}: RingProps) => {
  
  // Generate sphere positions with jitter
  const positions = useMemo(() => {
    const angleStep = (Math.PI * 2) / count;
    
    return Array.from({ length: count }).map((_, i) => {
      const angle = i * angleStep + angleOffset;
      
      // Apply jitter
      const radialOffset = (Math.random() * 2 - 1) * radialJitter;
      const adjustedRadius = radius + radialOffset;
      
      const tangentialOffset = (Math.random() * 2 - 1) * tangentialJitter;
      const adjustedAngle = angle + (tangentialOffset / radius);
      
      return {
        position: [
          Math.cos(adjustedAngle) * adjustedRadius,
          Math.sin(adjustedAngle) * adjustedRadius,
          0
        ] as [number, number, number],
        delay: Math.random() * 0.2 // Random delay for animations
      };
    });
  }, [count, radius, radialJitter, tangentialJitter, angleOffset]);

  return (
    <>
      {positions.map((pos, i) => (
        <Sphere
          key={i}
          position={pos.position}
          radius={sphereRadius}
          baseIntensity={baseIntensity}
          audioLevel={levels[i] || 0}
          delay={pos.delay}
        />
      ))}
    </>
  );
};

export default Ring;
