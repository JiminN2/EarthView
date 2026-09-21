import { useEffect, useRef } from "react";
import Wave from "./Wave";

type Props = {
  active: boolean;
  width?: number;
  height? : number;
  color?: string;
};

export default function WaveCanvas({
  active,
  width = 100,
  height = 30,
  color = "white",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  // 리렌더 없이 최신 active 값을 루프 안에서 읽기 위함
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current; //HTMLCanvasElement | null
    if (!canvas) return;
    // 이 아래부터 canvas는 HTMLCanvasElement로 좁혀짐 여기까지 왔다는 건 canvas가 null 이 아니라는 뜻

    const ctx = canvas.getContext("2d"); //CanvasRendringContext2D | null
    if (!ctx) return;

    const pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

    const wave = new Wave(6, color, 2);
    wave.resize(width, height);

    let rafId = 0
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      wave.draw(ctx, activeRef.current);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(rafId);
  }, [width, height, color]);

  return (
    <canvas ref={canvasRef} style={{ width, height, display: "block" }} />
  );
}