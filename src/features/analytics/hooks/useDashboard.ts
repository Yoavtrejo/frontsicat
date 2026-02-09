import { useState, useEffect, useMemo } from "react";
import { geoService } from "@/features/analytics/services/geoService";

const PISO_COLORS = ["#6366f1", "#a855f7", "#ec4899", "#64748b"];

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [hoveredPiso, setHoveredPiso] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const features = await geoService.getEnrichedData();
        if (features) {
          setGeoData({ type: "FeatureCollection", features });
        }
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrado de datos para el Mapa
  const filteredData = useMemo(() => {
    if (!geoData) return null;
    if (!selectedMaterial) return geoData;
    return {
      ...geoData,
      features: geoData.features.filter(
        (f: any) => f.properties.material_nombre === selectedMaterial
      ),
    };
  }, [geoData, selectedMaterial]);

  // Cálculo de Estadísticas (Materiales y Pisos)
  const stats = useMemo(() => {
    if (!geoData || !geoData.features) {
      return { materiales: [], pisos: [], total: 0 };
    }

    const features = geoData.features;
    const total = features.length;

    // Conteo de Materiales
    const materialCounts = features.reduce((acc: any, f: any) => {
      const m = f.properties.material_nombre || "No especificado";
      acc[m] = (acc[m] || 0) + 1;
      return acc;
    }, {});

    const materiales = Object.entries(materialCounts)
      .map(([name, value]: any) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Conteo de Pisos (Agrupando 4 o más)
    const pisoCounts = features.reduce((acc: any, f: any) => {
      const p = f.properties.numero_pisos;
      const key = p >= 4 ? "4" : p.toString();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const pisos = ["1", "2", "3", "4"].map((key, i) => {
      const count = pisoCounts[key] || 0;
      return {
        key: key === "4" ? 4 : parseInt(key),
        label: key === "4" ? "4 o más pisos" : `${key} Piso${key !== "1" ? "s" : ""}`,
        count: count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        color: PISO_COLORS[i],
      };
    });

    return { materiales, pisos, total };
  }, [geoData]);

  return {
    loading,
    filteredData,
    stats,
    selectedMaterial,
    setSelectedMaterial,
    hoveredPiso,
    setHoveredPiso,
  };
};
