import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, List, ListItem, TextField, ListItemText, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
const apiUrl = process.env.REACT_APP_API_URL
const BreedsList = () => {
    const [breeds, setBreeds] = useState([]);
    const [search, setSearch] = useState(''); // Поле для поиска по названию породы
    const navigate = useNavigate();

    useEffect(() => {
        fetchBreeds();
    }, []);

    const fetchBreeds = async () => {
        try {
            const response = await axiosInstance.get(`${apiUrl}/api/v1/breeds-book`);
            setBreeds(response.data);
        } catch (error) {
            console.error('Ошибка при получении пород:', error);
        }
    };

    // Фильтрация по названию породы
    const filteredBreeds = breeds.filter(breed =>
        breed.breed_name.toLowerCase().includes(search.toLowerCase())
    );

    const goBack = () => {
        navigate('/books');
    };

    return (
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ padding: 4, width: '80%', maxWidth: '700px' }}>
                <Typography variant="h4" align="center" gutterBottom>Породы</Typography>
                <Button onClick={goBack} variant="contained" sx={{ mb: 2 }}>Назад к выбору справочников</Button>

                {/* Поле для поиска */}
                <TextField
                    label="Поиск по названию породы"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <List>
                    {filteredBreeds.map(breed => (
                        <ListItem key={breed.breed_code}>
                            <ListItemText primary={breed.breed_name} secondary={`Код: ${breed.breed_code}`} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default BreedsList;
