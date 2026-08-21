import React from 'react';
import { Search, ShoppingCart, Store, Sparkles } from 'lucide-react';
import PriceCheck from './Product/PriceCheck';
import Sell from './Product/Sell';

const MainDashboard = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
            {/* Background Ambient Glows */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.15),_transparent_40%)]" />
                <div className="absolute -top-40 right-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

                <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
                    
                    {/* Brand Header */}
                    <header className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20">
                                <Store size={20} strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-200">
                                Maruf Gadget <span className="text-cyan-400 font-medium">& Accessories</span>
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                            System Online
                        </div>
                    </header>

                    <div className="w-full flex-1 space-y-8">
                        {/* Enhanced Hero / Title Section */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl ring-1 ring-white/5 backdrop-blur-3xl sm:p-10 lg:p-12">
                            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                                
                                {/* Left Content */}
                                <div className="max-w-2xl space-y-5">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-sm transition-colors hover:bg-cyan-500/20">
                                        <Sparkles size={14} />
                                        <span>Workspace Manager</span>
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 pb-2">
                                            Manage your store with precision.
                                        </h1>
                                        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
                                            Check product prices instantly and process sales seamlessly. A unified dashboard built specifically for speed and clarity.
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side - Module Status Cards */}
                                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col shrink-0 lg:w-72">
                                    <div className="group flex flex-1 items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] cursor-default">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:bg-cyan-500/25">
                                            <Search size={22} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/70">Module 1</p>
                                            <p className="mt-0.5 text-lg font-semibold text-slate-200">Price Check</p>
                                        </div>
                                    </div>

                                    <div className="group flex flex-1 items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] cursor-default">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-500/25">
                                            <ShoppingCart size={22} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/70">Module 2</p>
                                            <p className="mt-0.5 text-lg font-semibold text-slate-200">Quick Sell</p>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>

                        {/* Feature Components Grid */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <PriceCheck />
                            <Sell />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;