"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Mapa from "@/features/gis/components/Mapa";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/features/analytics/components/StatCard";
import { MaterialList } from "@/features/analytics/components/MaterialList";
import { useDashboard } from "@/features/analytics/hooks/useDashboard";
import { generateUserReport } from "@/features/analytics/utils/reportGenerator";
import { DocumentArrowDownIcon, HomeModernIcon } from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const { loading, filteredData, stats, selectedMaterial, setSelectedMaterial, setHoveredPiso } = useDashboard();
    const handleDownload = () => {
  generateUserReport({
    capaNombre: data.capaNombre,
    totalPredios: stats.total,
    materialSeleccionado: selectedMaterial || "Todos",
    statsPisos: stats.pisos
  });
};
  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <Navbar />
      
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Columna Izquierda */}
          <aside className="lg:col-span-3 space-y-6">
            <StatCard 
              label="Predios Totales" 
              value={stats.total} 
              icon={<HomeModernIcon />} 
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
          <section className="lg:col-span-6 h-[600px]">
            <GlassCard className="h-full overflow-hidden relative !rounded-[2.5rem]">
              <Mapa datosGeo={filteredData} customColors={DEFAULT_COLORS} />
            </GlassCard>
          </section>

          {/* Columna Derecha */}
          <aside className="lg:col-span-3 space-y-6">
            <PisosChart stats={stats.pisos} onHover={setHoveredPiso} />
            
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 p-6 rounded-[2.5rem] flex items-center justify-between transition-all">
              <div className="text-left font-bold">
                <p className="text-[10px] opacity-70 uppercase">Informe</p>
                <p className="text-lg">Generar PDF</p>
              </div>
              <DocumentArrowDownIcon className="w-8 h-8" />
            </button>
          </aside>
          <aside className="lg:col-span-3 space-y-6">
            <PisosChart 
              stats={stats.pisos} 
              total={parseInt(data.predios.replace(/,/g, ''))}
              onHover={setHoveredPiso}
              hoveredKey={hoveredPiso}
            />
            
            <Button variant="primary" className="!rounded-[2.5rem] p-6" onClick={generatePDF}>
              <div className="flex justify-between items-center w-full">
                  <div className="text-left">
                    <p className="text-[10px] opacity-70 uppercase">Exportar Datos</p>
                    <p className="text-lg">Descargar Reporte</p>
                  </div>
                  <DocumentArrowDownIcon className="w-8 h-8" />
              </div>
            </Button>
          </aside>
        </div>
                // ... en el botón de tu JSX
        <button onClick={handleDownload} className="...">
        {/* contenido del botón */}
        </button>
      </main>

      <Footer />
    </div>
  );
}
