import { useState } from "react";
import { useInegiIndicador } from "@/hooks/useInegi"; // Suponiendo que es global
import { PROYECTOS_DATA, Proyecto } from "@/hooks/proyectos";

export const useHomeData = () => {
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);
  const poblacionYucatan = useInegiIndicador("1002000001", "31");

  const proyectosConDatos = PROYECTOS_DATA.map((proy) => ({
    ...proy,
    habitantes: poblacionYucatan
      ? poblacionYucatan.toLocaleString()
      : "Cargando..."
  }));

  return {
    proyectosConDatos,
    selectedProject,
    setSelectedProject
  };
};