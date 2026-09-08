import { useState, useEffect, useMemo } from "react";
import { get } from "idb-keyval"; 
import { useInegiIndicador } from "@/hooks/useInegi";
import { MATERIAL_COLORS, PISO_COLORS } from "@/utils/constants"; 
import { MATERIALES_DICT } from "@/utils/mappings";
import { features } from "process";

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [hoveredPiso, setHoveredPiso] = useState<string | number | null>(null);
  const [capaActiva, setCapaActiva] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const prediosPadron = useInegiIndicador("8999998890", "31");
  const prediosCartografia = useInegiIndicador("8999998889", "31"); 
  const poblacion = useInegiIndicador("1002000001", "31");
  const viviendas = useInegiIndicador("1003000001", "31");
    //Logica extraer datos de predios
    const predios_cantidad = useMemo(() => {
      if(!geoData?.features?.length) return {
        total: 0,
        globalAeropuertos: 0,
        globalCementerios: 0,
        globalEscuelas: 0,
        globalGasolinerias: 0,
        globalInvernadero: 0,
        globalMercados: 0,
        globalPlazas: 0,
        globalRuinas: 0,
        globalSubestaciones: 0,
        globalTemplos: 0,
        globalParques: 0,
        globalCultivos: 0,
        globalConstrucciones: 0,
        seleccionada: null
      }


      const features = geoData.features
        const todo = features.reduce((acc: any,f:any) => {
          acc.aeropuertos += (f.properties.aeropuerto || 0);
          acc.cementerios += (f.properties.cementerio || 0);
          acc.escuelas += (f.properties.escuela || 0);
          acc.gasolinerias += (f.properties.gasolineria || 0);
          acc.invernaderos += (f.properties.invernadero || 0);
          acc.mercados += (f.properties.mercado || 0);
          acc.plazas += (f.properties.plaza || 0);
          acc.ruinas += (f.properties.ruina || 0);
          acc.subestaciones += (f.properties.subestaciones_electricas || 0);
          acc.templos += (f.properties.templo || 0);
          acc.parques += (f.properties.parque || 0);
          acc.cultivos += (f.properties.zonas_cultivo || 0);
          acc.construcciones += (f.properties.construccion || 0);
          return acc;
        },{aeropuertos: 0, cementerios: 0, escuelas: 0, gasolinerias: 0, invernaderos: 0, mercados: 0, plazas: 0, ruinas: 0, subestaciones: 0, templos: 0, parques: 0, cultivos: 0, construcciones: 0});
        return{
          total: features.length,
          globalAeropuertos: todo.aeropuertos,
          globalCementerios: todo.cementerios,
          globalEscuelas: todo.escuelas,
          globalGasolinerias: todo.gasolinerias,
          globalInvernadero: todo.invernaderos,
          globalMercados: todo.mercados,
          globalPlazas: todo.plazas,
          globalRuinas: todo.ruinas,
          globalSubestaciones: todo.subestaciones,
          globalTemplos: todo.templos,
          globalParques: todo.parques,
          globalCultivos: todo.cultivos,
          globalConstrucciones: todo.construcciones,
          seleccionada: selectedFeature?{
            Aeropuertos: selectedFeature.properties.aeropuerto,
            Cementerios: selectedFeature.properties.cementerio,
            Escuelas: selectedFeature.properties.escuela,
            Gasolinerias: selectedFeature.properties.gasolineria,
            Invernaderos: selectedFeature.properties.invernadero,
            Mercados: selectedFeature.properties.mercado,
            Plazas: selectedFeature.properties.plaza,
            Ruinas: selectedFeature.properties.ruina,
            Subestaciones_Electricas: selectedFeature.properties.subestaciones_electricas,
            Templos: selectedFeature.properties.templo,
            Parques: selectedFeature.properties.parque,
            Cultivos: selectedFeature.properties.cultivo,
            Construcciones: selectedFeature.properties.construccion, 
            z_valor: selectedFeature.properties.z_valor,
            categoria: selectedFeature.properties.categoria,
            codigo: selectedFeature.properties.codigo
          }:null
        };
    },[geoData,selectedFeature]); 
    //logica extraer datos manzanas
    const cantidades = useMemo(() => {
        if(!geoData?.features?.length) return {
          total: 0,
          globalPaneles: 0,
          globalConstrucciones: 0,
          seleccionada: null
        };

        const features = geoData.features
            const globales = features.reduce((acc: any, f:any) => {
              acc.paneles += (f.properties.cant_panel || 0);
              acc.construcciones += (f.properties.cant_const || 0);
              return acc;
            },{paneles: 0, construcciones: 0});
            return {
              total: features.length,
              globalPaneles: globales.paneles,
              globalConstrucciones: globales.construcciones,
              seleccionada: selectedFeature?{
                codigo: selectedFeature.properties.codigo,
                paneles: selectedFeature.properties.cant_panel,
                construcciones:selectedFeature.properties.cant_const
              }:null
            };
    },[geoData, selectedFeature]);
    

  useEffect(() => {
    const fetchLocalData = async () => {
      setLoading(true);
      try {
        // 1. Extraer de IndexedDB
        const localData = await get('datos_geo_completos');
        const nombreCapa = localStorage.getItem("capa_activa") || "Capa Seleccionada";
        setCapaActiva(nombreCapa);

        if (!localData) {
          setLoading(false);
          return;
        }

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
    

    const esPredio = features[0]?.properties?.elemento === "Predios" || 
                     !features[0]?.properties?.material_tipo;

    if (esPredio) {
      return { total, esPredio: true, materiales: [], pisos: [] };
    }

    const materialCounts: Record<string, number> = {};
    const pisoCounts: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0 };

    for (let i = 0; i < features.length; i++) {
      const props = features[i].properties;
      
      //CONTEO DE MATERIALES
      const m = (MATERIALES_DICT as any)[props.material_tipo] || "No especificado";
      materialCounts[m] = (materialCounts[m] || 0) + 1;

      //CONTEO DE PISOS
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

  return { 
    loading, 
    filteredData, 
    stats, 
    selectedMaterial, 
    setSelectedMaterial, 
    hoveredPiso, 
    setHoveredPiso, 
    capaActiva,
    predios_cantidad,
    cantidades,
    setSelectedFeature,
    selectedFeature,
    poblacion,
    viviendas,
    prediosCartografia,
    prediosPadron
   };
};