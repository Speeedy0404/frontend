import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, List, ListItem, TextField, ListItemText, Paper } from '@mui/material';
import axiosInstance from '../../../axiosConfig';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL
const BranchesList = () => {
    const [branches, setBranches] = useState([]);
    const [search, setSearch] = useState(''); // Поле для поиска по названию
    const navigate = useNavigate();

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await axiosInstance.get(`${apiUrl}/api/v1/branches-book`);
            setBranches(response.data);
        } catch (error) {
            console.error('Ошибка при получении линий:', error);
        }
    };

    // Фильтрация по названию линии
    const filteredBranches = branches.filter(branch =>
        branch.branch_name.toLowerCase().includes(search.toLowerCase())
    );

    const goBack = () => {
        navigate('/books');
    };

    return (
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ padding: 4, width: '80%', maxWidth: '700px' }}>
                <Typography variant="h4" align="center" gutterBottom>Линии животных</Typography>
                <Button onClick={goBack} variant="contained" sx={{ mb: 2 }}>Назад к выбору справочников</Button>

                {/* Поле для поиска */}
                <TextField
                    label="Поиск по названию линии"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <List>
                    {filteredBranches.map(branch => (
                        <ListItem key={branch.branch_code}>
                            <ListItemText primary={branch.branch_name} secondary={`Код: ${branch.branch_code}, Комплекс: ${branch.kompleks}`} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default BranchesList;
