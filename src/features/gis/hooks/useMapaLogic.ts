import { useMemo, useState, useEffect, useRef }  from "react";
import {MapRef} from 'react-map-gl/maplibre';
import { MATERIALES_DICT } from "@/utils/mappings";


export const useMapaLogic = (datosGeo: any, highlightPiso: string | number | null, customColors?: Record<string, string>) => {
    const mapRef = useRef<MapRef>(null);
    const [infoPopup, setInfoPopup] = useState<any | null>(null);

    //colores
    const colorExpression = useMemo(() => {
        const matchExpression: any[] = ['match', ['get', 'material_tipo']];

        Object.entries(MATERIALES_DICT).forEach(([codigo, nombre]) => {
            const baseColor = (customColors && customColors[nombre as string]) || '#94a3b8';

            if (highlightPiso) {
                const condicionalColor = [
                    'case',
                    highlightPiso === '4'
                        ? ['>=', ['to-number', ['coalesce', ['get', 'numero_pisos'], 0]], 4]
                        : ['==', ['to-number', ['coalesce', ['get', 'numero_pisos'], 0]], Number(highlightPiso)],
                    baseColor,
                    'rgba(10, 126, 47, 0.2)' // Un verde sutil para lo que NO está resaltado
                ];
                matchExpression.push(codigo, condicionalColor);
            } else {
                matchExpression.push(codigo, baseColor);
            }
        });
        
        matchExpression.push('#0073FF'); // Color por defecto final
        return matchExpression;
    }, [customColors, highlightPiso]);

    //redireccionar automaticamente
    useEffect(() => {
        if(datosGeo?.features?.length > 0 && mapRef.current){
            const feature = datosGeo.features[0];
            const coordinates = feature.geometry.type === 'Point'
                ? feature.geometry.coordinates
                :feature.geometry.coordinates[0][0][0] || feature.geometry.coordinates[0][0];
            mapRef.current.flyTo({ 
                center: [Number(coordinates[0]), Number(coordinates[1])],
                zoom: 15, pitch: 60, duration: 3000, essential: true 
            });
        }
    }, [datosGeo]);

    const onMapClick = (event: any) => {
        const features = event.features?.[0];
        if(features?.layer.id === 'construcciones-3d'){
            setInfoPopup({
                longitude: event.lngLat.lng,
                latitude: event.lngLat.lat,
                properties: features.properties
            });
        }else{
            setInfoPopup(null);
        }
    };
    
   return {
        mapRef,
        infoPopup,
        setInfoPopup,
        colorExpression,
        onMapClick
    };
};