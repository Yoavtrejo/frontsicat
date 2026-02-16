import { useMemo, useState, useEffect, useRef } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { MATERIALES_DICT } from '@/utils/mappings';

export const useMapaLogic = (datosGeo: any, highlightPiso: any, customColors: any) => {
    const mapRef = useRef<MapRef>(null);
    const [infoPopup, setInfoPopup] = useState<any | null>(null);

    const colorExpression = useMemo(() => {
        const features = datosGeo?.features || [];
        if (features.length > 0 && features[0]?.properties?.elemento === "Predios") {
            return 'rgba(16, 185, 129, 0.6)'; 
        }

        const matchExpression: any[] = ['match', ['get', 'material_tipo']];
        Object.entries(MATERIALES_DICT).forEach(([codigo, nombre]) => {
            const baseColor = customColors?.[nombre as string] || '#94a3b8';
            if (highlightPiso) {
                const valorH = Number(highlightPiso);
                matchExpression.push(codigo, [
                    'case',
                    valorH === 4 ? ['>=', ['to-number', ['get', 'numero_pisos']], 4] : ['==', ['to-number', ['get', 'numero_pisos']], valorH],
                    baseColor, 'rgba(200, 200, 200, 0.2)'
                ]);
            } else {
                matchExpression.push(codigo, baseColor);
            }
        });
        matchExpression.push('#94a3b8');
        return matchExpression;
    }, [customColors, highlightPiso, datosGeo]);

    useEffect(() => {
        const map = mapRef.current?.getMap();
        const features = datosGeo?.features;
        if (!map || !features?.length) return;

        const fit = () => {
            let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
            features.forEach((f: any) => {
                const coords = f.geometry.coordinates.flat(Infinity);
                for (let i = 0; i < coords.length; i += 2) {
                    if (coords[i] < minLng) minLng = coords[i];
                    if (coords[i+1] < minLat) minLat = coords[i+1];
                    if (coords[i] > maxLng) maxLng = coords[i];
                    if (coords[i+1] > maxLat) maxLat = coords[i+1];
                }
            });
            map.fitBounds([minLng, minLat, maxLng, maxLat], { padding: 50, duration: 2000, essential: true });
        };

        if (map.isStyleLoaded()) map.once('idle', fit);
        else map.once('load', fit);
    }, [datosGeo]);

    return { mapRef, colorExpression, infoPopup, setInfoPopup };
};