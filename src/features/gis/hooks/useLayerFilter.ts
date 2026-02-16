import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { set } from 'idb-keyval';
import { gisService } from '../services/gisService';
import { MATERIALES_DICT } from '@/utils/mappings';

export const useLayerFilter = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ capa: '', subOpcion: '' });
  // Eliminamos setGeoData de aquí para no saturar la memoria RAM del estado de React
  const [geoData, setGeoData] = useState<any>(null);

  const handleFiltrar = async () => {
    if (!filters.capa || !filters.subOpcion) {
      alert("Por favor selecciona una capa");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token") || "";
      
      // 1. Normalización de nombres para el endpoint
      const normalizar = (texto: string) =>
        texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const opcionLimpia = normalizar(filters.subOpcion);
      const endpoint = opcionLimpia.includes("predio") ? "predios" : "construcciones";

      // 2. Petición al servicio
      const data = await gisService.fetchLayerData(endpoint, token);
      
      // Manejo de estructura (Paginada o GeoJSON directo)
      const rawFeatures = data.features || data.results?.features || (Array.isArray(data.results) ? data.results : []);

      if (rawFeatures.length === 0) {
        throw new Error("No se encontraron datos para mostrar.");
      }

      // 3. Procesamiento OPTIMIZADO (Sin recursión de coordenadas)
      // Confiamos en que el Backend (Serializer antiguo) ya entrega Lat/Lng (4326)
      const featuresEnriquecidos = rawFeatures.map((f: any) => ({
        ...f,
        properties: {
          ...f.properties,
          // Aseguramos valores numéricos para el renderizado 3D
          numero_pisos: Math.max(1, parseInt(f.properties.numero_pisos) || 1),
          material_nombre: (MATERIALES_DICT as any)[f.properties.material_tipo] || "No especificado"
        }
      }));

      const geoJsonfinal = {
        type: "FeatureCollection", 
        features: featuresEnriquecidos
      };

      // 4. Guardado persistente en IndexedDB
      // Esto es crucial para que el Dashboard lea los datos sin pedirlos de nuevo
      await set('datos_geo_completos', geoJsonfinal);
      
      // Guardamos metadatos necesarios
      localStorage.setItem("capa_activa", filters.subOpcion);

      console.log(`✅ ${featuresEnriquecidos.length} registros listos. Redirigiendo...`);

      // 5. Redirección Robusta
      // Usamos window.location.href en lugar de router.push para 20k registros.
      // Esto limpia la memoria del navegador y evita conflictos con el estado de autenticación de Next.js.
      window.location.href = "/dashboard";

    } catch (error: any) {
      console.error("🔥 Error en el proceso de filtrado:", error);
      
      // Si el error es de autenticación, el servicio ya debería haber lanzado el log
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