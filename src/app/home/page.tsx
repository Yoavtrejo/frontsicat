"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { HeroSection } from "@/features/home/components/HeroSection";
import { useHomeData } from "@/features/home/hooks/useHomeData";

export default function HomePage() {
    const { proyectosConDatos, setSelectedProject } = useHomeData();

    return (
        <div className="bg-[#f1f5f9] dark:bg-[#020617] min-h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-sky-500/20 rounded-full blur-[100px]" />
            </div>

            <Navbar />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-16">
            <HeroSection />

        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-8 bg-lime-500 rounded-full" /> 
              <h3 className="text-3xl font-bold tracking-tight">Proyectos en Desarrollo</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {proyectosConDatos.map((proy, idx) => (
              <div key={idx} className="group cursor-pointer transition-all duration-300 transform hover:-translate-y-3">
                <Card proy={proy} onClick={() => setSelectedProject(proy)} />
                <div className="mt-4 flex gap-2">
                   <IndicatorDots />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Pequeño componente local para no ensuciar el map
const IndicatorDots = () => (
  <>
    <div className="h-1.5 w-8 bg-emerald-500 rounded-full" title="Bosque" />
    <div className="h-1.5 w-8 bg-lime-400 rounded-full" title="Pradera" />
    <div className="h-1.5 w-8 bg-sky-500 rounded-full" title="Mar" />
  </>
);