import React from "react";
import mockLeadsData from "../../mockLeads.json";

interface Thread {
    id: string;
    patientName: string;
    lastMessage: string;
    timestamp: string;
    unread?: boolean;
}

export default function InboxView() {
    // Map the JSON data into inbox thread formats, generating synthetic timestamps
    const threads: Thread[] = mockLeadsData.map((lead, index) => {
        let timestamp = "Just now";
        if (index > 0 && index <= 3) timestamp = `${index * 15}m ago`;
        else if (index > 3 && index <= 7) timestamp = `${index - 2}h ago`;
        else if (index > 7) timestamp = "Yesterday";

        return {
            id: lead.id,
            patientName: lead.name,
            lastMessage: lead.inquiry,
            timestamp,
            unread: index < 4 // Top 4 are unread
        };
    });

    return (
        <div className="w-full max-w-md mx-auto h-full flex flex-col pt-2">
            <div className="px-2 mb-6 text-center">
                <h2 className="text-2xl font-heading font-semibold text-foreground tracking-tight">
                    Messages
                </h2>
                <p className="text-muted-foreground mt-1 text-sm max-w-sm mx-auto">
                    Recent patient conversations and inquiries.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto w-full bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm mb-4">
                {threads.map((thread) => (
                    <div
                        key={thread.id}
                        className={`flex items-start gap-4 p-4 border-b border-border/40 last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${thread.unread ? "bg-primary/5" : ""
                            }`}
                    >
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${thread.unread ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>
                            {thread.patientName.split(" ").map((n) => n[0]).join("")}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className={`text-base truncate ${thread.unread ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>
                                    {thread.patientName}
                                </h4>
                                <span className={`text-[11px] whitespace-nowrap ml-2 ${thread.unread ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                                    {thread.timestamp}
                                </span>
                            </div>
                            <p className={`text-sm line-clamp-2 leading-snug ${thread.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                {thread.lastMessage}
                            </p>
                        </div>

                        {/* Unread Indicator */}
                        {thread.unread && (
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
