"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

export function Heading({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <header>
      <p className="mb-2 font-mono text-sm text-ember">{"// "}{kicker}</p>
      <h2 className="font-display text-6xl leading-[0.9] font-black uppercase md:text-8xl">{children}</h2>
    </header>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
