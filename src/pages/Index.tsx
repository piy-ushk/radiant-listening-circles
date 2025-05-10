
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import RingController from "@/components/RingController";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const generateDummyAudioLevels = () => {
  // Generate random audio levels for demonstration
  const levels = new Array(96).fill(0).map(() => Math.random());
  return levels;
};

const Index = () => {
  const [audioLevels, setAudioLevels] = useState<number[]>(generateDummyAudioLevels());

  // Periodically update audio levels for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioLevels(generateDummyAudioLevels());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen" style={{ background: "#1C1D20" }}>
      <Canvas orthographic camera={{ position: [0, 0, 200], zoom: 1 }}>
        <color attach="background" args={["#1C1D20"]} />
        <RingController audioLevels={audioLevels} />
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.1} 
            luminanceSmoothing={0.9} 
            intensity={1.2} 
          />
        </EffectComposer>
      </Canvas>
      <div className="absolute top-6 left-0 w-full text-center text-white/70 text-xl">
        Almost there...
      </div>
    </div>
  );
};

export default Index;
