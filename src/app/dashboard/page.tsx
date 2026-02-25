"use client";
import { useState } from "react";
import { useDashboard } from "@/features/analytics/hooks/useDashboard";
import { MaterialList } from "@/features/analytics/components/MaterialList";
import { PisosChart } from "@/features/analytics/components/PIsosCharts";
import { EquipamientoChart } from "@/features/analytics/components/equipamiento";
import Mapa from "@/features/gis/components/Mapa";
import { 
  HomeModernIcon, 
  BoltIcon, 
  ChartBarIcon, 
  XMarkIcon, 
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const { 
    loading, stats, filteredData, selectedMaterial, 
    setSelectedMaterial, setHoveredPiso, hoveredPiso, 
    capaActiva, setSelectedFeature, cantidades,
    predios_cantidad, poblacion,viviendas,prediosCartografia,prediosPadron
  } = useDashboard();

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

  const isPredios = capaActiva?.toLowerCase().includes("predio");
  const algoSeleccionado = isPredios ? !!predios_cantidad.seleccionada : !!cantidades.seleccionada;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans">
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 py-8">
        
        <div className="flex justify-between items-end mb-8 px-2">
            <div>
                <h1 className="text-4xl font-black tracking-tight italic uppercase">Dashboard de {capaActiva}</h1>
                <p className="text-slate-500 font-medium font-mono uppercase text-xs tracking-widest">Análisis geoespacial en tiempo real</p>
            </div>
            
            {algoSeleccionado && (
                <button 
                    onClick={() => setSelectedFeature(null)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-xs font-black transition-all shadow-lg shadow-blue-900/20"
                >
                    <XMarkIcon className="w-4 h-4" />
                    LIMPIAR SELECCIÓN
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-3 space-y-6">
            
            {!isPredios ? (
              <>
                <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <HomeModernIcon className="w-16 h-16 text-blue-500" />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    {algoSeleccionado ? `Cód: ${cantidades.seleccionada?.codigo}` : `Total Construcciones`}
                  </p>
                  <p className="text-4xl font-black text-blue-500">
                    {algoSeleccionado ? cantidades.seleccionada?.construcciones.toLocaleString() : cantidades.globalConstrucciones.toLocaleString()}
                  </p>
                </div>

                <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BoltIcon className="w-16 h-16 text-emerald-500" />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Paneles Solares</p>
                  <p className="text-4xl font-black text-emerald-500">
                    {algoSeleccionado ? cantidades.seleccionada?.paneles.toLocaleString() : cantidades.globalPaneles.toLocaleString()}
                  </p>
                </div>

                <MaterialList 
                  stats={stats.materiales} 
                  selected={selectedMaterial} 
                  onSelect={setSelectedMaterial}
                  total={stats.total} 
                  customColors={materialColors} 
                  onColorChange={(n, c) => setMaterialColors(p => ({...p, [n]: c}))}
                />
              </>
            ) : (
              // VISTA PARA PREDIOS (ArcGIS Data)
              <div className="space-y-4">
                 <div className="bg-blue-600 p-6 rounded-[2.5rem] shadow-lg shadow-blue-900/20">
                    <p className="text-[10px] uppercase font-black text-blue-200 mb-1">Muestra Total</p>
                    <p className="text-4xl font-black">{predios_cantidad.total.toLocaleString()}</p>
                    <p className="text-[10px] font-bold mt-2 opacity-80">PREDIOS REGISTRADOS</p>
                 </div>

                 <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[500px] pr-2 scrollbar-hide">
                    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <HomeModernIcon className="w-4 h-4 text-sky-500" />
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Poblacion
                        </p>
                      </div>
                      <p className="text-2xl font-black text-sky-400">
                        {poblacion 
                          ? `${(poblacion / 1_000).toFixed(0)}K` 
                          : "..."}
                      </p>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <HomeModernIcon className="w-4 h-4 text-sky-500" />
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Viviendas
                        </p>
                      </div>
                      <p className="text-2xl font-black text-sky-400">
                        {viviendas 
                          ? `${(viviendas / 1_000).toFixed(0)}K` 
                          : "..."}
                      </p>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Escuelas</p>
                        <p className="text-2xl font-black text-emerald-400">
                            {algoSeleccionado ? predios_cantidad.seleccionada?.Escuelas : predios_cantidad.globalEscuelas}
                        </p>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Parques</p>
                        <p className="text-2xl font-black text-emerald-400">
                            {algoSeleccionado ? predios_cantidad.seleccionada?.Parques : predios_cantidad.globalParques}
                        </p>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Templos</p>
                        <p className="text-2xl font-black text-emerald-400">
                            {algoSeleccionado ? predios_cantidad.seleccionada?.Templos : predios_cantidad.globalTemplos}
                        </p>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Aeropuertos</p>
                        <p className="text-2xl font-black text-emerald-400">
                            {algoSeleccionado ? predios_cantidad.seleccionada?.Aeropuertos : predios_cantidad.globalAeropuertos}
                        </p>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Cementerios</p>
                        <p className="text-2xl font-black text-emerald-400">
                            {algoSeleccionado ? predios_cantidad.seleccionada?.Cementerios : predios_cantidad.globalCementerios}
                        </p>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Invernaderos</p>
                        <p className="text-2xl font-black text-emerald-400">
                            {algoSeleccionado ? predios_cantidad.seleccionada?.Invernaderos : predios_cantidad.globalInvernadero}
                        </p>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* MAPA CENTRAL */}
          <div className="lg:col-span-6 h-[700px] bg-slate-900 rounded-[3rem] border border-slate-800 overflow-hidden relative shadow-2xl">
             <Mapa 
               datosGeo={filteredData} 
               customColors={materialColors} 
               highlightPiso={hoveredPiso} 
               onFeatureSelect={setSelectedFeature} 
             />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-lg h-full">
              <div className="flex items-center gap-2 mb-6">
                  <ChartBarIcon className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold uppercase text-xs tracking-widest">
                    {isPredios ? "Resumen de Equipamiento" : "Distribución de Alturas"}
                  </h3>
              </div>
              

              {!isPredios ? (
                <PisosChart 
                  stats={stats.pisos} 
                  total={stats.total} 
                  onHover={setHoveredPiso} 
                  hoveredKey={hoveredPiso} 
                />
              ) : (
                <div className="space-y-6">
                    <EquipamientoChart data={predios_cantidad} />
                    
                    {algoSeleccionado && (
                        <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 animate-in fade-in zoom-in">
                            <p className="text-[10px] font-black text-blue-500 uppercase mb-3">Detalle del Registro</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Categoría:</span>
                                    <span className="text-white font-bold">{predios_cantidad.seleccionada?.categoria || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Altura:</span>
                                    <span className="text-emerald-400 font-bold">{predios_cantidad.seleccionada?.z_valor?.toFixed(2)} m</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              )}
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Gasolinerias</p>
                  <p className="text-2xl font-black text-emerald-400">
                      {algoSeleccionado ? predios_cantidad.seleccionada?.Gasolinerias : predios_cantidad.globalGasolinerias}
                  </p>
              </div>
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Mercados</p>
                  <p className="text-2xl font-black text-emerald-400">
                      {algoSeleccionado ? predios_cantidad.seleccionada?.Mercados : predios_cantidad.globalMercados}
                  </p>
              </div>
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Plaza</p>
                  <p className="text-2xl font-black text-emerald-400">
                      {algoSeleccionado ? predios_cantidad.seleccionada?.Plazas : predios_cantidad.globalPlazas}
                  </p>
              </div>
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Ruinas</p>
                  <p className="text-2xl font-black text-emerald-400">
                      {algoSeleccionado ? predios_cantidad.seleccionada?.Ruinas : predios_cantidad.globalRuinas}
                  </p>
              </div>
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Construcciones</p>
                  <p className="text-2xl font-black text-emerald-400">
                      {algoSeleccionado ? predios_cantidad.seleccionada?.Construcciones : predios_cantidad.globalConstrucciones}
                  </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}