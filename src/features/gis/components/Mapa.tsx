'use client';

import React, { useState } from 'react';
import Map, { Source, Layer, NavigationControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapaLogic } from '../hooks/useMapaLogic'; 

const MAP_STYLES = {
    carto_dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    carto_light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    osm: 'https://tiles.openfreemap.org/styles/liberty',
};

interface MapaProps {
  datosGeo: any;
  highlightPiso?: string | number | null;
  mostrarRiesgos?: boolean;
  customColors?: Record<string, string>;
  onFeatureSelect: (feature: any | null) => void;
}

export default function Mapa({ datosGeo, highlightPiso, customColors, mostrarRiesgos, onFeatureSelect }: MapaProps) {
    const [baseStyle, setBaseStyle] = useState(MAP_STYLES.carto_dark);
    
    const { mapRef, colorExpression, infoPopup, setInfoPopup } = useMapaLogic(
        datosGeo, 
        highlightPiso, 
        customColors,
    );

    const esCapaPredios = datosGeo?.features?.[0]?.properties?.z_valor !== undefined;

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-sm p-2 rounded-xl border border-slate-700 shadow-xl">
                <select 
                    onChange={(e) => setBaseStyle(e.target.value)} 
                    className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer"
                >
                    <option value={MAP_STYLES.carto_dark}>Oscuro (Carto)</option>
                    <option value={MAP_STYLES.carto_light}>Claro (Carto)</option>
                    <option value={MAP_STYLES.osm}>OpenStreetMap</option>
                </select>
            </div>

            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: -89.62,
                    latitude: 20.96,
                    zoom: 15, 
                    pitch: 45 
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle={baseStyle}
                onClick={(e) => {
                    const feature = e.features && e.features[0];
                    if (feature) {
                        setInfoPopup({
                            lng: e.lngLat.lng,
                            lat: e.lngLat.lat,
                            ...feature.properties
                        });
                        onFeatureSelect(feature);
                    } else {
                        setInfoPopup(null);
                        onFeatureSelect(null);
                    }
                }}
                interactiveLayerIds={['capa-3d-extrusion']}
            >
                <NavigationControl position="bottom-right" />

                {datosGeo?.features?.length > 0 && (
                    <Source id="datos-source" type="geojson" data={datosGeo}>
                        <Layer
                            id="capa-3d-extrusion"
                            type="fill-extrusion"
                            paint={{
                                'fill-extrusion-height': esCapaPredios 
                                    ? ['get', 'z_valor'] 
                                    : ['*', ['get', 'numero_pisos'], 3.5],
                                'fill-extrusion-base': 0,
                                'fill-extrusion-color': colorExpression as any, 
                                'fill-extrusion-opacity': 0.9,
                                'fill-extrusion-vertical-gradient': true, 
                            }}
                        />
                        <Layer
                            id="capa-linea"
                            type="line"
                            paint={{
                                'line-color': '#ffffff',
                                'line-opacity': 0.2,
                                'line-width': 1
                            }}
                        />
                    </Source>
                )}

                {infoPopup && (
                    <Popup
                        longitude={infoPopup.lng}
                        latitude={infoPopup.lat}
                        onClose={() => setInfoPopup(null)}
                        anchor="bottom"
                        closeButton={false}
                        className="z-50"
                        maxWidth="300px"
                    >
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-2xl border border-slate-700 min-w-[150px]">
                            <p className="font-black text-blue-400 uppercase mb-2 border-b border-slate-800 pb-1">
                                {infoPopup.elemento || "Información del Predio"}
                            </p>
                            
                            <div className="space-y-1">
                                <p><span className="text-slate-400">Código:</span> <span className="font-mono">{infoPopup.codigo}</span></p>
                                
                                {esCapaPredios ? (
                                    <div className="mt-2 pt-2 border-t border-slate-800/50">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Equipamiento Cercano</p>
                                        <div className="grid grid-cols-1 gap-1">
                                            {infoPopup.escuela > 0 && <p className="text-emerald-400 flex items-center gap-1"> Escuela</p>}
                                            {infoPopup.parque > 0 && <p className="text-emerald-400 flex items-center gap-1"> Parque</p>}
                                            {infoPopup.templo > 0 && <p className="text-emerald-400 flex items-center gap-1"> Templo</p>}
                                            {infoPopup.aeropuerto > 0 && <p className="text-emerald-400 flex items-center gap-1"> Aeropuerto</p>}
                                            {infoPopup.cementerio > 0 && <p className="text-emerald-400 flex items-center gap-1"> Cementerio</p>}
                                            {infoPopup.gasolineria > 0 && <p className="text-emerald-400 flex items-center gap-1"> Gasolinerias</p>}
                                            {infoPopup.invernadero > 0 && <p className="text-emerald-400 flex items-center gap-1"> Invernaderos</p>}
                                            {infoPopup.mercado > 0 && <p className="text-emerald-400 flex items-center gap-1"> Mercado</p>}
                                            {infoPopup.plaza > 0 && <p className="text-emerald-400 flex items-center gap-1"> Plaza/Centro Comercial</p>}
                                            {infoPopup.ruina > 0 && <p className="text-emerald-400 flex items-center gap-1"> Ruina</p>}
                                            {infoPopup.subestaciones_electricas > 0 && <p className="text-emerald-400 flex items-center gap-1"> Subestaciones</p>}
                                            {infoPopup.construccion > 0 && <p className="text-blue-300">🏗️ {infoPopup.construccion} Construcciones</p>}
                                            {infoPopup.zonas_cultivo > 0 && <p className="text-emerald-400 flex items-center gap-1"> Zona de cultivo</p>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2 pt-2 border-t border-slate-800/50">
                                        <p><span className="text-slate-400">Material:</span> {infoPopup.material_nombre}</p>
                                        <p><span className="text-slate-400">Niveles:</span> {infoPopup.numero_pisos}</p>
                                    </div>
                                )}
                                
                                <div className="mt-2 py-1 px-2 bg-blue-500/10 rounded-md border border-blue-500/20 inline-block">
                                    <p className="font-bold text-blue-400">
                                        {esCapaPredios ? `${infoPopup.z_valor?.toFixed(2)}m Altura` : `${(infoPopup.numero_pisos * 3.5).toFixed(1)}m Est.`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}