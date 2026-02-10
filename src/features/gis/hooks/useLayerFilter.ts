import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { set } from 'idb-keyval';
import { gisService } from '../services/gisService';
import { MATERIALES_DICT } from '@/utils/mappings';

export const useLayerFilter = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ capa: '', subOpcion: '' });
  const [geoData, setGeoData] = useState<any>(null);

  const handleFiltrar = async () => {
    // 1. Validación de selección
    if (!filters.capa || !filters.subOpcion) {
      alert("Por favor, selecciona una capa y una opción de detalle.");
      return;
    }

    setLoading(true);
    try {
      // 2. Token (lo obtenemos pero no lo bloqueamos si falla)
      const token = localStorage.getItem("access_token") || "";

      // 3. Normalización del texto (quita tildes y pone en minúsculas)
      const normalizar = (texto: string) => 
          texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      const opcionLimpia = normalizar(filters.subOpcion);
      const endpoint = opcionLimpia.includes("predio") ? "predios" : "construcciones";
      
      // 4. Petición al servicio (ahora público)
      const data = await gisService.fetchLayerData(endpoint, token);

      // 5. Navegación en la estructura de Django (data.results.features)
      const rawFeatures = data.results?.features || data.features || [];

      if (rawFeatures.length === 0) {
        console.warn("Atención: No se encontraron datos para esta capa.");
      }

      // 6. Enriquecimiento de datos para el Dashboard y Mapa
      const featuresEnriquecidos = rawFeatures.map((f: any) => ({
        ...f,
        properties: {
          ...f.properties,
          // Sincronizado con 'numero_pisos' (plural) de tu API
          numero_pisos: parseInt(f.properties.numero_pisos) || 1,
          // Mapeo de material (ej: "CO" -> "Concreto")
          material_nombre: (MATERIALES_DICT as any)[f.properties.material_tipo] || "No especificado"
        }
      }));

      const geoJsonFinal = { 
        type: "FeatureCollection", 
        features: featuresEnriquecidos 
      };

      // 7. Persistencia de datos
      setGeoData(geoJsonFinal); 
      // Guardamos en IndexedDB para que el Mapa lo lea en la siguiente vista
      await set('datos_geo_completos', geoJsonFinal);
      localStorage.setItem("capa_activa", filters.subOpcion);

      console.log("Carga exitosa. Redirigiendo...");
      router.push("/dashboard"); 

    } catch (error: any) {
      console.error("Error en el filtrado:", error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { filters, setFilters, loading, handleFiltrar, geoData };
};