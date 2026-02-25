import { useState, useEffect } from "react";
import { gisService } from "../services/gisService";
import {FeatureCollection} from 'geojson';

export const useFetchLayer = (endpoint: string, token: string) =>{
    const [data, setData] = useState<FeatureCollection | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await gisService.fetchLayerData(endpoint, token);
                const geojson = response.results ? response.results : response;
                setData(geojson);
            }catch(err: any){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        };
        if (endpoint)loadData();
    },[endpoint,token]);

    return {data, loading, error};

}