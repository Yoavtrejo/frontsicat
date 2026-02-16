const API_URL = 'http://127.0.0.1:8000/api';

export const authService = {
    async login(email: string, password: string) {
        const response = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: email,
                password: password
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Credenciales no válidas.');
        }

        return data; 
    }
};