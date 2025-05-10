
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo } from "react";
import Ring from "./Ring";

interface RingControllerProps {
  audioLevels: number[];
}

const RingController = ({ audioLevels }: RingControllerProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Rotation animation
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z -= delta * (Math.PI / 36); // 5 degrees per second
    }
  });

  // Calculate levels for each ring
  const primaryLevels = useMemo(() => {
    return audioLevels.slice(0, 64);
  }, [audioLevels]);

  const secondaryLevels = useMemo(() => {
    return audioLevels.slice(64, 96);
  }, [audioLevels]);

  return (
    <group ref={groupRef} name="Ring_CTRL">
      <Ring 
        count={64} 
        radius={150} 
        sphereRadius={3.5} 
        radialJitter={2} 
        tangentialJitter={1} 
        baseIntensity={0.8} 
        levels={primaryLevels} 
        angleOffset={0}
      />
      <Ring 
        count={32} 
        radius={100} 
        sphereRadius={2.5} 
        radialJitter={1.5} 
        tangentialJitter={0.5} 
        baseIntensity={0.6} 
        levels={secondaryLevels} 
        angleOffset={Math.PI / 64} // Half-step offset (5.625° / 2)
      />
    </group>
  );
};

export default RingController;
