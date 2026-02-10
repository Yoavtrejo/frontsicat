"use client";

import { useLayerFilter } from "@/features/gis/hooks/useLayerFilter";
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer";
import { SelectField } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FunnelIcon } from "@heroicons/react/24/outline";
import Mapa from "@/features/gis/components/Mapa";


const OPCIONES_POR_CAPA = {
  "Catastro": ["Predios", "Construcciones", "Lotes", "Zonas Catastrales"],
  "Riesgos": ["Inundaciones", "Zonas Sísmicas", "Deslaves"],
  "Vialidades": ["Avenidas Principales", "Calles Secundarias", "Ciclovías"]
};

export default function MapaPage() {
  const { filters, setFilters, loading, handleFiltrar, geoData } = useLayerFilter();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-200">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        
        <aside className="w-80 bg-slate-900 p-6 z-20 shadow-2xl flex flex-col gap-6 border-r border-slate-800">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Filtros de Mapa</h2>

          <div className="space-y-4">
            <SelectField 
              label="Capa Principal"
              options={Object.keys(OPCIONES_POR_CAPA)}
              value={filters.capa}
              onChange={(e: any) => setFilters({ capa: e.target.value, subOpcion: "" })}
            />

            {filters.capa && (
              <SelectField 
                label="Detalles"
                options={(OPCIONES_POR_CAPA as any)[filters.capa]}
                value={filters.subOpcion}
                onChange={(e: any) => setFilters({ ...filters, subOpcion: e.target.value })}
              />
            )}
          </div>

          <Button 
            onClick={handleFiltrar} 
            isLoading={loading} 
            variant="primary" 
            className="mt-auto"
          >
            {!loading && <FunnelIcon className="w-5 h-5 mr-2 inline" />}
            {loading ? "Cargando Dashboard..." : "Aplicar Filtros"}
          </Button>
        </aside>

        <section className="flex-1 relative bg-slate-950">
          <Mapa 
            datosGeo={geoData} 
            mostrarRiesgos={filters.capa === "Riesgos"}
            highlightPiso={null} 
          />
        </section>
        
      </div>
    {/* <Footer /> */}
    </div>
  );
}