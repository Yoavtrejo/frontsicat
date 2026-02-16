'use client';

import { Map, Source, Layer, NavigationControl, Popup } from 'react-map-gl/maplibre';
import { useState, useMemo } from 'react'; 
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapaLogic } from '../hooks/useMapaLogic';
import { MATERIALES_DICT } from "@/utils/mappings";

const MAP_STYLES = {
    POSITRON: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    DARK: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    VOYAGER: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
};

export default function Mapa(props: any) {
    const [estiloActivo, setEstiloActivo] = useState(MAP_STYLES.POSITRON);

    const { mapRef, infoPopup, setInfoPopup, colorExpression } = 
        useMapaLogic(props.datosGeo, props.highlightPiso, props.customColors);

    const geoJsonData = useMemo(() => {
        if (!props.datosGeo) return { type: "FeatureCollection", features: [] };
        if (props.datosGeo.results) return props.datosGeo.results;
        return props.datosGeo;
    }, [props.datosGeo]);

    const tieneDatos = geoJsonData?.features?.length > 0;

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-white/90 p-2 rounded-xl shadow-lg backdrop-blur-md border border-slate-200">
                <p className="text-[10px] font-bold text-slate-500 uppercase px-1">Mapa Base</p>
                <div className="flex gap-1">
                    {Object.entries(MAP_STYLES).map(([name, url]) => (
                        <button 
                            key={name}
                            onClick={() => setEstiloActivo(url)}
                            className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all ${
                                estiloActivo === url 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-transparent text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {name === 'DARK' ? 'Oscuro' : name === 'POSITRON' ? 'Claro' : 'Voyager'}
                        </button>
                    ))}
                </div>
            </div>

            <Map
                ref={mapRef}
                initialViewState={{ longitude: -101.62, latitude: 20.95, zoom: 12, pitch: 60 }}
                mapStyle={estiloActivo} 
                onClick={(e) => {
                    const feat = e.features && e.features[0];
                    if (feat) {
                        setInfoPopup({ 
                            longitude: e.lngLat.lng, 
                            latitude: e.lngLat.lat, 
                            properties: feat.properties 
                        });
                    } else {
                        setInfoPopup(null);
                    }
                }}
                interactiveLayerIds={['construcciones-3d']}
            >
                {tieneDatos && (
                    <Source 
                        id="catastro-data" 
                        type="geojson" 
                        data={geoJsonData}
                        key={`source-${geoJsonData.features.length}-${props.highlightPiso}`}
                    >
                        <Layer
                            id="construcciones-3d"
                            type="fill-extrusion"
                            paint={{
                                'fill-extrusion-color': colorExpression as any,
                                'fill-extrusion-height': [
                                    'interpolate', ['linear'], ['zoom'],
                                    14, 0,
                                    15, ['*', ['to-number', ['coalesce', ['get', 'numero_pisos'], 1]], 3.5]
                                ],
                                'fill-extrusion-base': 0,
                                'fill-extrusion-opacity': 0.85,
                                'fill-extrusion-color-transition': { duration: 300 }
                            }}
                        />
                    </Source>
                )}

                {infoPopup && (
                    <Popup 
                        longitude={infoPopup.longitude} 
                        latitude={infoPopup.latitude} 
                        onClose={() => setInfoPopup(null)}
                        closeButton={false}
                        anchor="bottom"
                        offset={10}
                    >
                        <div className="p-2 text-[11px] leading-tight min-w-[120px] bg-white text-slate-800">
                            <h3 className="font-bold border-b mb-1 pb-1 text-blue-700 uppercase tracking-tighter">
                                Detalle Urbano
                            </h3>
                            <p className="mb-1"><strong>Pisos:</strong> {infoPopup.properties.numero_pisos}</p>
                            <p className="text-slate-600 italic">
                                { (MATERIALES_DICT as any)[infoPopup.properties.material_tipo] || 
                                  infoPopup.properties.material_nombre || "No especificado" }
                            </p>
                        </div>
                    </Popup>
                )}
                
                <div className="absolute bottom-6 right-6">
                    <NavigationControl showCompass={true} />
                </div>
            </Map>
        </div>
    );
}