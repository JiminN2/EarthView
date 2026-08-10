import { Canvas } from "@react-three/fiber";

function Box() {
  return (
    <mesh rotation={[0.4, 0.6, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function ThreeTestBox() {
  return (
    <div style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Box />
      </Canvas>
    </div>
  );
}