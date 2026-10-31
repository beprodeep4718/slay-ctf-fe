"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import type { StageInfo } from "./Stage";
import { STRIKE_EVENT, story } from "./story";

const SIZE = 0.6;
const CORE_Y = 3.35;
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
  const caps = useRef<THREE.InstancedMesh>(null);
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
      deck: new THREE.Color("#3a1416"),
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

      // Inset deck plate on each tile; every third one carries a lit circuit.
      const lit = i % 3 === 0 ? 0.35 + Math.sin(t * 1.2 + i) * 0.2 : 0;
      scratch.matrix.position.y = height - 0.39;
      scratch.matrix.scale.set(fade * 0.72, 0.03, fade * 0.72);
      scratch.matrix.updateMatrix();
      caps.current?.setMatrixAt(i, scratch.matrix.matrix);
      caps.current?.setColorAt(i, scratch.color.copy(scratch.deck).lerp(scratch.hot, Math.max(glow, lit)));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    if (caps.current) {
      caps.current.instanceMatrix.needsUpdate = true;
      if (caps.current.instanceColor) caps.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group key={tiles.length}>
      <instancedMesh ref={mesh} args={[undefined, undefined, tiles.length]} frustumCulled={false}>
        <cylinderGeometry args={[SIZE * 0.95, SIZE * 0.95, 1, 6]} />
        <meshStandardMaterial flatShading metalness={0.15} roughness={0.5} />
      </instancedMesh>
      <instancedMesh ref={caps} args={[undefined, undefined, tiles.length]} frustumCulled={false}>
        <cylinderGeometry args={[SIZE * 0.95, SIZE * 0.95, 1, 6]} />
        <meshStandardMaterial flatShading metalness={0.3} roughness={0.35} />
      </instancedMesh>
    </group>
  );
}

const HULL = { color: "#3d1416", metalness: 0.45, roughness: 0.42, flatShading: true };
const GLOW: [number, number, number] = [5, 0.4, 0.25];

function Towers() {
  return towers.map((tower, i) => (
    <group key={i} position={[tower.x, 0, tower.z]} rotation={[0, Math.atan2(-tower.x, -tower.z), 0]}>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.32, 0.46, 0.5, 6]} />
        <meshStandardMaterial {...HULL} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.13, 0.2, 0.7, 6]} />
        <meshStandardMaterial {...HULL} />
      </mesh>
      {[1.22, 1.5].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.012, 6, 24]} />
          <meshBasicMaterial color={GLOW} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 1.84, -0.04]}>
        <boxGeometry args={[0.34, 0.2, 0.46]} />
        <meshStandardMaterial {...HULL} />
      </mesh>
      {[-0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, 1.86, 0.34]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.46, 6]} />
          <meshStandardMaterial {...HULL} />
        </mesh>
      ))}
      <mesh position={[0, TOWER_TOP, 0]}>
        <octahedronGeometry args={[0.07]} />
        <meshBasicMaterial color={GLOW} toneMapped={false} />
      </mesh>
    </group>
  ));
}

function Socket() {
  return (
    <group position={[0, 1.02, 0]}>
      <mesh>
        <cylinderGeometry args={[1.5, 1.62, 0.4, 6]} />
        <meshStandardMaterial {...HULL} />
      </mesh>
      {[0.55, 1.05, 1.42].map((radius) => (
        <mesh key={radius} position={[0, 0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.014, 6, 64]} />
          <meshBasicMaterial color={GLOW} toneMapped={false} />
        </mesh>
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * Math.PI) / 3;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.2, 0.5, Math.sin(angle) * 1.2]}
            rotation={[0, -angle, -0.35]}
          >
            <boxGeometry args={[0.12, 0.8, 0.2]} />
            <meshStandardMaterial {...HULL} />
          </mesh>
        );
      })}
    </group>
  );
}

// A closed cross-section, so each lathe sweep becomes a thick armour plate.
function plateGeometry(outer: [number, number][]) {
  const inner = [...outer].reverse().map(([r, y]) => new THREE.Vector2(Math.max(r - 0.14, 0.02), y));
  const points = [...outer.map(([r, y]) => new THREE.Vector2(r, y)), ...inner];
  points.push(points[0].clone());
  return new THREE.LatheGeometry(points, 3, -Math.PI / 8 + 0.05, Math.PI / 4 - 0.1);
}

function Ring({ radius, tilt, speed }: { radius: number; tilt: [number, number, number]; speed: number }) {
  const group = useRef<THREE.Group>(null);
  const ticks = useRef<THREE.InstancedMesh>(null);
  const COUNT = 48;

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2;
      dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      dummy.rotation.z = angle;
      dummy.scale.set(i % 6 === 0 ? 2.4 : 1, 1, 1);
      dummy.updateMatrix();
      ticks.current?.setMatrixAt(i, dummy.matrix);
    }
    if (ticks.current) ticks.current.instanceMatrix.needsUpdate = true;
  }, [radius]);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.z += dt * speed;
  });

  return (
    <group rotation={tilt}>
      <group ref={group}>
        <mesh>
          <torusGeometry args={[radius, 0.018, 6, 128, Math.PI * 1.7]} />
          <meshBasicMaterial color={[3, 0.3, 0.2]} toneMapped={false} />
        </mesh>
        <mesh>
          <torusGeometry args={[radius - 0.09, 0.006, 4, 128]} />
          <meshBasicMaterial color={[1.4, 0.16, 0.12]} toneMapped={false} />
        </mesh>
        <instancedMesh ref={ticks} args={[undefined, undefined, COUNT]} frustumCulled={false}>
          <boxGeometry args={[0.09, 0.03, 0.03]} />
          <meshBasicMaterial color={[3, 0.3, 0.2]} toneMapped={false} />
        </instancedMesh>
      </group>
    </group>
  );
}

