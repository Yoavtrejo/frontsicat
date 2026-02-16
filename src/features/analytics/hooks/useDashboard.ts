import { useState, useEffect, useMemo } from "react";
import { get } from "idb-keyval"; 
import { MATERIAL_COLORS, PISO_COLORS } from "@/utils/constants"; 
import { MATERIALES_DICT } from "@/utils/mappings";

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [hoveredPiso, setHoveredPiso] = useState<string | number | null>(null);
  const [capaActiva, setCapaActiva] = useState("");

  useEffect(() => {
    const fetchLocalData = async () => {
      setLoading(true);
      try {
        // 1. Extraer de IndexedDB
        const localData = await get('datos_geo_completos');
        const nombreCapa = localStorage.getItem("capa_activa") || "Capa Seleccionada";
        setCapaActiva(nombreCapa);

        if (!localData) {
          console.warn("⚠️ No se encontraron datos en caché.");
          setLoading(false);
          return;
        }

        // 2. Normalizar estructura GeoJSON
        let actualGeoJSON = localData.features ? localData : (localData.results || localData);
        
        if (Array.isArray(actualGeoJSON)) {
          actualGeoJSON = {
            type: "FeatureCollection",
            features: actualGeoJSON
          };
        }

        if (actualGeoJSON?.features) {
          setGeoData(actualGeoJSON);
        }
      } catch (error) {
        console.error("❌ Error cargando datos locales:", error);
      } finally {
        // Un pequeño respiro para el procesador
        setTimeout(() => setLoading(false), 200);
      }
    };
    fetchLocalData();
  }, []);

  const stats = useMemo(() => {
    if (!geoData?.features?.length) {
      return { materiales: [], pisos: [], total: 0, esPredio: false };
    }

    const features = geoData.features;
    const total = features.length;
    
    // Detectamos si es predio (si no tiene material_tipo o es explícito)
    const esPredio = features[0]?.properties?.elemento === "Predios" || 
                     !features[0]?.properties?.material_tipo;

    if (esPredio) {
      return { total, esPredio: true, materiales: [], pisos: [] };
    }

    // --- PROCESAMIENTO LINEAL (O(n)) ---
    // Un solo recorrido para contar todo de golpe
    const materialCounts: Record<string, number> = {};
    const pisoCounts: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0 };

    for (let i = 0; i < features.length; i++) {
      const props = features[i].properties;
      
      // Conteo de Materiales
      const m = (MATERIALES_DICT as any)[props.material_tipo] || "No especificado";
      materialCounts[m] = (materialCounts[m] || 0) + 1;

      // Conteo de Pisos
      const p = parseInt(props.numero_pisos) || 1;
      if (p >= 4) pisoCounts["4"]++;
      else pisoCounts[p.toString()] = (pisoCounts[p.toString()] || 0) + 1;
    }

    const materiales = Object.entries(materialCounts).map(([name, value]: any) => ({ 
      name, value, color: MATERIAL_COLORS[name] || MATERIAL_COLORS.default 
    })).sort((a, b) => b.value - a.value);

    const pisos = ["1", "2", "3", "4"].map((key, i) => ({
      key: parseInt(key),
      label: key === "4" ? "4+ Pisos" : `${key} Piso${key !== "1" ? "s" : ""}`,
      count: pisoCounts[key],
      percentage: (pisoCounts[key] / total) * 100,
      color: PISO_COLORS[i], 
    }));

    return { materiales, pisos, total, esPredio: false };
  }, [geoData]);

  const filteredData = useMemo(() => {
    if (!geoData) return { type: "FeatureCollection", features: [] };
    if (!selectedMaterial || stats.esPredio) return geoData;
    
    return {
      ...geoData,
      features: geoData.features.filter((f: any) => {
        const nombre = (MATERIALES_DICT as any)[f.properties.material_tipo] || "No especificado";
        return nombre === selectedMaterial;
      }),
    };
  }, [geoData, selectedMaterial, stats.esPredio]);

  return { loading, filteredData, stats, selectedMaterial, setSelectedMaterial, hoveredPiso, setHoveredPiso, capaActiva };
};