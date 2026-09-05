import { fetchApi } from '@/lib/api';

export const gisService = {
  async fetchLayerData(endpoint: string) {
    const url = `/${endpoint.replace(/^\/|\/$/g, '')}/`;
    return fetchApi<any>(url);
  },
};