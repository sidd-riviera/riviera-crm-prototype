"use client";

import { useState } from "react";
import WelcomeGate from "@/components/WelcomeGate";
import DesktopWorkspace from "@/components/DesktopWorkspace";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <main className="min-h-[100dvh] bg-background">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <WelcomeGate key="welcome" onComplete={() => setShowWelcome(false)} />
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <DesktopWorkspace />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
