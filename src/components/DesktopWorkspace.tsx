"use client";

import { useState, useEffect } from "react";
import LeadCard, { Lead } from "@/components/LeadCard";
import RivieraLogo from "@/components/RivieraLogo";
import InboxView from "@/components/InboxView";
import InsightsTab from "@/components/InsightsTab";
import { Inbox, Layers, LayoutDashboard, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import mockLeadsData from "../../mockLeads.json";

export default function DesktopWorkspace() {
    const [activeTab, setActiveTab] = useState("Action Deck");
    const [leads, setLeads] = useState<Lead[]>(mockLeadsData as Lead[]);
    const [activeReviewLeadId, setActiveReviewLeadId] = useState<string | null>(null);
    const [cardAction, setCardAction] = useState<{ id: string; action: "archive" | "approve" | "review" | "cancel" } | null>(null);

    const handleApprove = (id: string, name: string) => {
        console.log(`Approved ${name}`);
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        setActiveReviewLeadId(null);
    };

    const handleArchive = (id: string, name: string) => {
        console.log(`Archived ${name}`);
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        setActiveReviewLeadId(null);
    };

    const handleReviewChange = (id: string, active: boolean) => {
        setActiveReviewLeadId(active ? id : null);
    };

    // Global Keyboard listener for lightning triage
    useEffect(() => {
        if (leads.length === 0 || activeTab !== "Action Deck") return;

        const topLead = leads[0];

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in the textarea
            if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

            if (e.key === "ArrowRight") {
                if (activeReviewLeadId !== topLead.id) {
                    setCardAction({ id: topLead.id, action: "review" });
                }
            } else if (e.key === "ArrowLeft") {
                if (activeReviewLeadId !== topLead.id) {
                    setCardAction({ id: topLead.id, action: "archive" });
                }
            } else if (e.key === "Enter") {
                if (activeReviewLeadId === topLead.id) {
                    setCardAction({ id: topLead.id, action: "approve" });
                }
            } else if (e.key === "Escape") {
                if (activeReviewLeadId === topLead.id) {
                    setCardAction({ id: topLead.id, action: "cancel" });
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [leads, activeTab, activeReviewLeadId]);

    const reviewingLead = leads.find(l => l.id === activeReviewLeadId);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] h-[100dvh] overflow-hidden font-sans selection:bg-primary/20 text-foreground bg-gray-50">

            {/* Left Column (60%) */}
            <div className="flex flex-col relative h-full overflow-hidden bg-gray-50 lg:border-r-0 border-r border-border/40 pb-20 lg:pb-0">
                {/* Top Header */}
                <header className="flex items-center justify-between px-6 pl-5 py-4 border-b border-gray-200 bg-gray-50/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-3">
                        <RivieraLogo className="w-8 h-8 text-primary" />
                        <div className="flex flex-col">
                            <h1 className="text-xl font-heading font-semibold tracking-tight text-foreground leading-none">
                                Riviera OS
                            </h1>
                            <p className="text-xs text-muted-foreground font-medium mt-1">Origins Plastic Surgery</p>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 relative overflow-y-auto">
                    {/* Decorative subtle visual elements */}
                    {activeTab === "Action Deck" && (
                        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
                            <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] -top-[10%] -right-[10%]"></div>
                            <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] -bottom-[10%] -left-[10%]"></div>
                        </div>
                    )}

                    {/* Tab Router Content */}
                    {activeTab === "Action Deck" && (
                        <div className="flex flex-col items-center w-full z-10 h-full justify-center lg:items-center">

                            <div className="text-center mb-8 md:mb-12">
                                <h2 className="text-2xl font-heading font-semibold text-foreground tracking-tight">
                                    Action Deck
                                </h2>
                                <p className="text-muted-foreground mt-1 text-sm max-w-sm mx-auto">
                                    Swipe right to approve, left to archive.
                                </p>
                                <div className="hidden md:flex items-center justify-center gap-4 mt-3 text-[11px] font-medium text-muted-foreground/70">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded border border-border/50 bg-background shadow-sm text-[10px] font-sans">←</kbd> Archive
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded border border-border/50 bg-background shadow-sm text-[10px] font-sans">→</kbd> Draft
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded border border-border/50 bg-background shadow-sm text-[10px] font-sans">Enter</kbd> Send
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-3xl mx-auto px-4">
                                {/* Left (or Center): Card Stack Container */}
                                <div className="relative w-full max-w-sm aspect-[4/5] h-[420px] flex items-center justify-center shrink-0">
                                    <AnimatePresence>
                                        {leads.slice(0, 4).reverse().map((lead) => {
                                            const index = leads.indexOf(lead);
                                            return (
                                                <LeadCard
                                                    key={lead.id}
                                                    lead={lead}
                                                    index={index}
                                                    isFront={index === 0}
                                                    onApprove={() => handleApprove(lead.id, lead.name)}
                                                    onArchive={() => handleArchive(lead.id, lead.name)}
                                                    onReviewChange={handleReviewChange}
                                                    cardAction={cardAction}
                                                />
                                            );
                                        })}
                                    </AnimatePresence>

                                    {leads.length === 0 && (
                                        <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl w-full p-8 shadow-sm relative z-0">
                                            <Inbox className="w-12 h-12 mb-4 opacity-40 text-primary mx-auto" strokeWidth={1.5} />
                                            <p className="font-heading font-medium text-lg text-foreground">Inbox Zero</p>
                                            <p className="text-sm mt-1">All patient inquiries reviewed.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Inbox" && <div className="w-full max-w-3xl mx-auto"><InboxView /></div>}
                    {activeTab === "Insights" && <div className="w-full max-w-4xl mx-auto"><InsightsTab /></div>}

                </main>

                {/* Bottom Navigation */}
                <footer className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50/90 backdrop-blur-xl z-50 pb-safe/4 lg:pb-0">
                    <nav className="flex items-center justify-around px-2 py-3 max-w-sm mx-auto">
                        {[
                            { id: "Action Deck", icon: Layers, label: "Action Deck" },
                            { id: "Inbox", icon: Inbox, label: "Inbox" },
                            { id: "Insights", icon: LayoutDashboard, label: "Insights" },
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-center justify-center w-20 gap-1.5 transition-all duration-200 ${isActive
                                        ? "text-primary scale-100"
                                        : "text-muted-foreground hover:text-foreground active:scale-95"
                                        }`}
                                >
                                    <div className={`relative flex items-center justify-center ${isActive ? 'bg-primary/10 w-12 h-8 rounded-full' : ''}`}>
                                        <tab.icon
                                            className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-medium tracking-wide ${isActive ? "font-semibold" : ""}`}>
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </footer>
            </div>

            {/* Right Column (40%) - Riviera Assistant */}
            <aside className="hidden lg:flex flex-col bg-white border-l border-gray-200 h-full relative z-20">
                {/* Assistant Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <RivieraLogo className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight text-gray-800">Riviera Assistant</span>
                </div>

                {/* Assistant Chat Area / AI Review Split-Pane content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">

                    <AnimatePresence mode="popLayout">
                        {leads.length > 0 && activeTab === "Action Deck" ? (() => {
                            const topLead = leads[0];
                            const getTopicSnippet = (inquiry: string) => {
                                const words = inquiry.split(" ").slice(0, 10).join(" ");
                                return words.length < inquiry.length ? `${words}...` : words;
                            };

                            return (
                                <motion.div
                                    key={topLead.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.2 } }}
                                    className="flex flex-col w-full gap-4"
                                >
                                    {/* System Message Chat Bubble */}
                                    <div className="flex gap-3 max-w-[90%]">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                            <RivieraLogo className="w-3 h-3 text-primary" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-xs font-semibold text-gray-700">Riviera Assistant</span>
                                            <div className="bg-gray-100 text-gray-800 text-sm px-4 py-3 rounded-2xl rounded-tl-sm leading-relaxed">
                                                I see <span className="font-semibold">{topLead.name}</span> is asking about {topLead.dimension ? topLead.dimension.toLowerCase() : "their inquiry"}. I have drafted a clinical response for you. Would you like me to send it, or should we modify it to sound more casual?
                                            </div>
                                        </div>
                                    </div>

                                    {/* Draft Proposal Box */}
                                    <div className="ml-9 mr-4 mt-2">
                                        <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                            <div className="flex items-center justify-between bg-gray-50/80 px-4 py-2 border-b border-gray-100">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                                    Draft Proposal
                                                </span>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    {topLead.autoDraftReply}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="p-3 bg-gray-50/50 border-t border-gray-50 flex gap-2">
                                                <button
                                                    onClick={() => setCardAction({ id: topLead.id, action: "review" })}
                                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-sm"
                                                >
                                                    Edit Draft
                                                </button>
                                                <button
                                                    onClick={() => setCardAction({ id: topLead.id, action: "approve" })}
                                                    className="flex-1 px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold transition-colors shadow-sm flex justify-center items-center gap-2"
                                                >
                                                    Approve & Send
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })() : (
                            <motion.div
                                key="empty-state"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex-1 flex flex-col items-center justify-center text-center opacity-60 mt-12"
                            >
                                <RivieraLogo className="w-12 h-12 text-gray-300 mb-4" />
                                <p className="text-sm font-medium text-gray-500 max-w-[250px]">
                                    How can I assist you with your leads today?
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

                {/* Fixed Chat Input */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <div className="relative group">
                        <textarea
                            placeholder="Ask Riviera AI to modify drafts, pull patient history, or summarize..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-4 pr-12 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/20 focus:bg-white focus:border-gray-300 transition-colors text-gray-800"
                            rows={2}
                        />
                        <button className="absolute right-3 bottom-3 p-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-gray-400 font-medium">Riviera Assistant can make mistakes. Verify important medical details.</p>
                    </div>
                </div>
            </aside>

        </div>
    );
}
