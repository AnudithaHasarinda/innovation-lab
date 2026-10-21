"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";

/** A template re-mounts on every navigation, which gives each page a smooth entrance transition. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
