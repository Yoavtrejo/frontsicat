"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Mapa from "@/features/gis/components/Mapa";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/features/analytics/components/StatCard";
import { MaterialList } from "@/features/analytics/components/MaterialList";
import { PisosChart } from "@/features/analytics/components/PisosChart"; // Asumiendo el import
import { useDashboard } from "@/features/analytics/hooks/useDashboard";
import { generateUserReport } from "@/features/analytics/utils/reportGenerator";
import { DocumentArrowDownIcon, HomeModernIcon } from "@heroicons/react/24/outline";

// Definir colores por defecto si no vienen del hook
const DEFAULT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const { 
    loading, 
    filteredData, 
    stats, 
    selectedMaterial, 
    setSelectedMaterial, 
    setHoveredPiso,
    hoveredPiso // Asegúrate de que el hook devuelva esto
  } = useDashboard();

  const handleDownload = () => {
    generateUserReport({
      capaNombre: "Análisis de Predios", // O stats.nombreCapa si existe
      totalPredios: stats.total,
      materialSeleccionado: selectedMaterial || "Todos",
      statsPisos: stats.pisos
    });
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center">Cargando dashboard...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <Navbar />
      
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Columna Izquierda: Estadísticas y Filtros */}
          <aside className="lg:col-span-3 space-y-6">
            <StatCard 
              label="Predios Totales" 
              value={stats.total} 
              icon={<HomeModernIcon className="w-6 h-6" />} 
              color="text-blue-500" 
            />
            <MaterialList 
              stats={stats.materiales} 
              selected={selectedMaterial} 
              onSelect={setSelectedMaterial}
              total={stats.total}
              colors={DEFAULT_COLORS}
            />
          </aside>

          {/* Mapa Central */}
          <section className="lg:col-span-6 h-[650px]">
            <GlassCard className="h-full overflow-hidden relative !rounded-[2.5rem] border border-white/10">
              <Mapa datosGeo={filteredData} customColors={DEFAULT_COLORS} />
            </GlassCard>
          </section>

          {/* Columna Derecha: Gráficos y Exportación */}
          <aside className="lg:col-span-3 space-y-6">
            <GlassCard className="p-4 !rounded-[2.5rem]">
               <PisosChart 
                stats={stats.pisos} 
                onHover={setHoveredPiso}
                hoveredKey={hoveredPiso}
              />
            </GlassCard>
            
            <button 
              onClick={handleDownload}
              className="w-full bg-emerald-600 hover:bg-emerald-500 p-6 rounded-[2.5rem] flex items-center justify-between transition-all group active:scale-95 shadow-lg shadow-emerald-900/20"
            >
              <div className="text-left">
                <p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">Reporte</p>
                <p className="text-lg font-semibold">Descargar PDF</p>
              </div>
              <DocumentArrowDownIcon className="w-8 h-8 group-hover:bounce" />
            </button>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}