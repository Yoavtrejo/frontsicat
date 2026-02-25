const API_URL = 'http://127.0.0.1:8000/api';

export const gisService = { 
    async fetchLayerData(endpoint: string, _token: string) {
        const url = `${API_URL}/${endpoint}/`;
 
        
        try {
            const response = await fetch(url, { 
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${_token}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                throw new Error('AUTH_ERROR');
            }

            if (response.status === 500) {
                throw new Error('SERVER_ERROR');
            }

            if (!response.ok) {
                throw new Error(`HTTP_ERROR_${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error: any) {
            throw error; 
        }
    }
}