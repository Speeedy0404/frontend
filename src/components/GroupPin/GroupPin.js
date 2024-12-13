import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import './GroupPin.css';

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
    Stack,
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import debounce from 'lodash.debounce';

const GroupPin = () => {
    const [farmName, setFarmName] = useState('');
    const [farmCode, setFarmCode] = useState('');
    const [gppName, setGppName] = useState('');
    const [gppCode, setGppCode] = useState('');
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

    const handleGppSelect = (event) => {
        const selectedGpp = gppOptions.find(gpp => gpp.code === event.target.value);
        setGppName(selectedGpp.name);
        setGppCode(selectedGpp.code);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!farmName || !farmCode || !gppName || !gppCode) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await axiosInstance.post('group-pin/', {
                farmName,
                farmCode,
                gppName,
                gppCode
            });
           
            navigate('/data-display', {
                state: {
                    aggregatedData: response.data.aggregated_data,
                    info: response.data.info,
                    density_data: response.data.density_data,
                }
            });

        } catch (error) {
            console.error('Ошибка отправки данных', error);
            alert('Ошибка отправки данных');
        } finally {
            setIsSubmitting(false);
        }
    };

    const gppOptions = [
        { name: 'РСУП БРЕСТСКОЕ ПП', code: '554553' },
        { name: 'РУП ВИТЕБСКОЕ ПП', code: '556905' },
        { name: 'РСУП ГОМЕЛЬСКОЕ ГПП', code: '73617' },
        { name: 'РУСП ГРОДНЕНСКОЕ ПП', code: '73643' },
        { name: 'РУСП МИНСКОЕ ПП', code: '556895' },
        { name: 'РУСПП МОГИЛЕВСКОЕ ПП', code: '73679' }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Групповое закрепление
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
                                    maxHeight: 200,
                                    overflowY: 'auto',
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

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">Выбрать ГПП</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="gpp-select-label">ГПП</InputLabel>
                            <Select
                                labelId="gpp-select-label"
                                value={gppCode} // Используем gppCode для хранения выбранного значения
                                onChange={handleGppSelect}
                                label="ГПП"
                            >
                                {gppOptions.map((gpp) => (
                                    <MenuItem key={gpp.code} value={gpp.code}>
                                        {gpp.name} - {gpp.code}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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

export default GroupPin;
