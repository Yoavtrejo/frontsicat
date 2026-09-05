import { fetchApi } from '@/lib/api';

export const authService = {
  async login(username: string, password: string) {
    const data = await fetchApi<{
      access: string;
      refresh: string;
      user: {
        id: number;
        username: string;
        email: string;
        rol: string;
      };
    }>('/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    return data;
  },

  async refreshToken(refresh: string) {
    return fetchApi<{ access: string }>('/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });
  },
};