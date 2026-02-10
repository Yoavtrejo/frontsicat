"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Mapa from "@/features/gis/components/Mapa";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/features/analytics/components/StatCard";
import { MaterialList } from "@/features/analytics/components/MaterialList";
import { PisosChart } from "@/features/analytics/components/PIsosCharts";
import { useDashboard } from "@/features/analytics/hooks/useDashboard";
import { generateUserReport } from "@/features/analytics/utils/reportGenerator";
import { DocumentArrowDownIcon, HomeModernIcon } from "@heroicons/react/24/outline";

const COLOR_MAP: Record<string, string> = {
  "1": "#3b82f6",
  "2": "#10b981",
  "3": "#f59e0b",
  "default": "#334155"
};

export default function DashboardPage() {
  const { 
    loading, 
    filteredData, 
    stats, 
    selectedMaterial, 
    setSelectedMaterial, 
    setHoveredPiso,
    hoveredPiso 
  } = useDashboard();

  const handleDownload = () => {
    generateUserReport({
      capaNombre: "Análisis de Predios", 
      totalPredios: stats.total,
      materialSeleccionado: selectedMaterial || "Todos",
      statsPisos: stats.pisos
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-serif italic">
      Cargando UrbanInsight Dashboard...
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <Navbar />
      
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <aside className="lg:col-span-3 space-y-6">
            <StatCard 
              label="Predios Totales" 
              value={stats.total} 
              icon={<HomeModernIcon className="w-6 h-6 text-blue-400" />} 
              color="blue" 
            />
            <MaterialList 
              stats={stats.materiales} 
              selected={selectedMaterial} 
              onSelect={setSelectedMaterial}
              total={stats.total}
            />
          </aside>
          <section className="lg:col-span-6 h-[650px]">
            <GlassCard className="h-full overflow-hidden relative !rounded-[2.5rem] border border-white/10">
              <Mapa 
                datosGeo={filteredData} 
                mostrarRiesgos={false} 
                highlightPiso={hoveredPiso} 
                customColors={COLOR_MAP}
              />
            </GlassCard>
          </section>
          <aside className="lg:col-span-3 space-y-6">
            <GlassCard className="p-4 !rounded-[2.5rem] border border-white/5">
               <PisosChart 
                stats={stats.pisos} 
                total={stats.total}
                onHover={setHoveredPiso}
                hoveredKey={hoveredPiso}
              />
            </GlassCard>
            
            <button 
              onClick={handleDownload}
              className="w-full bg-emerald-600 hover:bg-emerald-500 p-6 rounded-[2.5rem] flex items-center justify-between transition-all group active:scale-95 shadow-lg shadow-emerald-900/20"
            >
              <div className="text-left">
                <p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">Gestión Documental</p>
                <p className="text-lg font-semibold">Descargar Reporte</p>
              </div>
              <DocumentArrowDownIcon className="w-8 h-8 group-hover:translate-y-1 transition-transform" />
            </button>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}