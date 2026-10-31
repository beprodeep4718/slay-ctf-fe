"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import type { StageInfo } from "./Stage";

const SIZE = 0.6;
const CORE_Y = 2.7;
const TOWER_COUNT = 6;
const TOWER_RADIUS = 6.2;
const TOWER_TOP = 2;
const BEAM_LIFE = 0.55;

type Strike = { index: number; age: number };
type Wave = { radius: number };
type Battle = { strikes: Strike[]; waves: Wave[] };

const towers = Array.from({ length: TOWER_COUNT }, (_, i) => {
  const angle = (i * Math.PI) / 3 + 0.5;
  return new THREE.Vector3(Math.cos(angle) * TOWER_RADIUS, TOWER_TOP, Math.sin(angle) * TOWER_RADIUS);
});
const coreCentre = new THREE.Vector3(0, CORE_Y, 0);

function fire(battle: Battle) {
  battle.strikes.push({ index: Math.floor(Math.random() * TOWER_COUNT), age: 0 });
  battle.waves.push({ radius: 0.9 });
}

function advance(battle: Battle, dt: number) {
  battle.strikes = battle.strikes.filter((s) => (s.age += dt) < BEAM_LIFE).slice(-6);
  battle.waves = battle.waves.filter((w) => (w.radius += 5.6 * dt) < 9);
}

function Terrain({ battle, rings }: { battle: Battle; rings: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const tiles = useMemo(() => {
    const list: { x: number; z: number; dist: number; base: number }[] = [];
    for (let q = -rings; q <= rings; q++) {
      for (let r = -rings; r <= rings; r++) {
        if (Math.abs(q + r) > rings) continue;
        const x = SIZE * 1.5 * q;
        const z = SIZE * 1.732 * (r + q / 2);
        const dist = Math.hypot(x, z);
        if (dist > SIZE * 2.6) {
          list.push({ x, z, dist, base: (Math.sin(q * 1.3) + Math.cos(r * 1.7)) * 0.14 });
        }
      }
    }
    return list;
  }, [rings]);
  const edge = SIZE * 1.732 * rings;

  const scratch = useMemo(
    () => ({
      matrix: new THREE.Object3D(),
      color: new THREE.Color(),
      cold: new THREE.Color("#6e2a2c"),
      hot: new THREE.Color(5, 0.15, 0),
    }),
    [],
  );

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.elapsedTime;
    tiles.forEach((tile, i) => {
      let height = 1.6 + tile.base + Math.sin(tile.dist / 0.9 - t * 1.4) * 0.1;
      let glow = 0;
      for (const wave of battle.waves) {
        const gap = Math.abs(tile.dist - wave.radius);
        if (gap < 0.8) {
          const f = 1 - gap / 0.8;
          height += f * 0.46;
          glow = Math.max(glow, f);
        }
      }
      const fade = THREE.MathUtils.clamp((edge - tile.dist) / 2.6, 0, 1);
      scratch.matrix.position.set(tile.x, height / 2 - 0.4, tile.z);
      scratch.matrix.scale.set(fade, height, fade);
      scratch.matrix.updateMatrix();
      m.setMatrixAt(i, scratch.matrix.matrix);
      m.setColorAt(i, scratch.color.copy(scratch.cold).lerp(scratch.hot, glow));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh key={tiles.length} ref={mesh} args={[undefined, undefined, tiles.length]} frustumCulled={false}>
      <cylinderGeometry args={[SIZE * 0.95, SIZE * 0.95, 1, 6]} />
      <meshStandardMaterial flatShading metalness={0.15} roughness={0.5} />
    </instancedMesh>
  );
}

function Towers() {
  return towers.map((tower, i) => (
    <group key={i} position={[tower.x, 0, tower.z]}>
      <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.1, 0.26, 1.6, 4]} />
        <meshStandardMaterial flatShading color="#2a0c0e" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, TOWER_TOP, 0]}>
        <octahedronGeometry args={[0.14]} />
        <meshBasicMaterial color={[5, 0.4, 0.25]} toneMapped={false} />
      </mesh>
    </group>
  ));
}

