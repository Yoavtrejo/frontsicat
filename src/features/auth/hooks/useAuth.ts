import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';

export const useAuth = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.login(credentials);
            
            if (data.access) {  
                document.cookie = `access_token=${data.access}; path=/; max-age=86400; SameSite=Lax`; 
                localStorage.setItem('user_name', data.user.username);
    
                router.push('/home');
        } 
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
    };

    return { credentials, error, loading, handleChange, handleSubmit };
};