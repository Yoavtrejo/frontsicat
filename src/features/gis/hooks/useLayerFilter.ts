import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {set} from 'idb-keyval';
import { gisService } from '../services/gisService';
import {MATERIALES_DICT} from '@/utils/mappings';

export const useLayerFilter = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ capa: '', subOpcion: '' });
  const [geoData, setGeoData] = useState<any>(null);

  const handleFiltrar = async () => {
    if (!filters.capa || !filters.subOpcion) {
      alert("Selecciona una capa primero");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token") || "";
      const endpoint = filters.subOpcion.toLowerCase() === "predios" ? "predios" : "construcciones";
      
      const data = await gisService.fetchLayerData(endpoint, token);
      const rawFeatures = data.results?.features || data.features || [];

      const featuresEnriquecidos = rawFeatures.map((f: any) => ({
        ...f,
        properties: {
          ...f.properties,
          numero_pisos: parseInt(f.properties.numero_pisos) || 1,
          material_nombre: (MATERIALES_DICT as any)[f.properties.material_tipo] || "No especificado"
        }
      }));

      const geoJsonLimpio = { type: "FeatureCollection", features: featuresEnriquecidos };
      
      setGeoData(geoJsonLimpio); 
      await set('datos_geo_completos', data);
      localStorage.setItem("capa_activa", filters.subOpcion);

      router.push("/dashboard"); 
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Error al obtener los datos.");
    }
  };

  return { filters, setFilters, loading, handleFiltrar, geoData };
};
    
    
