"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mockLeadsData from "../../mockLeads.json";

interface WelcomeGateProps {
    onComplete: () => void;
}

export default function WelcomeGate({ onComplete }: WelcomeGateProps) {
    const [isExiting, setIsExiting] = useState(false);
    const leadsCount = mockLeadsData.length;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && !isExiting) {
                setIsExiting(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isExiting]);

    useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(() => {
                onComplete();
            }, 800); // Wait for fade out
            return () => clearTimeout(timer);
        }
    }, [isExiting, onComplete]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    key="welcome-gate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-50 overflow-hidden"
                >
                    {/* Centered content with Anthropic-style typography */}
                    <div className="flex flex-col items-center justify-center px-6 max-w-2xl text-center space-y-10">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                            className="text-4xl md:text-5xl lg:text-5xl font-serif text-stone-800 tracking-tight leading-snug font-medium"
                        >
                            Good afternoon, Sidd.
                            <br />
                            <span className="text-stone-600">
                                There are {leadsCount} leads requiring your attention.
                            </span>
                        </motion.h1>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                        >
                            <button
                                onClick={() => setIsExiting(true)}
                                className="group relative flex items-center justify-center gap-2 px-8 py-3 bg-stone-900 text-stone-50 rounded-full font-serif text-lg tracking-wide hover:bg-stone-800 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
                            >
                                <span>Begin Triage</span>
                                <span className="opacity-60 text-sm font-sans tracking-wide uppercase px-2 py-0.5 rounded border border-stone-600/50 bg-stone-800/50 ml-2">
                                    Enter
                                </span>
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
