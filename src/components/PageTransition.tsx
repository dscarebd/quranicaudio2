import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        style={{ minHeight: "100vh" }}
      >
        {children ?? <Outlet />}
      </motion.div>
    </AnimatePresence>
  );
}
