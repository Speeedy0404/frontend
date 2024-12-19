import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, List, ListItem, TextField, ListItemText, Paper, CircularProgress } from '@mui/material';
import axiosInstance from '../../../axiosConfig';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL
const FarmsList = () => {
    const [loading, setLoading] = useState(false);
    const [farms, setFarms] = useState([]);
    const [search, setSearch] = useState(''); // Поле для поиска по названию
    const [filters, setFilters] = useState({ region: '', area: '' });
    const navigate = useNavigate();

    // Получение всех данных о фермах при загрузке компонента
    useEffect(() => {
        fetchFarms();
    }, []);

    // Функция для запроса данных
    const fetchFarms = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`${apiUrl}/api/v1/farms-book`, { params: filters });
            setFarms(response.data);
            setLoading(false)
        } catch (error) {
            console.error('Ошибка при получении ферм:', error);
        }
    };

    // Обработка фильтров
    const handleInputChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value,
        });
    };

    const handleFilterSubmit = (event) => {
        event.preventDefault();
        fetchFarms(); // Запрос данных с фильтрами
    };

    // Фильтрация по названию фермы
    const filteredFarms = farms.filter(farm =>
        farm.norg.toLowerCase().includes(search.toLowerCase())
    );

    const goBack = () => {
        navigate('/books');
    };

    return (
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ padding: 4, width: '80%', maxWidth: '700px' }}>
                <Typography variant="h4" align="center" gutterBottom>Фермы</Typography>
                <Button onClick={goBack} variant="contained" sx={{ mb: 2 }}>Назад к выбору справочников</Button>

                {/* Поле для поиска */}
                <TextField
                    label="Поиск по названию фермы"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* Фильтры */}
                {/* <form onSubmit={handleFilterSubmit} style={{ marginBottom: '20px' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Регион"
                            name="region"
                            value={filters.region}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            label="Область"
                            name="area"
                            value={filters.area}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                        />
                    </Box>
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Применить фильтр</Button>
                </form> */}
                {loading && (
                    <div style={{ textAlign: 'center' }}>
                        <Typography variant="h6">Загрузка ...</Typography>
                        <CircularProgress />
                    </div>
                )}
                <List>
                    {filteredFarms.map(farm => (
                        <ListItem key={farm.korg}>
                            <ListItemText primary={farm.norg} secondary={`Регион: ${farm.region}, Область: ${farm.area}, Код хозяйства: ${farm.kter}, Код района: ${farm.kter}`} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default FarmsList;
