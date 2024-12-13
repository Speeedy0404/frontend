import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Button,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Container,
    Stack
} from '@mui/material';
import debounce from 'lodash.debounce';

const IndividualPin = () => {
    const [farmName, setFarmName] = useState('');
    const [farmCode, setFarmCode] = useState('');
    const [farmSuggestions, setFarmSuggestions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const fetchSuggestions = async (queryParam, setSuggestions) => {
        try {
            const response = await axiosInstance.get(`farms/?${queryParam}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Ошибка получения подсказок', error);
        }
    };

    // Создаем отложенные функции для получения подсказок
    const fetchFarmSuggestions = useCallback(debounce((queryParam) => {
        fetchSuggestions(queryParam, setFarmSuggestions);
    }, 1000), []);

    useEffect(() => {
        if (farmName && !farmCode) {
            fetchFarmSuggestions(`search=${farmName}`);
        } else {
            setFarmSuggestions([]);
        }
    }, [farmName, farmCode, fetchFarmSuggestions]);

    useEffect(() => {
        if (farmCode && !farmName) {
            fetchFarmSuggestions(`search_code=${farmCode}`);
        } else {
            setFarmSuggestions([]);
        }
    }, [farmCode, farmName, fetchFarmSuggestions]);

  
    const handleFarmSelect = (farm) => {
        setFarmName(farm.norg);
        setFarmCode(farm.korg);
        setFarmSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!farmName || !farmCode) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await axiosInstance.post('individual-pin/', {
                farmName,
                farmCode,
            });
           
            navigate('/data-display-individual', {
                state: {
                    farmName: farmName,
                    farmCode: farmCode,
                    aggregatedData: response.data.aggregated_data,
                    density_data: response.data.density_data,
                }
            });

        } catch (error) {
            console.error('Ошибка отправки данных', error);
            alert('Ошибка отправки данных (Хозяйство не найдено)');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Container maxWidth="lg" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Закрепление
            </Typography>

            {isSubmitting ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        backgroundColor: '#f9f9f9',
                        borderRadius: 2,
                        p: 3,
                        boxShadow: 1
                    }}
                >
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">Выбрать хозяйство</Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Название хозяйства"
                                variant="outlined"
                                value={farmName}
                                onChange={(e) => setFarmName(e.target.value)}
                                placeholder="Введите название"
                                fullWidth
                            />
                            <TextField
                                label="Код хозяйства"
                                variant="outlined"
                                value={farmCode}
                                onChange={(e) => setFarmCode(e.target.value)}
                                placeholder="Введите код"
                                fullWidth
                            />
                        </Stack>
                        {farmSuggestions.length > 0 && (
                            <Box
                                sx={{
                                    mt: 2,
                                    maxHeight: 200, // Устанавливаем максимальную высоту
                                    overflowY: 'auto', // Добавляем прокрутку по вертикали
                                    backgroundColor: 'white',
                                    borderRadius: 1,
                                    boxShadow: 1
                                }}
                            >
                                <List>
                                    {farmSuggestions.map((farm) => (
                                        <ListItem button key={farm.korg} onClick={() => handleFarmSelect(farm)}>
                                            <ListItemText
                                                primary={farm.norg}
                                                secondary={farm.korg}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" color="primary">
                            ОК
                        </Button>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default IndividualPin;
