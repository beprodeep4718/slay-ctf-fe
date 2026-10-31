"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { StageInfo } from "./Stage";

type Shape = { sides: number; profile: [number, number][] };

// One lathe profile per track, then the rank-one relic.
const SHAPES: Shape[] = [
  { sides: 6, profile: [[0, -1], [0.75, -0.5], [0.75, 0.5], [0, 1]] },
  { sides: 4, profile: [[0, -0.8], [1.05, -0.8], [1.05, 0.8], [0, 0.8]] },
  { sides: 3, profile: [[0, -0.8], [0.35, -0.2], [0.8, 0], [0.35, 0.2], [0, 1.4]] },
  { sides: 8, profile: [[0, -1], [0.9, -0.9], [0.2, 0], [0.9, 0.9], [0, 1]] },
  { sides: 5, profile: [[0, -0.45], [1.15, -0.12], [1.15, 0.12], [0, 0.45]] },
  { sides: 12, profile: [[0, -1], [0.7, -0.72], [1, 0], [0.7, 0.72], [0, 1]] },
  { sides: 8, profile: [[0, -1.4], [0.65, 0.2], [0, 1.4]] },
];

function Weapon({ shape, still }: { shape: number; still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const pop = useRef(0);
  const shown = useRef(shape);

  const geometry = useMemo(() => {
    const { sides, profile } = SHAPES[shape] ?? SHAPES[0];
    return new THREE.LatheGeometry(
      profile.map(([r, y]) => new THREE.Vector2(r, y)),
      sides,
    );
  }, [shape]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    if (shown.current !== shape) {
      shown.current = shape;
      pop.current = 0;
    }
    pop.current = Math.min(1, pop.current + dt * 3.5);
    g.scale.setScalar(0.55 + (1 - Math.pow(1 - pop.current, 3)) * 0.45);
    if (still) return;
    g.rotation.y += dt * 0.7;
    g.rotation.x += (0.28 + pointer.current.y * 0.3 - g.rotation.x) * 0.08;
    g.rotation.z += (pointer.current.x * -0.2 - g.rotation.z) * 0.08;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          flatShading
          side={THREE.DoubleSide}
          color="#e10600"
          emissive="#3a0505"
          metalness={0.7}
          roughness={0.28}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2 - 0.2, 0, 0]}>
        <torusGeometry args={[1.75, 0.012, 6, 96]} />
        <meshBasicMaterial color="#ff4b3e" />
      </mesh>
    </group>
  );
}

export default function WeaponScene({ shape, running, still }: StageInfo & { shape: number }) {
  return (
    <Canvas
      frameloop={running ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ fov: 32, position: [0, 0, 7] }}
      gl={{ alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} color="#ffb0a0" />
      <directionalLight position={[-3, 5, 5]} intensity={3.4} color="#ffffff" />
      <pointLight position={[3, -2, 3]} intensity={30} color="#ff4b3e" />
      <Weapon shape={shape} still={still} />
    </Canvas>
  );
}
