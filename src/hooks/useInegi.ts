import { useEffect, useState } from "react";
import { getIndicadorINEGI } from "../services/Yucatan";

export function useInegiIndicador(indicador: string, entidad: string) {
  const [valor, setValor] = useState<number | null>(null);

  useEffect(() => {
    getIndicadorINEGI(indicador, entidad).then(data => {
      const observaciones = data.Series[0].OBSERVATIONS;
      const ultimo = observaciones.at(-1); // ✅ ahora sí es array

      setValor(Number(ultimo.OBS_VALUE));
    });
  }, [indicador, entidad]);

  return valor;
}
