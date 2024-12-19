import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = ({ token, setToken }) => {
    const navigate = useNavigate();

    useEffect(() => {
        
        const handleLogout = async () => {
            if (!token) return;
            localStorage.removeItem('authToken');
            setToken(null);
            navigate('/');
           
            // try {
            //     await axios.post('https://918b-57-129-1-102.ngrok-free.app/auth/token/logout/', null, {
            //         headers: {
            //             'Authorization': `Token ${token}`
            //         }
            //     });
            //     localStorage.removeItem('authToken');
            //     setToken(null);
            //     navigate('/');
            //     window.location.reload(); // Обновление страницы
            // } catch (error) {
            //     console.error('Logout error:', error.response ? error.response.data : error.message);
            // }
        };

        handleLogout()

    }, [navigate, setToken]);

    return null; 
};

export default Logout;
