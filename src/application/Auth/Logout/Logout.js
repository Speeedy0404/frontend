import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = ({ token, setToken, setUsername }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            if (!token) return;

            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/auth/token/logout/`, null, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            } catch (error) {
                console.error('Ошибка при выходе из системы:', error);
            } finally {
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUsername');
                setUsername(null);
                setToken(null);
                navigate('/');
            }
        };

        handleLogout();
    }, [navigate, setToken, setUsername, token]);


    return null;
};

export default Logout;
