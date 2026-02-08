const API_URL = 'http://127.0.0.1:8000/api';

export const gisService = { 
    async fetchLayerData(endpoint: string, token: string) {
        const response = await fetch(`${API_URL}/${endpoint}/`, { 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al conectar con el servidor');
        }

        return response.json(); 
    }
}