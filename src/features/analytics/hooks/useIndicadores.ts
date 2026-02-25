"use client";

import { useState, useEffect } from "react";
import { getIndicadorINEGI } from "@/services/Yucatan";


export function useIndicadoresINEGI(estado: string){
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        prediosCartografia: 0,
        prediosPadron: 0,
    });

    useEffect(()=> {
        async function fetchData() {

            try{
                const res = await getIndicadorINEGI("8999998889, 8999998890", 
                    estado);

                    const series = res?.Series || [];

                    setData({
                        prediosCartografia: series[0]?.OBSERVATIONS?.[0]?.OBS_VALUE || 0,
                        prediosPadron: series[1]?.OBSERVATIONS?.[0]?.OBS_VALUE || 0,
                    });
            } catch(error){
                console.error("Error al cargar indicadores: ", error);
            }finally{
                setLoading(false);
            }
        }

        fetchData();
    }, [estado]);

    return { loading, data };
}