import React from "react";

export default function Footer() {
    return (
        <footer className="relative mt-20 overflow-hidden">
            <div className="h-1.5 w-full flex">
                <div className="h-full w-1/4 bg-emerald-600" title="Bosques"></div>
                <div className="h-full w-1/4 bg-lime-500" title="Praderas"></div>
                <div className="h-full w-1/4 bg-sky-500" title="Mares"></div>
                <div className="h-full w-1/4 bg-slate-400" title="Ciudades"></div>
            </div>

            <div className="py-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6">

            <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-300"></span>
            </div>

            <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-300 font-bold tracking-tight">
                    UrbanInsight <span className="text-slate-400 font-light">| Analytics</span>
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-[0.3em]">
                    Monitoreo de ecosistemas y urbanismo
                </p>
            </div>

            <p className="text-slate-400 dark:text-slate-600 text-[10px] mt-4">
                © 2026 UrbanInsight. Todos los derechos reservados.
            </p>
            </div>
        </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-gradient-to-t from-emerald-500/5 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />
    </footer>
    );
}