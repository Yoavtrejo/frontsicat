import bbox from "@turf/bbox";
import {FeatureCollection} from 'geojson'

export const getBBox = (data: FeatureCollection) => {
    return bbox(data) as [number, number, number, number];
}