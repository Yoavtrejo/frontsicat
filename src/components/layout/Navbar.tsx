"use client";
import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ChevronDownIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useDarkMode } from "../../features/home/hooks/darkmode";
import { NAV_LINKS } from "../../features/home/hooks/navigation";

export default function Navbar() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return <div className="h-20 bg-white dark:bg-slate-950" />;

    const handleLogout = () => {
        console.log("Cerrando sesión...");
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-20">

                    <Link href="" className="flex items-center gap-3 group">
                        <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <Image src="/img/Logo.png" alt="Logo" width={26} height={26} className="brightness-0 invert" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-lime-400 rounded-full border-2 border-slate-800" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black tracking-tighter dark:text-white leading-none">UrbanInsight</h1>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="h-1 w-3 bg-emerald-500 rounded-full" />
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] leading-none">Territorial AI</p>
                            </div>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link 
                                    key={link.name} 
                                    href={link.href}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                        isActive 
                                        ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" 
                                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                                    }`}
                                >
                                    <i className={`fi ${link.icon} ${isActive ? 'text-emerald-500' : 'opacity-70'}`}></i>
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all text-slate-600 dark:text-slate-400 group"
                        >
                            {isDarkMode ? 
                                <SunIcon className="w-5 h-5 group-hover:text-yellow-500 transition-colors" /> : 
                                <MoonIcon className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                            }
                        </button>

                        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
                        <Menu as="div" className="relative">
                            <MenuButton className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-white dark:hover:bg-slate-900 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-800 flex items-center justify-center text-white shadow-lg font-black text-sm ring-2 ring-white dark:ring-slate-800">
                                    A
                                </div>
                                <div className="text-left hidden lg:block">
                                    <p className="text-xs font-black dark:text-white leading-none">Analista Pro</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse" />
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Conectado</p>
                                    </div>
                                </div>
                                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                            </MenuButton>

                            <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <MenuItems className="absolute right-0 mt-3 w-56 origin-top-right rounded-3xl bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-slate-200 dark:ring-slate-800 focus:outline-none p-2.5 overflow-hidden">
                                    <div className="px-4 py-3 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Sector Asignado</p>
                                        <p className="text-sm font-bold text-sky-600 dark:text-sky-400">Cuenca Marítima Norte</p>
                                    </div>

                                    <MenuItem>
                                        {({ focus }) => (
                                        <Link href="/Pages/Perfil" className={`${focus ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'text-slate-700 dark:text-slate-200'} flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors`}>
                                            <i className="fi fi-rr-user"></i> Mi Perfil Urbano
                                        </Link>
                                        )}
                                    </MenuItem>
                                                    
                                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-2" />

                                    <MenuItem>
                                        {({ focus }) => (
                                        <button onClick={handleLogout} className={`${focus ? 'bg-rose-50 dark:bg-rose-950/30' : ''} flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 transition-colors`}>
                                            <i className="fi fi-rr-exit"></i> Salir del Sistema
                                        </button>
                                        )}
                                    </MenuItem>
                                </MenuItems>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </header>
    );
}