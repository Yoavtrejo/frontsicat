// src/services/gisService.ts
const API_URL = 'http://127.0.0.1:8000/api';

export const gisService = { 
    async fetchLayerData(endpoint: string, _token: string) {
        // Aseguramos que la URL termine en / para evitar redirects de Django
        const url = `${API_URL}/${endpoint}/`;

        console.log("🚀 Enviando petición a:", url); 
        
        const response = await fetch(url, { 
            method: 'GET',
            headers: {
                // Comentado para evitar el error 401 mientras probamos
                // 'Authorization': `Bearer ${_token}`, 
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 401) {
            throw new Error('El servidor respondió con 401 (No autorizado).');
        }

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo obtener la capa.`);
        }

        return response.json(); 
    }
}