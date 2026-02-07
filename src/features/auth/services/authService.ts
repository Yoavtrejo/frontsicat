const API_URL = 'http://127.0.0.1:8000/api';

export const authService = {
  async login(credentials: any) {
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error en la autenticación');
    }
    
    return response.json();
  }
};