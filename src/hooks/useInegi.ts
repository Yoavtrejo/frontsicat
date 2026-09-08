import { useEffect, useState } from "react";
import { getIndicadorINEGI } from "../services/Yucatan";

export function useInegiIndicador(indicador: string, entidad: string) {
  const [valor, setValor] = useState<number | null>(null);

  useEffect(() => {
    getIndicadorINEGI(indicador, entidad).then(data => {
      const series = data.Series ?? data.series ?? [];
      const observaciones = series[0]?.OBSERVATIONS ?? series[0]?.observaciones ?? [];
      const ultimo = observaciones.at(-1);

      if (ultimo?.OBS_VALUE) {
        setValor(Number(ultimo.OBS_VALUE));
      } else if (ultimo?.OBS_VALUE === 0) {
        setValor(0);
      }
    }).catch(() => {
      // Silenciar error si no hay token o falla la API
    });
  }, [indicador, entidad]);

  return valor;
}
