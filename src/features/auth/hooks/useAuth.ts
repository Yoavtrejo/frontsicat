// features/auth/hooks/useAuth.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';

export const useAuth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.login(email, password);
            
            if (data.access) {
                const tokenRecibido = data.access;
                
                document.cookie = `access_token=${tokenRecibido}; path=/; samesite=strict; max-age=28800`;
                
                localStorage.setItem('access_token', tokenRecibido);
                localStorage.setItem('user_role', data.user.rol);
                localStorage.setItem('user_name', data.user.username);
                localStorage.setItem('user_email', data.user.email);

                console.log("Login exitoso. Bienvenido:", data.user.username);
                
                router.push('/dashboard'); 
            }
        } catch (err: any) {
            setError(err.message || 'No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return { 
        email, setEmail, 
        password, setPassword, 
        error, loading, 
        handleSubmit 
    };
};