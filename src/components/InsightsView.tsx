import React from "react";
import { Users, Clock, CircleDollarSign } from "lucide-react";

export default function InsightsView() {
    return (
        <div className="w-full max-w-md mx-auto h-full flex flex-col pt-2 pb-8 overflow-y-auto">
            <div className="px-2 mb-6 text-center">
                <h2 className="text-2xl font-heading font-semibold text-foreground tracking-tight">
                    Practice Insights
                </h2>
                <p className="text-muted-foreground mt-1 text-sm max-w-sm mx-auto">
                    Performance and lead behavior overview.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {/* KPI Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Pipeline Value</p>
                            <h3 className="text-3xl font-heading font-bold text-foreground tracking-tight">
                                $245,000
                            </h3>
                            <p className="text-[11px] text-emerald-500 font-medium mt-1 inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 7L13.5 15.5L8.5 10.5L2 17" />
                                    <path d="M16 7H22V13" />
                                </svg>
                                +12% vs last month
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex flex-col items-center justify-center">
                            <CircleDollarSign strokeWidth={2} className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between aspect-square">
                        <div className="w-8 h-8 rounded-full bg-foreground/5 text-muted-foreground flex items-center justify-center mb-4">
                            <Users strokeWidth={2} className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Patient Volume</p>
                            <h3 className="text-2xl font-heading font-bold text-foreground">142</h3>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Active Leads</p>
                        </div>
                    </div>

                    <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-5 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden">
                        {/* Soft decorative glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full"></div>

                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 relative z-10">
                            <Clock strokeWidth={2} className="w-4 h-4" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">Response Time</p>
                            <h3 className="text-2xl font-heading font-bold text-emerald-700 dark:text-emerald-300">14m</h3>
                            <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Optimal SLA
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lead Sentiment Visual Chart */}
                <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-5 shadow-sm mt-2">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Lead Sentiment</h3>
                            <p className="text-xs text-muted-foreground">Volume mapped by intent dimension</p>
                        </div>
                    </div>

                    {/* Stacked Bar Chart */}
                    <div className="h-6 w-full rounded-full flex overflow-hidden bg-muted mb-6 shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: "45%" }}
                            title="Trust & Authority (45%)"
                        ></div>
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 border-l border-white/20"
                            style={{ width: "30%" }}
                            title="Value Position (30%)"
                        ></div>
                        <div
                            className="h-full bg-gradient-to-r from-rose-500 to-orange-500 border-l border-white/20"
                            style={{ width: "25%" }}
                            title="Patient Outcome (25%)"
                        ></div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-sm shadow-purple-500/40"></div>
                                <span className="font-medium text-foreground/90">Trust & Authority</span>
                            </div>
                            <span className="font-semibold text-foreground">45%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shadow-sm shadow-blue-500/40"></div>
                                <span className="font-medium text-foreground/90">Value Position</span>
                            </div>
                            <span className="font-semibold text-foreground">30%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 shadow-sm shadow-orange-500/40"></div>
                                <span className="font-medium text-foreground/90">Patient Outcome</span>
                            </div>
                            <span className="font-semibold text-foreground">25%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
