"use client";

import { useState, useEffect } from "react";
import LeadCard, { Lead } from "@/components/LeadCard";
import RivieraLogo from "@/components/RivieraLogo";
import InboxView from "@/components/InboxView";
import InsightsTab from "@/components/InsightsTab";
import { Inbox, Layers, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import mockLeadsData from "../../mockLeads.json";

export default function Home() {
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
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 pl-5 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
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
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden pb-24">
        {/* Decorative subtle visual elements */}
        {activeTab === "Action Deck" && (
          <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
            <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] -top-[10%] -right-[10%]"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] -bottom-[10%] -left-[10%]"></div>
          </div>
        )}

        {/* Tab Router Content */}
        {activeTab === "Action Deck" && (
          <div className="flex flex-col items-center w-full z-10 h-full justify-center">

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

            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 w-full max-w-5xl mx-auto px-4">

              {/* Left: Card Stack Container */}
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
                  <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl w-full p-8 shadow-sm">
                    <Inbox className="w-12 h-12 mb-4 opacity-40 text-primary mx-auto" strokeWidth={1.5} />
                    <p className="font-heading font-medium text-lg text-foreground">Inbox Zero</p>
                    <p className="text-sm mt-1">All patient inquiries reviewed.</p>
                  </div>
                )}
              </div>

              {/* Right: Desktop Split-Pane AI Review Panel */}
              <AnimatePresence>
                {activeReviewLeadId && reviewingLead && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.2 } }}
                    className="hidden md:flex flex-col w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl h-[420px]"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Auto-Draft</span>

                      {reviewingLead.dimension && (
                        <span className="ml-auto px-2 py-0.5 rounded text-[9px] uppercase font-bold text-foreground/60 bg-foreground/5 border border-border/50">
                          {reviewingLead.dimension}
                        </span>
                      )}
                    </div>

                    <textarea
                      key={reviewingLead.id} // force re-render on new lead
                      className="flex-1 w-full bg-background/50 border border-border/50 rounded-xl p-4 text-[15px] leading-relaxed resize-none focus:outline-none focus:ring-2 ring-primary/20 text-foreground"
                      defaultValue={reviewingLead.autoDraftReply}
                    />

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setCardAction({ id: reviewingLead.id, action: "cancel" })}
                        className="px-4 py-3 rounded-xl border border-border/50 bg-card hover:bg-muted text-sm font-semibold text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setCardAction({ id: reviewingLead.id, action: "approve" })}
                        className="flex-1 px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-colors shadow-md shadow-primary/20 flex justify-center items-center gap-2"
                      >
                        Approve & Send
                        <kbd className="opacity-50 text-[10px] font-sans ml-2">Enter</kbd>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        )}

        {activeTab === "Inbox" && <InboxView />}
        {activeTab === "Insights" && <InsightsTab />}

      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/90 backdrop-blur-xl z-50 pb-safe">
        <nav className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
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
  );
}
