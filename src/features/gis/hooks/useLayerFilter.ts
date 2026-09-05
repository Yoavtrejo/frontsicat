import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { set } from 'idb-keyval';
import { gisService } from '../services/gisService';
import { MATERIALES_DICT } from '@/utils/mappings';


const endpoints: Record<string,string> = {
  "Predios": "predioss",
  "Construccion": "construcciones",
  "Manzanas": "manzanas",
}
export const useLayerFilter = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ capa: '', subOpcion: '' });
  const [geoData, setGeoData] = useState<any>(null);

  const handleFiltrar = async () => {
    if (!filters.capa || !filters.subOpcion) {
      alert("Por favor selecciona una capa");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token") || "";
      
      const normalizar = (texto: string) =>
        texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const opcionLimpia = normalizar(filters.subOpcion);
      const endpoint = endpoints [opcionLimpia] || "predioss"

      const data = await gisService.fetchLayerData(endpoint);
      
      const rawFeatures = data.features || data.results?.features || (Array.isArray(data.results) ? data.results : []);

      if (rawFeatures.length === 0) {
        throw new Error("No se encontraron datos para mostrar.");
      }

      const featuresEnriquecidos = rawFeatures.map((f: any) => ({
        ...f,
        properties: {
          ...f.properties,
          numero_pisos: Math.max(1, parseInt(f.properties.numero_pisos) || 1),
          material_nombre: (MATERIALES_DICT as any)[f.properties.material_tipo] || "No especificado"
        }
      }));

      const geoJsonfinal = {
        type: "FeatureCollection", 
        features: featuresEnriquecidos
      };

      await set('datos_geo_completos', geoJsonfinal);
      
      localStorage.setItem("capa_activa", filters.subOpcion);


      window.location.href = "/dashboard";

    } catch (error: any) {
      
      if (error.message.includes('401')) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        router.push('/login');
      } else {
        alert(`Error al procesar datos: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return { filters, setFilters, loading, handleFiltrar, geoData };
};