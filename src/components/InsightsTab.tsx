"use client";

import React, { useMemo } from "react";
import { Users, Clock, CircleDollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import mockLeadsData from "../../mockLeads.json";

const DIMENSION_COLORS: Record<string, string> = {
    "Patient Outcome": "#ef4444",      // red-500
    "Trust & Authority": "#a855f7",    // purple-500
    "Value Position": "#3b82f6",       // blue-500
    "Routine Scheduling": "#d1d5db",   // gray-300
};

export default function InsightsTab() {
    const activeLeadsCount = mockLeadsData.length;

    const chartData = useMemo(() => {
        const counts: Record<string, number> = {};
        mockLeadsData.forEach((lead) => {
            const dim = lead.dimension || "Unknown";
            counts[dim] = (counts[dim] || 0) + 1;
        });

        return Object.entries(counts).map(([name, value]) => ({
            name,
            value,
        }));
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col pt-4 pb-8 overflow-y-auto">
            <div className="px-4 mb-8 text-center">
                <h2 className="text-3xl font-heading font-semibold text-foreground tracking-tight">
                    Practice Insights
                </h2>
                <p className="text-muted-foreground mt-2 text-sm max-w-sm mx-auto">
                    Performance and lead behavior overview.
                </p>
            </div>

            <div className="flex flex-col gap-6 px-4">
                {/* KPI Grid (3-column) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-full bg-foreground/5 text-muted-foreground flex items-center justify-center mb-4">
                            <Users strokeWidth={2} className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Active Leads</p>
                            <h3 className="text-3xl font-heading font-bold text-foreground">{activeLeadsCount}</h3>
                        </div>
                    </div>

                    <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                        {/* Soft decorative glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full"></div>

                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 relative z-10">
                            <Clock strokeWidth={2} className="w-5 h-5" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">Avg. Response Time</p>
                            <h3 className="text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-300">14 mins</h3>
                        </div>
                    </div>

                    <div className="bg-blue-500/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                        {/* Soft decorative glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>

                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 relative z-10">
                            <CircleDollarSign strokeWidth={2} className="w-5 h-5" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Pipeline Value</p>
                            <h3 className="text-3xl font-heading font-bold text-blue-600 dark:text-blue-400">
                                $185,000
                            </h3>
                        </div>
                    </div>

                </div>

                {/* Lead Sentiment Visual Chart */}
                <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm mt-4">
                    <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Lead Sentiment Breakdown</h3>
                            <p className="text-sm text-muted-foreground mt-1">Volume mapped by intent dimension directly from CRM data.</p>
                        </div>
                    </div>

                    <div className="w-full h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                    animationDuration={800}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={DIMENSION_COLORS[entry.name] || "#cbd5e1"}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number | undefined, name: string) => {
                                        const val = value || 0;
                                        const total = chartData.reduce((sum, item) => sum + item.value, 0);
                                        const percent = total > 0 ? ((val / total) * 100).toFixed(0) : "0";
                                        return [`${val} leads (${percent}%)`, name];
                                    }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'rgba(0,0,0,0.85)',
                                        color: '#fff',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        padding: '12px 16px'
                                    }}
                                    itemStyle={{ color: '#f8fafc', fontWeight: 500 }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={40}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-foreground/80 font-medium ml-2 text-sm">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
