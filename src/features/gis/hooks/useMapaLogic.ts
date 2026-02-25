import { useMemo, useState, useEffect, useRef } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { MaterialList } from "@/features/analytics/components/MaterialList";
import bbox from "@turf/bbox";
import { MATERIALES_DICT } from "@/utils/mappings";

export const useMapaLogic = (datosGeo: any, highlightPiso: any, customColors: any) => {
    const mapRef = useRef<MapRef>(null);
    const [infoPopup, setInfoPopup] = useState<any | null>(null);
   
    const colorExpression = useMemo(() => {
        const features = datosGeo?.features || [];
        if (features.length > 0 && features[0]?.properties?.elemento === "Predios"){
            return 'rgba(0, 238, 255, 0.6)';
        }

        const matchExpression: any[] = ['match', ['get', 'material_tipo']];
        Object.entries(MATERIALES_DICT).forEach(([codigo, nombre]) => {
            const baseColor = customColors?.[nombre as string] || '#260049';
            if (highlightPiso){
                const valorH = Number(highlightPiso);
                matchExpression.push(codigo, [
                    'case',
                    valorH === 4 ? ['>=', ['to-number', ['get', 'numero_pisos']], 4] : ['==', ['to-number',['get', 'numero_pisos']], valorH],
                    baseColor, 'rgba(200,200,200,0.2)'
                ]);
            }else {
                matchExpression.push(codigo, baseColor);
            }
        });
        matchExpression.push('#94a3b8') ;
        return matchExpression;
    },[customColors, highlightPiso, datosGeo]);
    
    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (!map || !datosGeo?.features?.length) return;

        const bounds = bbox(datosGeo) as [number, number, number, number];

        const fit = () => {
            map.fitBounds(bounds, {padding: 50, duration:3000, essential: true});
        };

        if (map.isStyleLoaded()) fit();
        else map.once('load', fit);
    },[datosGeo]);

    return {mapRef, colorExpression, infoPopup, setInfoPopup};

}