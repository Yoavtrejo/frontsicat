"use client";
import { useState } from "react";
import { useDashboard } from "@/features/analytics/hooks/useDashboard";
import { MaterialList } from "@/features/analytics/components/MaterialList";
import { PisosChart } from "@/features/analytics/components/PIsosCharts";
import Mapa from "@/features/gis/components/Mapa";
import { HomeModernIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const { 
    loading, stats, filteredData, selectedMaterial, 
    setSelectedMaterial, setHoveredPiso, hoveredPiso, capaActiva 
  } = useDashboard();

  // Estado local para colores de materiales (puedes moverlo a constantes si prefieres)
  const [materialColors, setMaterialColors] = useState<Record<string, string>>({
    "Concreto": "#3b82f6", 
    "Ladrillo": "#ef4444", 
    "Adobe": "#f59e0b", 
    "Madera": "#10b981", 
    "No especificado": "#64748b"
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-slate-400 font-medium">Procesando registros espaciales...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans">
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* PANEL IZQUIERDO: Estadísticas Generales y Materiales */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 flex justify-between items-center shadow-lg">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total {capaActiva}</p>
                <p className="text-3xl font-black">{stats.total.toLocaleString()}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center ${stats.esPredio ? 'text-emerald-500' : 'text-blue-500'}`}>
                {stats.esPredio ? <Square3Stack3DIcon className="w-6 h-6"/> : <HomeModernIcon className="w-6 h-6"/>}
              </div>
            </div>

            {stats.esPredio ? (
              <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 border-t-emerald-500 shadow-lg">
                <p className="text-emerald-400 font-bold text-xs uppercase mb-2">Capa de Predios</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Mostrando delimitación de terrenos catastrales. Esta capa no contiene atributos de construcción como materiales o niveles.
                </p>
              </div>
            ) : (
              <MaterialList 
                stats={stats.materiales} 
                selected={selectedMaterial} 
                onSelect={setSelectedMaterial}
                total={stats.total} 
                customColors={materialColors} 
                onColorChange={(n, c) => setMaterialColors(p => ({...p, [n]: c}))}
              />
            )}
          </div>

          {/* PANEL CENTRAL: El Mapa */}
          <div className="lg:col-span-6 h-[700px] bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden relative shadow-2xl">
             <Mapa 
               datosGeo={filteredData} 
               customColors={materialColors} 
               highlightPiso={hoveredPiso} 
             />
          </div>

          {/* PANEL DERECHO: Gráfica de Pisos */}
          <div className="lg:col-span-3">
            {!stats.esPredio ? (
              <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-lg">
                <PisosChart 
                  stats={stats.pisos} 
                  total={stats.total} 
                  onHover={setHoveredPiso} 
                  hoveredKey={hoveredPiso} 
                />
              </div>
            ) : (
              <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800 border-dashed text-center h-full flex flex-col justify-center items-center opacity-50">
                <HomeModernIcon className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-500 text-sm">Información de altura no disponible para predios</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}