function Core({ battle }: { battle: Battle }) {
  const crystal = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const profile = [
      new THREE.Vector2(0, -2.1),
      new THREE.Vector2(1.05, 0.36),
      new THREE.Vector2(0, 2.1),
    ];
    return new THREE.LatheGeometry(profile, 8);
  }, []);

  useFrame((_, dt) => {
    if (crystal.current) crystal.current.rotation.y += dt * 0.5;
    if (ringA.current) ringA.current.rotation.z += dt * 0.9;
    if (ringB.current) ringB.current.rotation.z -= dt * 0.6;
    if (ringC.current) ringC.current.rotation.z += dt * 0.4;
    if (material.current) {
      const target = battle.strikes.length ? 4 : 1.1;
      material.current.emissiveIntensity += (target - material.current.emissiveIntensity) * 0.14;
    }
  });

  return (
    <group position={[0, CORE_Y, 0]}>
      <mesh ref={crystal} geometry={geometry}>
        <meshStandardMaterial
          ref={material}
          flatShading
          side={THREE.DoubleSide}
          color="#ff4b3e"
          emissive="#e10600"
          emissiveIntensity={1.1}
          metalness={0.5}
          roughness={0.22}
        />
      </mesh>
      {[
        { ref: ringA, radius: 2.2, rotation: [1.2, 0.2, 0] },
        { ref: ringB, radius: 2.7, rotation: [-0.5, 1.1, 0] },
        { ref: ringC, radius: 3.3, rotation: [0.7, -0.8, 0] },
      ].map(({ ref, radius, rotation }) => (
        <mesh key={radius} ref={ref} rotation={rotation as [number, number, number]}>
          <torusGeometry args={[radius, 0.018, 6, 96, Math.PI * 1.6]} />
          <meshBasicMaterial color={[3, 0.3, 0.2]} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Beams({ battle }: { battle: Battle }) {
  const group = useRef<THREE.Group>(null);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const direction = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    group.current?.children.forEach((child, i) => {
      const strike = battle.strikes[i];
      child.visible = Boolean(strike);
      if (!strike) return;
      const from = towers[strike.index];
      direction.subVectors(coreCentre, from);
      const life = 1 - strike.age / BEAM_LIFE;
      child.position.copy(from).addScaledVector(direction, 0.5);
      child.scale.set(life, direction.length(), life);
      child.quaternion.setFromUnitVectors(up, direction.clone().normalize());
    });
  });

  return (
    <group ref={group}>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} visible={false}>
          <cylinderGeometry args={[0.035, 0.035, 1, 6]} />
          <meshBasicMaterial color={[8, 0.8, 0.5]} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Embers({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      data[i * 3] = (THREE.MathUtils.seededRandom(i + 1) - 0.5) * 14;
      data[i * 3 + 1] = THREE.MathUtils.seededRandom(i + 500) * 6;
      data[i * 3 + 2] = (THREE.MathUtils.seededRandom(i + 900) - 0.5) * 14;
    }
    return data;
  }, [count]);

  useFrame((_, dt) => {
    const geometry = points.current?.geometry;
    if (!geometry) return;
    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const y = attribute.getY(i) + dt * (0.3 + (i % 7) * 0.09);
      attribute.setY(i, y > 6 ? 0 : y);
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={[4, 0.5, 0.3]} size={0.05} toneMapped={false} />
    </points>
  );
}

function Rig({ battle, still }: { battle: Battle; still: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  const next = useRef(1);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const down = (e: PointerEvent) => {
      if ((e.target as Element).closest?.("a,button,input,[role=dialog]")) return;
      fire(battle);
      fire(battle);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
    };
  }, [battle]);

  const yaw = useRef(0.4);
  const height = useRef(5);

  useFrame(({ camera, clock, size }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.elapsedTime;
    if (!still) {
      yaw.current += (t * 0.07 + 0.4 + pointer.current.x * 0.35 - yaw.current) * 0.08;
      height.current += (5 + pointer.current.y * 1.1 - height.current) * 0.08;
      next.current -= dt;
      if (next.current <= 0) {
        fire(battle);
        next.current = 0.6 + Math.random() * 1.1;
      }
    }
    // Portrait screens pull back and aim low, so the core clears the copy below it.
    const portrait = size.width < size.height;
    const distance = portrait ? 25 : 14;
    camera.position.set(Math.sin(yaw.current) * distance, height.current, Math.cos(yaw.current) * distance);
    camera.lookAt(0, portrait ? -2.2 : 2.2, 0);

    advance(battle, dt);
  });

  return null;
}

export default function ArenaScene({ running, still, lite }: StageInfo) {
  const battle = useMemo<Battle>(() => ({ strikes: [], waves: [] }), []);

  return (
    <Canvas
      frameloop={still ? "demand" : running ? "always" : "never"}
      dpr={lite ? 1 : [1, 1.5]}
      camera={{ fov: 36, position: [5, 5, 13] }}
      gl={{ alpha: true, antialias: !lite, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Rig battle={battle} still={still} />
      <ambientLight intensity={0.45} color="#ffb0a0" />
      <directionalLight position={[-5, 9, 6]} intensity={2.4} color="#ffd6cc" />
      <pointLight position={[0, CORE_Y, 0]} intensity={70} distance={13} color="#e10600" />
      <Terrain battle={battle} rings={lite ? 6 : 8} />
      <Towers />
      <Core battle={battle} />
      <Beams battle={battle} />
      <Embers count={lite ? 40 : 110} />
      {!lite && (
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.9} luminanceSmoothing={0.2} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
