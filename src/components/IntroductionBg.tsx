import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  isPlaying?: boolean;
};

export default function IntroductionBg({ isPlaying = false }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x00000a, 1);
    mount.appendChild(renderer.domElement);

    // --- Scene / Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    // --- Shader sources ---
    const vertShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (200.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `;
    const fragShader = `
      varying vec3 vColor;
      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        float alpha = smoothstep(0.5, 0.05, d);
        gl_FragColor = vec4(vColor, alpha);
      }
    `;

    const makeMaterial = (opacity = 1.0) =>
      new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: vertShader,
        fragmentShader: fragShader,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity,
      });

    // --- Main particle field ---
    const N = 2400;
    const positions = new Float32Array(N * 3);
    const velocities = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const phases = new Float32Array(N);

    const palette: [number, number, number][] = [
      [1.0,  1.0,  1.0 ],  // pure white
      [0.9,  0.95, 1.0 ],  // blue-white
      [0.85, 0.92, 1.0 ],  // cool white
      [1.0,  0.98, 0.92],  // warm white
      [0.75, 0.88, 1.0 ],  // soft blue
      [0.95, 0.95, 1.0 ],  // near white
      [0.7,  0.82, 1.0 ],  // pale blue
    ];

    for (let i = 0; i < N; i++) {
      const r = Math.pow(Math.random(), 0.4) * 90;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.4;

      const spd = 0.006 + Math.random() * 0.012;
      const a = Math.random() * Math.PI * 2;
      const b = Math.random() * Math.PI * 2;
      velocities[i * 3] = spd * Math.cos(a) * Math.sin(b);
      velocities[i * 3 + 1] = spd * Math.sin(a) * Math.sin(b) * 0.5;
      velocities[i * 3 + 2] = spd * Math.cos(b) * 0.3;

      const c = palette[Math.floor(Math.random() * palette.length)];
      const bright = 0.6 + Math.random() * 0.4;
      colors[i * 3] = c[0] * bright;
      colors[i * 3 + 1] = c[1] * bright;
      colors[i * 3 + 2] = c[2] * bright;

      sizes[i] = 1.5 + Math.random() * 4.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    const particles = new THREE.Points(geo, makeMaterial());
    scene.add(particles);



    // --- Mouse parallax ---
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("mousemove", onMouseMove);

    // --- Animation loop ---
    let animId: number;
    let t = 0;
    const pos3 = geo.attributes.position.array as Float32Array;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      // slightly faster when music is playing
      const speed = isPlayingRef.current ? 1.6 : 1.0;
      t += 0.004 * speed;

      for (let i = 0; i < N; i++) {
        pos3[i * 3] +=
          (velocities[i * 3] + Math.sin(t * 0.3 + phases[i]) * 0.008) * speed;
        pos3[i * 3 + 1] +=
          (velocities[i * 3 + 1] + Math.cos(t * 0.25 + phases[i]) * 0.005) *
          speed;
        pos3[i * 3 + 2] += velocities[i * 3 + 2] * speed;

        const x = pos3[i * 3];
        const y = pos3[i * 3 + 1];
        const z = pos3[i * 3 + 2];
        if (Math.sqrt(x * x + y * y + z * z) > 95) {
          const s2 = 0.006 + Math.random() * 0.01;
          const a2 = Math.random() * Math.PI * 2;
          const b2 = Math.random() * Math.PI * 2;
          velocities[i * 3] = s2 * Math.cos(a2) * Math.sin(b2);
          velocities[i * 3 + 1] = s2 * Math.sin(a2) * Math.sin(b2) * 0.5;
          velocities[i * 3 + 2] = s2 * Math.cos(b2) * 0.3;
          const nr = Math.pow(Math.random(), 0.4) * 90;
          const nt = Math.random() * Math.PI * 2;
          const np = Math.acos(2 * Math.random() - 1);
          pos3[i * 3] = nr * Math.sin(np) * Math.cos(nt);
          pos3[i * 3 + 1] = nr * Math.sin(np) * Math.sin(nt) * 0.55;
          pos3[i * 3 + 2] = nr * Math.cos(np) * 0.4;
        }
      }
      geo.attributes.position.needsUpdate = true;

      particles.rotation.y += (0.0008 + mouse.x * 0.0003) * speed;
      particles.rotation.x += (0.0002 + mouse.y * 0.0002) * speed;

      camera.position.x += (mouse.x * 8 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 5 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize ---
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      geo.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}