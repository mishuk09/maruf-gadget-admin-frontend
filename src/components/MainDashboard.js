import React, { useState } from 'react';
import { Search, ShoppingCart, Store, Sparkles } from 'lucide-react';
import PriceCheck from './Product/PriceCheck';
import Sell from './Product/Sell';

const MainDashboard = () => {
    const [activeMobileTab, setActiveMobileTab] = useState('price-check');

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
            {/* Background Ambient Glows */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.15),_transparent_40%)]" />
                <div className="absolute -top-40 right-10 h-96 w-96 rounded-lg bg-cyan-500/10 blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-lg bg-emerald-500/10 blur-[100px] pointer-events-none" />
 
                <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-14 sm:px-6 lg:px-8">
                    
                    

                    <div className="w-full flex-1 space-y-8">
                        {/* Enhanced Hero / Title Section */}
                        <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-6 shadow-2xl ring-1 ring-white/5 backdrop-blur-3xl sm:p-8 lg:p-10">
                            <div className="flex w-full flex-col items-center gap-6 text-center">
                                <div className="w-full max-w-6xl space-y-3">
                                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 pb-1">
                                        Maruf Gadget & Accessories
                                    </h1>
                                    <p className="hidden sm:block mx-auto max-w-5xl text-sm leading-relaxed text-slate-400 sm:text-base lg:text-lg">
                                        Check product prices instantly and process sales seamlessly. A unified dashboard built specifically for speed and clarity.
                                    </p>
                                </div>

                                <div className="flex w-full max-w-3xl flex-col gap-2.5 sm:flex-row sm:gap-3 md:hidden">
                                    <div className="flex rounded-lg border border-white/10 bg-slate-950/50 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setActiveMobileTab('price-check')}
                                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                                                activeMobileTab === 'price-check'
                                                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-950/30'
                                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                            }`}
                                        >
                                            <Search size={16} strokeWidth={1.8} />
                                            Price Check
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveMobileTab('sell')}
                                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                                                activeMobileTab === 'sell'
                                                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30'
                                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                            }`}
                                        >
                                            <ShoppingCart size={16} strokeWidth={1.8} />
                                            Sell
                                        </button>
                                    </div>

                                    <div className="w-full">
                                        {activeMobileTab === 'price-check' ? <PriceCheck /> : <Sell />}
                                    </div>
                                </div>

                                <div className="hidden w-full max-w-3xl flex-col gap-2.5 sm:flex-row sm:gap-3 md:flex">
                                    <div className="group flex flex-1 items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:bg-white/[0.06] hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] cursor-default">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 transition-transform duration-300 group-hover:scale-105 group-hover:bg-cyan-500/25">
                                            <Search size={18} strokeWidth={1.8} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-500/70">Module 1</p>
                                            <p className="mt-0.5 text-base font-semibold text-slate-200">Price Check</p>
                                        </div>
                                    </div>

                                    <div className="group flex flex-1 items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:bg-white/[0.06] hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] cursor-default">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 transition-transform duration-300 group-hover:scale-105 group-hover:bg-emerald-500/25">
                                            <ShoppingCart size={18} strokeWidth={1.8} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500/70">Module 2</p>
                                            <p className="mt-0.5 text-base font-semibold text-slate-200">Quick Sell</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature Components Grid */}
                        <div className="hidden gap-6 grid-cols-1 lg:grid-cols-2 md:grid">
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