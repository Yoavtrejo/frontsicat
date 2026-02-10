import {get} from 'idb-keyval';
import {MATERIALES_DICT} from '@/utils/mappings';

export const geoService = {
    async getEnrichedData() {
        const datosBrutos = await get('datos_geo_completos');
        if (!datosBrutos) return null;

        const rawFeatures = datosBrutos.results?.features || datosBrutos.features || [];

        return rawFeatures.map((f: any) => ({
            ...f,
            properties: {
                ...f.properties,
                material_nombre: (MATERIALES_DICT as any)[f.properties.material_tipo] || "No especificado",
                numero_pisos: parseInt(f.properties.numero_pisos) || 1
            }
        }));
    }
};