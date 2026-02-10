'use client';

import {Map, Source, Layer, NavigationControl, Popup} from 'react-map-gl/maplibre';
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapaLogic } from '../hooks/useMapaLogic';
import { MATERIALES_DICT } from '@/utils/mappings';


interface MapaProps {
    datosGeo: any;
    mostrarRiesgos: boolean;
    highlightPiso: string | number | null;
    customColors?: Record<string, string>;
}
//estilos de mapa
export const MAP_STYLE = {
    POSITRON: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    DARK_MATTER: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    VOYAGER: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
};

export default function Mapa(props: MapaProps){
    const {mapRef, infoPopup, setInfoPopup, colorExpression, onMapClick} = useMapaLogic(props.datosGeo, props.highlightPiso, props.customColors);

    return (
        <div className="w-full h-full relative">
            <Map
                ref={mapRef}
                initialViewState={{longitude: -102.55, latitude: 23.63, zoom: 4.5}}
                mapStyle={MAP_STYLE.POSITRON}
                onClick={onMapClick}
                interactiveLayerIds={['construcciones-3d']}>
                    {props.datosGeo?.features && props.mostrarRiesgos && (
                        <Source id="catastro" type="geojson" data={props.datosGeo}>
                            <Layer
                                id="construcciones-3d"
                                type="fill-extrusion"
                                paint={{
                                    'fill-extrusion-color': colorExpression as any,
                                    'fill-extrusion-height': ['*', ['to-number', ['get', 'numero_pisos']], 3.5],
                                    'fill-extrusion-base': 0,
                                    'fill-extrusion-opacity': 0.8
                                }}
                            />
                        </Source>
                    )}
                    {infoPopup && (
                    <Popup longitude={infoPopup.longitude} latitude={infoPopup.latitude} onClose={() => setInfoPopup(null)}>
                        <div className="p-2 text-slate-800 text-xs">
                        <h3 className="font-bold border-b mb-1">Detalle</h3>
                        <p>Pisos: {infoPopup.properties.numero_pisos}</p>
                        <p>Material: {(MATERIALES_DICT as any)[infoPopup.properties.material_tipo] || "N/A"}</p>
                        </div>
                    </Popup>
                    )}
                    <NavigationControl position="bottom-right" />
            </Map>
        </div>

    );
}