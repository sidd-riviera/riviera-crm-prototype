"use client";

import React, { useState } from "react";
import LeadCard, { Lead } from "./LeadCard";
import { AnimatePresence } from "framer-motion";

const initialLeads: Lead[] = [
    {
        id: "L-101",
        name: "Sarah Jenkins",
        inquiry: "Swelling post-op day 3, throbbing pain replacing previous dull ache.",
        specialty: "Plastic Surgery",
        urgency: "Urgent",
    },
    {
        id: "L-102",
        name: "Michael Chen",
        inquiry: "Cost of full implants and availability for initial consultation next month.",
        specialty: "Natural Dentistry",
        urgency: "Routine",
    },
    {
        id: "L-103",
        name: "Elena Rodriguez",
        inquiry: "Sudden bleeding from extraction site 48h after wisdom teeth removal.",
        specialty: "Natural Dentistry",
        urgency: "Urgent",
    },
    {
        id: "L-104",
        name: "David Thompson",
        inquiry: "Interested in non-surgical rhinoplasty options and pricing.",
        specialty: "Plastic Surgery",
        urgency: "Routine",
    },
    {
        id: "L-105",
        name: "Jessica Williams",
        inquiry: "Severe redness and heat around the incision site from yesterday.",
        specialty: "Plastic Surgery",
        urgency: "Urgent",
    }
];

export default function CRMStack() {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);

    const handleRemove = (id: string) => {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto py-12 px-4 relative min-h-[600px]">
            <div className="mb-12 text-center z-10">
                <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-2">
                    Patient Leads
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                    {leads.length} in pipeline
                </p>
            </div>

            <div className="relative w-80 h-96 flex justify-center perspective-1000">
                <AnimatePresence>
                    {leads.map((lead, index) => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            index={index}
                            isFront={index === 0}
                            onApprove={() => handleRemove(lead.id)}
                            onArchive={() => handleRemove(lead.id)}
                        />
                    ))}
                </AnimatePresence>

                {leads.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">All Caught Up!</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">No more leads to process today.</p>
                        <button
                            onClick={() => setLeads(initialLeads)}
                            className="mt-6 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Reset Leads
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