function Debris({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const r = 1.9 + THREE.MathUtils.seededRandom(i + 7) * 2.3;
      const angle = THREE.MathUtils.seededRandom(i + 70) * Math.PI * 2 + t * (0.5 / r);
      dummy.position.set(
        Math.cos(angle) * r,
        (THREE.MathUtils.seededRandom(i + 170) - 0.5) * 3.4 + Math.sin(t + i) * 0.08,
        Math.sin(angle) * r,
      );
      dummy.rotation.set(t * 0.6 + i, t * 0.4 + i, 0);
      dummy.scale.setScalar(0.03 + THREE.MathUtils.seededRandom(i + 270) * 0.1);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <tetrahedronGeometry args={[1]} />
      <meshStandardMaterial flatShading color="#c4241c" metalness={0.4} roughness={0.35} />
    </instancedMesh>
  );
}

function Core({ battle }: { battle: Battle }) {
  const armour = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Mesh>(null);
  const plate = useRef<THREE.MeshStandardMaterial>(null);
  const open = useRef(0);
  const upper = useMemo(
    () => plateGeometry([[0.98, 0.34], [1.08, 0.6], [0.66, 1.5], [0.08, 2.4]]),
    [],
  );
  const lower = useMemo(
    () => plateGeometry([[0.08, -1.95], [0.62, -1.05], [1.08, -0.34], [0.98, -0.08]]),
    [],
  );

  useFrame((_, dt) => {
    open.current += ((battle.strikes.length ? 1 : 0) - open.current) * 0.12;
    if (armour.current) {
      armour.current.rotation.y += dt * 0.35;
      const spread = 1 + open.current * 0.2;
      armour.current.scale.set(spread, 1 + open.current * 0.06, spread);
    }
    if (heart.current) {
      heart.current.rotation.y -= dt * 1.4;
      heart.current.rotation.x += dt * 0.7;
      heart.current.scale.setScalar(1 + open.current * 0.3);
    }
    if (plate.current) plate.current.emissiveIntensity = 0.28 + open.current * 1.6;
  });

  return (
    <group position={[0, CORE_Y, 0]}>
      <mesh ref={heart} position={[0, 0.13, 0]}>
        <icosahedronGeometry args={[0.56, 1]} />
        <meshBasicMaterial color={[2.6, 0.16, 0.08]} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
        <meshBasicMaterial color={[5, 0.4, 0.25]} toneMapped={false} />
      </mesh>
      <group ref={armour}>
        {Array.from({ length: 8 }, (_, i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
            <mesh geometry={upper}>
              <meshStandardMaterial
                ref={i === 0 ? plate : undefined}
                flatShading
                side={THREE.DoubleSide}
                color="#c8180f"
                emissive="#e10600"
                emissiveIntensity={0.28}
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
            <mesh geometry={lower}>
              <meshStandardMaterial
                flatShading
                side={THREE.DoubleSide}
                color="#8f1410"
                emissive="#e10600"
                emissiveIntensity={0.2}
                metalness={0.4}
                roughness={0.34}
              />
            </mesh>
          </group>
        ))}
      </group>
      <Ring radius={2.2} tilt={[1.2, 0.2, 0]} speed={0.9} />
      <Ring radius={2.7} tilt={[-0.5, 1.1, 0]} speed={-0.6} />
      <Ring radius={3.3} tilt={[0.7, -0.8, 0]} speed={0.4} />
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

function Rig({ battle, still, dive }: { battle: Battle; still: boolean; dive: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  const closeIn = useRef(0);
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
    const strike = (e: Event) => {
      for (let i = 0; i < (e as CustomEvent<number>).detail; i++) fire(battle);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener(STRIKE_EVENT, strike);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener(STRIKE_EVENT, strike);
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
    // Scrolling the hero pushes the camera in on the core.
    closeIn.current += ((dive ? story.dive : 0) - closeIn.current) * 0.12;
    const lerp = THREE.MathUtils.lerp;
    const distance = lerp(portrait ? 25 : 14, portrait ? 15 : 6.8, closeIn.current);
    const rise = lerp(height.current, CORE_Y + 0.4, closeIn.current);
    camera.position.set(Math.sin(yaw.current) * distance, rise, Math.cos(yaw.current) * distance);
    camera.lookAt(0, lerp(portrait ? -2.2 : 2.6, CORE_Y, closeIn.current), 0);

    advance(battle, dt);
  });

  return null;
}

export default function ArenaScene({ running, still, lite, dive }: StageInfo & { dive: boolean }) {
  const battle = useMemo<Battle>(() => ({ strikes: [], waves: [] }), []);

  return (
    <Canvas
      frameloop={still ? "demand" : running ? "always" : "never"}
      dpr={lite ? 1 : [1, 1.5]}
      camera={{ fov: 36, position: [5, 5, 13] }}
      gl={{ alpha: true, antialias: !lite, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Rig battle={battle} still={still} dive={dive} />
      <ambientLight intensity={0.45} color="#ffb0a0" />
      <directionalLight position={[-5, 9, 6]} intensity={2.4} color="#ffd6cc" />
      <directionalLight position={[6, 4, -8]} intensity={2.2} color="#ff4b3e" />
      <pointLight position={[0, CORE_Y, 0]} intensity={70} distance={13} color="#e10600" />
      <Terrain battle={battle} rings={lite ? 6 : 8} />
      <Towers />
      <Socket />
      <Core battle={battle} />
      <Debris count={lite ? 36 : 90} />
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
