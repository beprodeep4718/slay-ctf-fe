"use client";

import dynamic from "next/dynamic";
import { Stage } from "./Stage";

const ArenaScene = dynamic(() => import("./ArenaScene"), { ssr: false });
const WeaponScene = dynamic(() => import("./WeaponScene"), { ssr: false });

export function Arena({ className, dive = false }: { className?: string; dive?: boolean }) {
  return (
    <Stage
      className={className}
      fallback={<div className="arena-fallback size-full" />}
      render={(info) => <ArenaScene dive={dive} {...info} />}
    />
  );
}

export function Weapon({ shape, className }: { shape: number; className?: string }) {
  return (
    <Stage
      className={className}
      fallback={<div className="arena-fallback size-full" />}
      render={(info) => <WeaponScene shape={shape} {...info} />}
    />
  );
}
