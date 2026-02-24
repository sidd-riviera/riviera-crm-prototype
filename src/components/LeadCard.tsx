"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";

export interface Lead {
    id: string;
    name: string;
    inquiry: string;
    dimension?: "Patient Outcome" | "Trust & Authority" | "Value Position" | string;
    gradient?: string;
    autoDraftReply?: string;
    specialty?: string;
    urgency?: string;
}

interface LeadCardProps {
    lead: Lead;
    index: number;
    onApprove?: () => void;
    onArchive?: () => void;
    onReviewChange?: (id: string, active: boolean) => void;
    cardAction?: { id: string; action: "archive" | "approve" | "review" | "cancel" } | null;
    isFront: boolean;
}

export default function LeadCard({
    lead,
    index,
    onApprove,
    onArchive,
    onReviewChange,
    cardAction,
    isFront
}: LeadCardProps) {
    const controls = useAnimation();
    const [reviewMode, setReviewMode] = useState(false);

    // Sync external keyboard actions from page.tsx
    useEffect(() => {
        if (!isFront || cardAction?.id !== lead.id) return;

        switch (cardAction.action) {
            case "review":
                if (!reviewMode) {
                    controls.start({ x: 0, y: 0, scale: 1 }).then(() => {
                        setReviewMode(true);
                        onReviewChange?.(lead.id, true);
                    });
                }
                break;
            case "archive":
                controls.start({ x: 0, y: -200, opacity: 0, scale: 0.9, transition: { duration: 0.4, ease: "easeOut" } }).then(() => {
                    onArchive?.();
                });
                break;
            case "approve":
                controls.start({ x: 200, y: -50, opacity: 0, scale: 0.9, transition: { duration: 0.4, ease: "easeOut" } }).then(() => {
                    onApprove?.();
                    onReviewChange?.(lead.id, false);
                });
                break;
            case "cancel":
                if (reviewMode) {
                    setReviewMode(false);
                    onReviewChange?.(lead.id, false);
                }
                break;
        }
    }, [cardAction, lead.id, isFront, controls, reviewMode, onArchive, onApprove, onReviewChange]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (!isFront) return;

        if (info.offset.x > 120) {
            // Dragged right: Flip into Auto-Draft review state
            controls.start({ x: 0, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } }).then(() => {
                setReviewMode(true);
                onReviewChange?.(lead.id, true);
            });
        } else if (info.offset.x < -120) {
            // Dragged left: Archive (float upward)
            controls.start({ x: 0, y: -200, opacity: 0, scale: 0.9, transition: { duration: 0.4, ease: "easeOut" } }).then(() => {
                onArchive?.();
            });
        } else {
            // Snap back if not dragged far enough
            controls.start({ x: 0, y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 15 } });
        }
    };

    const handleCancel = () => {
        setReviewMode(false);
        onReviewChange?.(lead.id, false);
    };

    const handleFinalApprove = () => {
        controls.start({ x: 200, y: -50, opacity: 0, scale: 0.9, transition: { duration: 0.4, ease: "easeOut" } }).then(() => {
            onApprove?.();
            onReviewChange?.(lead.id, false);
        });
    };

    // Default gradient fallback if none provided
    const cardGradient = lead.gradient || "from-slate-100 to-white dark:from-slate-800 dark:to-slate-900";

    return (
        <motion.div
            drag={isFront && !reviewMode ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={false}
            style={{
                zIndex: 100 - index,
                scale: 1 - index * 0.05,
                y: index * 15,
            }}
            whileHover={isFront && !reviewMode ? { scale: 1.02 } : {}}
            whileTap={isFront && !reviewMode ? { scale: 0.98 } : {}}
            className={`absolute w-full max-w-[340px] h-[420px] rounded-2xl bg-gradient-to-br ${cardGradient} border border-border/40 shadow-xl dark:shadow-black/40 ${isFront && !reviewMode ? 'cursor-grab active:cursor-grabbing' : ''} origin-top flex flex-col justify-between overflow-hidden`}
        >
            <div className="w-full h-full p-6 flex flex-col relative z-20 bg-background shadow-inner rounded-xl m-1 absolute inset-1 max-w-[calc(100%-8px)] max-h-[calc(100%-8px)]">

                {/* INQUIRY VIEW (Visible if NOT in reviewMode, OR always visible on desktop sizing) */}
                <div className={`h-full flex-col justify-between ${reviewMode ? 'hidden md:flex' : 'flex'}`}>
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-heading font-semibold text-foreground tracking-tight">
                                {lead.name}
                            </h3>
                            {lead.dimension && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-background bg-foreground/90 backdrop-blur-md">
                                    {lead.dimension}
                                </span>
                            )}
                        </div>

                        <div className="bg-card/80 dark:bg-card/40 backdrop-blur-sm rounded-xl p-5 border border-border/50 shadow-sm mt-4 relative">
                            <div className="absolute -top-3 -left-2 text-4xl text-primary/20 font-serif leading-none">"</div>
                            <p className="text-base text-foreground/90 leading-relaxed font-medium relative z-10">
                                {lead.inquiry}
                            </p>
                        </div>
                    </div>

                    {isFront && (
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest px-2 mt-auto text-muted-foreground/60 pb-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    controls.start({ x: 0, y: -200, opacity: 0, scale: 0.9, transition: { duration: 0.4, ease: "easeOut" } }).then(() => {
                                        onArchive?.();
                                    });
                                }}
                                className="inline-flex flex-col items-center gap-2 hover:text-rose-500 transition-colors cursor-pointer"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500/50">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Archive
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    controls.start({ x: 0, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } }).then(() => {
                                        setReviewMode(true);
                                        onReviewChange?.(lead.id, true);
                                    });
                                }}
                                className="inline-flex flex-col items-center gap-2 hover:text-emerald-500 transition-colors cursor-pointer"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500/50">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                                AI Draft
                            </button>
                        </div>
                    )}
                </div>

                {/* REVIEW VIEW (Visible ONLY when reviewMode is true AND on mobile screens) */}
                {reviewMode && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-full flex-col justify-between flex md:hidden"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Auto-Draft</span>
                            </div>

                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 relative">
                                <p className="text-[15px] text-foreground leading-relaxed font-medium">
                                    {lead.autoDraftReply}
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-3 rounded-xl border border-border/50 bg-card hover:bg-muted text-sm font-semibold text-foreground transition-colors flex-1"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleFinalApprove}
                                className="px-4 py-3 rounded-xl border border-border/50 bg-card hover:bg-muted text-foreground text-sm font-semibold transition-colors flex-[2] shadow-sm"
                            >
                                Approve & Send
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
