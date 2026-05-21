import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { isPlaying?: boolean };

export default function IntroductionBg({ isPlaying = false }: Props) {
  const mountRef    = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x00000a, 1);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 80;

    // ── Shaders ──────────────────────────────────────────────────────────────
    const vertShader = `
      attribute float size;
      attribute float alpha;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color; vAlpha = alpha;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (200.0 / -mvPos.z);
        gl_Position  = projectionMatrix * mvPos;
      }`;
    const fragShader = `
      varying vec3 vColor; varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float a = smoothstep(0.5, 0.05, d) * vAlpha;
        gl_FragColor = vec4(vColor, a);
      }`;
    const makePointsMat = () => new THREE.ShaderMaterial({
      vertexShader: vertShader, fragmentShader: fragShader,
      vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });

    // ── Background star field ─────────────────────────────────────────────────
    const N   = 1200;
    const bgPos   = new Float32Array(N * 3);
    const bgVel   = new Float32Array(N * 3);
    const bgCol   = new Float32Array(N * 3);
    const bgSz    = new Float32Array(N);
    const bgPh    = new Float32Array(N);
    const bgAlpha = new Float32Array(N);
    const pal: [number,number,number][] = [
      [1.0,1.0,1.0],[0.9,0.95,1.0],[0.85,0.92,1.0],
      [1.0,0.98,0.92],[0.75,0.88,1.0],[0.95,0.95,1.0],[0.7,0.82,1.0],
    ];
    for (let i = 0; i < N; i++) {
      const r = Math.pow(Math.random(),0.4)*90;
      const th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
      bgPos[i*3]   = r*Math.sin(ph)*Math.cos(th);
      bgPos[i*3+1] = r*Math.sin(ph)*Math.sin(th)*0.55;
      bgPos[i*3+2] = r*Math.cos(ph)*0.4;
      const spd=0.002+Math.random()*0.004, a=Math.random()*Math.PI*2, b=Math.random()*Math.PI*2;
      bgVel[i*3]=spd*Math.cos(a)*Math.sin(b); bgVel[i*3+1]=spd*Math.sin(a)*Math.sin(b)*0.5; bgVel[i*3+2]=spd*Math.cos(b)*0.3;
      const c=pal[Math.floor(Math.random()*pal.length)], br=0.6+Math.random()*0.4;
      bgCol[i*3]=c[0]*br; bgCol[i*3+1]=c[1]*br; bgCol[i*3+2]=c[2]*br;
      bgSz[i]=1.5+Math.random()*4.5; bgPh[i]=Math.random()*Math.PI*2; bgAlpha[i]=1.0;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPos,  3));
    bgGeo.setAttribute("color",    new THREE.BufferAttribute(bgCol,  3));
    bgGeo.setAttribute("size",     new THREE.BufferAttribute(bgSz,   1));
    bgGeo.setAttribute("alpha",    new THREE.BufferAttribute(bgAlpha,1));
    const bgParticles = new THREE.Points(bgGeo, makePointsMat());
    scene.add(bgParticles);

    // ── 1-seat sofa particle cloud ────────────────────────────────────────────
    // All geometry is rounded / puffy — no sharp edges
    type Pt = { x:number; y:number; z:number; zone:string };
    const pts: Pt[] = [];
    const rnd = (a:number,b:number) => a + Math.random()*(b-a);
    const jit = (v:number,j:number) => v + (Math.random()-0.5)*j;

    // helpers
    const addBlob = (cx:number,cy:number,cz:number, rx:number,ry:number,rz:number, count:number, zone:string) => {
      for (let i=0;i<count;i++) {
        // uniform distribution inside ellipsoid
        let x,y,z;
        do { x=rnd(-1,1); y=rnd(-1,1); z=rnd(-1,1); } while (x*x+y*y+z*z>1);
        pts.push({ x:cx+x*rx, y:cy+y*ry, z:cz+z*rz, zone });
      }
    };

    // ── Seat cushion (wide, flat ellipsoid, strongly puffy on top)
    for (let i=0;i<1600;i++) {
      const u = rnd(-5.5, 5.5);
      const w = rnd(-5.0, 5.0);
      // puff: higher in center, lower at edges
      const puff = 1.5*(1-(u*u/32+w*w/28));
      const h = rnd(-0.6, Math.max(0.1, puff));
      pts.push({ x:jit(u,0.35), y:jit(h,0.3), z:jit(w,0.35), zone:"seat" });
    }

    // ── Seat base / skirt (rounded bottom band)
    for (let i=0;i<300;i++) {
      const u = rnd(-5.2,5.2), w = rnd(-4.8,4.8);
      pts.push({ x:jit(u,0.3), y:rnd(-1.8,-0.5), z:jit(w,0.3), zone:"skirt" });
    }

    // ── Backrest — tall, very puffy, pillowy
    // Main pillow body
    for (let i=0;i<1800;i++) {
      const u = rnd(-5.0,5.0);
      const h = rnd(0.2, 9.0);
      // puff forward (negative z = toward viewer)
      const puffZ = 1.8*(1-(u*u/27))*(Math.sin((h/9.0)*Math.PI)*0.8+0.2);
      const puffX = 0.4*(1-(h/9.0)*(h/9.0));  // slightly wider at bottom
      pts.push({
        x: jit(u, 0.35+puffX),
        y: jit(h+0.5, 0.3),
        z: jit(-5.2+puffZ, 0.4),
        zone:"back"
      });
    }
    // Back panel (behind pillow)
    for (let i=0;i<200;i++) {
      pts.push({ x:jit(rnd(-4.8,4.8),0.2), y:rnd(0,9.5), z:jit(-6.2,0.25), zone:"back" });
    }

    // ── Side bolsters (thick rounded arms) — key sofa feature
    for (const side of [-1,1]) {
      const sx = side * 5.6;
      // Main arm blob — big rounded pillow
      addBlob(sx, 2.8, -1.5,  1.2, 2.6, 3.2, 450, "arm");
      // Top cap (rounded top of arm)
      addBlob(sx, 5.2, -1.8,  1.0, 0.9, 2.8, 200, "armtop");
      // Front face of arm
      addBlob(sx, 1.5,  3.5,  1.0, 1.5, 1.2, 140, "arm");
    }

    // ── Short rounded legs (4, stubby)
    const legXZ: [number,number][] = [[-4.2,-3.8],[-4.2,3.2],[4.2,-3.8],[4.2,3.2]];
    for (const [lx,lz] of legXZ) {
      for (let i=0;i<80;i++) {
        pts.push({ x:jit(lx,0.3), y:rnd(-3.8,-1.8), z:jit(lz,0.3), zone:"leg" });
      }
    }

    // ── Build GPU arrays ──
    const CP   = pts.length;
    const cPos0  = new Float32Array(CP*3);
    const cPos   = new Float32Array(CP*3);
    const cVel   = new Float32Array(CP*3);
    const cCol   = new Float32Array(CP*3);
    const cSz    = new Float32Array(CP);
    const cAlpha = new Float32Array(CP);
    const cPh    = new Float32Array(CP);

    // Navy + silver palette
    const navyPal: [number,number,number][] = [
      [0.06,0.10,0.32],  // 0 darkest navy
      [0.09,0.15,0.42],  // 1 deep navy
      [0.12,0.20,0.52],  // 2 navy
      [0.16,0.27,0.62],  // 3 mid navy
      [0.40,0.52,0.72],  // 4 steel blue highlight
      [0.62,0.72,0.88],  // 5 silver-blue
      [0.80,0.88,0.98],  // 6 bright silver
      [0.22,0.34,0.68],  // 7 accent
    ];
    const zoneCol: Record<string,number[]> = {
      seat:   [1,2,3,4,5,6],
      skirt:  [0,1,1,2],
      back:   [1,2,3,4,5,6],
      arm:    [1,2,3,4,5],
      armtop: [4,5,6,6,6],  // silver on top of arm
      leg:    [4,5,6],
    };

    for (let i=0;i<CP;i++) {
      const p = pts[i];
      cPos0[i*3]=p.x; cPos0[i*3+1]=p.y; cPos0[i*3+2]=p.z;
      cPos[i*3] =p.x; cPos[i*3+1] =p.y; cPos[i*3+2] =p.z;

      const arr = zoneCol[p.zone]||[1,2,3];
      const ci  = arr[Math.floor(Math.random()*arr.length)];
      const c   = navyPal[ci];
      // Silver sheen: top faces get boost
      const isTop = (p.zone==="seat"&&p.y>0.8)||(p.zone==="armtop")||(p.zone==="back"&&p.y>7.5);
      const br  = isTop ? 1.4+Math.random()*0.6 : 0.75+Math.random()*0.45;
      cCol[i*3]  =Math.min(1,c[0]*br);
      cCol[i*3+1]=Math.min(1,c[1]*br);
      cCol[i*3+2]=Math.min(1,c[2]*br);

      // Particle size: bigger on cushion/bolster, tiny on legs
      cSz[i] = p.zone==="leg"   ? 1.0+Math.random()*1.2
              : p.zone==="skirt" ? 1.4+Math.random()*1.6
              : p.zone==="seat"  ? 2.2+Math.random()*3.2
              :                    2.0+Math.random()*3.0;
      cAlpha[i] = 0.0;  // start invisible — fade in on scroll
      cPh[i]    = Math.random()*Math.PI*2;
    }

    const chairGeo = new THREE.BufferGeometry();
    chairGeo.setAttribute("position", new THREE.BufferAttribute(cPos,   3));
    chairGeo.setAttribute("color",    new THREE.BufferAttribute(cCol,   3));
    chairGeo.setAttribute("size",     new THREE.BufferAttribute(cSz,    1));
    chairGeo.setAttribute("alpha",    new THREE.BufferAttribute(cAlpha, 1));
    const chairMesh = new THREE.Points(chairGeo, makePointsMat());
    chairMesh.position.set(0, -3, -55);
    scene.add(chairMesh);

    // ── Scroll ────────────────────────────────────────────────────────────────
    const scroll = { progress:0, target:0 };
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scroll.target = max>0 ? window.scrollY/max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive:true });

    const CAM_Z_START = 80, CAM_Z_END = -40;
    // sofa becomes visible when p > SOFA_APPEAR (fade in over SOFA_FADE range)
    const SOFA_APPEAR = 0.50;
    const SOFA_FADE   = 0.25;

    // ── Mouse ─────────────────────────────────────────────────────────────────
    const mouse   = { x:0, y:0 };
    const pointer = new THREE.Vector2(-999,-999);
    const onMouseMove = (e:MouseEvent) => {
      mouse.x =  (e.clientX/window.innerWidth  - 0.5)*2;
      mouse.y = -(e.clientY/window.innerHeight - 0.5)*2;
      pointer.set(mouse.x, mouse.y);
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Animation ─────────────────────────────────────────────────────────────
    let animId: number, t = 0;
    const pos3    = bgGeo.attributes.position.array as Float32Array;
    const livePos = chairGeo.attributes.position.array as Float32Array;
    const liveAlpha = chairGeo.attributes.alpha.array as Float32Array;
    const BOUNCE_R  = 6.0, BOUNCE_F = 0.20, SPRING = 0.042, DAMP = 0.80;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const speed = isPlayingRef.current ? 1.6 : 1.0;
      t += 0.002 * speed;

      scroll.progress += (scroll.target - scroll.progress) * 0.06;
      const p = scroll.progress;

      // ── Background stars ──
      for (let i=0;i<N;i++) {
        pos3[i*3]  +=(bgVel[i*3]  +Math.sin(t*0.15+bgPh[i])*0.003)*speed;
        pos3[i*3+1]+=(bgVel[i*3+1]+Math.cos(t*0.12+bgPh[i])*0.002)*speed;
        pos3[i*3+2]+=bgVel[i*3+2]*speed;
        const x=pos3[i*3],y=pos3[i*3+1],z=pos3[i*3+2];
        if (Math.sqrt(x*x+y*y+z*z)>95) {
          const s2=0.006+Math.random()*0.01, a2=Math.random()*Math.PI*2, b2=Math.random()*Math.PI*2;
          bgVel[i*3]=s2*Math.cos(a2)*Math.sin(b2); bgVel[i*3+1]=s2*Math.sin(a2)*Math.sin(b2)*0.5; bgVel[i*3+2]=s2*Math.cos(b2)*0.3;
          const nr=Math.pow(Math.random(),0.4)*90, nt=Math.random()*Math.PI*2, np=Math.acos(2*Math.random()-1);
          pos3[i*3]=nr*Math.sin(np)*Math.cos(nt); pos3[i*3+1]=nr*Math.sin(np)*Math.sin(np)*0.55; pos3[i*3+2]=nr*Math.cos(np)*0.4;
        }
      }
      bgGeo.attributes.position.needsUpdate = true;
      bgParticles.rotation.y += (0.0003+mouse.x*0.0001)*speed;
      bgParticles.rotation.x += (0.0001+mouse.y*0.0001)*speed;

      // ── Sofa alpha fade-in based on scroll ──
      const sofaAlpha = Math.min(1, Math.max(0, (p - SOFA_APPEAR) / SOFA_FADE));
      for (let i=0;i<CP;i++) {
        liveAlpha[i] = (0.72+Math.random()*0.0)*sofaAlpha; // stable, not flickering
      }
      // only mark needsUpdate if alpha actually changed
      if (sofaAlpha > 0 || p > SOFA_APPEAR - 0.05) {
        chairGeo.attributes.alpha.needsUpdate = true;
      }

      // ── Sofa float ──
      chairMesh.position.y = -3 + Math.sin(t*0.25)*0.3;

      // ── Hover bounce (only when sofa visible) ──
      if (sofaAlpha > 0.05) {
        const ray = new THREE.Raycaster();
        ray.setFromCamera(pointer, camera);
        const chairWorld = new THREE.Vector3(0, chairMesh.position.y, -55);
        const toC = chairWorld.clone().sub(ray.ray.origin);
        const proj = toC.dot(ray.ray.direction);
        const hitWorld = ray.ray.origin.clone().addScaledVector(ray.ray.direction, Math.max(proj,0));
        const localHit = hitWorld.clone().sub(chairMesh.position);

        for (let i=0;i<CP;i++) {
          const rx=livePos[i*3]-localHit.x, ry=livePos[i*3+1]-localHit.y, rz=livePos[i*3+2]-localHit.z;
          const dist=Math.sqrt(rx*rx+ry*ry+rz*rz);
          if (dist<BOUNCE_R&&dist>0.001) {
            const f=(1-dist/BOUNCE_R)*BOUNCE_F;
            cVel[i*3]+=rx/dist*f; cVel[i*3+1]+=ry/dist*f; cVel[i*3+2]+=rz/dist*f;
          }
          cVel[i*3]  +=(cPos0[i*3]  -livePos[i*3]  )*SPRING;
          cVel[i*3+1]+=(cPos0[i*3+1]-livePos[i*3+1])*SPRING;
          cVel[i*3+2]+=(cPos0[i*3+2]-livePos[i*3+2])*SPRING;
          cVel[i*3]*=DAMP; cVel[i*3+1]*=DAMP; cVel[i*3+2]*=DAMP;
          livePos[i*3]+=cVel[i*3]; livePos[i*3+1]+=cVel[i*3+1]; livePos[i*3+2]+=cVel[i*3+2];
        }
        chairGeo.attributes.position.needsUpdate = true;
      }

      // ── Subtle slow rotation ──
      chairMesh.rotation.y = Math.sin(t*0.08)*0.08;

      // ── Camera dive ──
      const tz = CAM_Z_START + (CAM_Z_END-CAM_Z_START)*p;
      camera.position.z += (tz-camera.position.z)*0.08;
      const ps = 1-p*0.7;
      camera.position.x += (mouse.x*3*ps-camera.position.x)*0.02;
      camera.position.y += (mouse.y*5*ps-camera.position.y)*0.03;
      camera.lookAt(0, -1.5, -30);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth/mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll",    onScroll);
      window.removeEventListener("resize",    onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose(); bgGeo.dispose(); chairGeo.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{ position:"fixed", inset:0, width:"100vw", height:"100vh", zIndex:0, pointerEvents:"none" }} />
  );
}