const API_URL = 'http://127.0.0.1:8000/api';

export const gisService = { 
    async fetchLayerData(endpoint: string, _token: string) {
        const url = `${API_URL}/${endpoint}/`;

        console.log("🚀 Iniciando descarga de capa:", endpoint); 
        
        try {
            const response = await fetch(url, { 
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${_token}`, 
                    'Content-Type': 'application/json',
                },
            });

            // Si el servidor tarda mucho, puede que la respuesta llegue vacía o mal
            if (response.status === 401) {
                console.error("❌ Error 401: El token ya no sirve.");
                throw new Error('AUTH_ERROR');
            }

            if (response.status === 500) {
                console.error("❌ Error 500: El servidor explotó procesando los datos.");
                throw new Error('SERVER_ERROR');
            }

            if (!response.ok) {
                throw new Error(`HTTP_ERROR_${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Datos recibidos con éxito");
            return data;

        } catch (error: any) {
            console.error("🔥 Error en fetchLayerData:", error.message);
            throw error; // Re-lanzamos para que el componente decida qué hacer
        }
    }
}