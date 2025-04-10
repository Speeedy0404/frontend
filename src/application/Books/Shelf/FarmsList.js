import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, List, ListItem, TextField, ListItemText,
    Paper, CircularProgress, Pagination
} from '@mui/material';
import { styled } from '@mui/system';
import axiosInstance from '../../../axiosConfig';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;
const StyledPagination = styled(Pagination)(({ isDarkMode }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    '& .MuiPaginationItem-root': {
        color: isDarkMode ? '#fff' : 'inherit', // Белые стрелки в темной теме
    },
   
    '& .MuiPaginationItem-ellipsis, & .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast': {
        color: isDarkMode ? '#fff' : 'inherit', // Белые стрелки в темной теме
    },
}));
const FarmsList = ({ isDarkMode }) => {

    const [loading, setLoading] = useState(false);
    const [farms, setFarms] = useState([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ region: '', area: '' });
    const [page, setPage] = useState(1);
    const itemsPerPage = 10; // Количество ферм на странице
    const navigate = useNavigate();

    useEffect(() => {
        fetchFarms();
    }, []);

    const fetchFarms = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`${apiUrl}/api/v1/farms-book`, { params: filters });
            setFarms(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при получении ферм:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (event) => {
        setFilters({ ...filters, [event.target.name]: event.target.value });
    };

    const handleFilterSubmit = (event) => {
        event.preventDefault();
        fetchFarms();
    };

    const filteredFarms = farms.filter(farm =>
        farm.norg.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedFarms = filteredFarms.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const goBack = () => {
        navigate('/books');
    };

    return (
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: '80%',
                    maxWidth: '700px',
                    bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
                    color: isDarkMode ? 'grey.100' : 'text.primary'
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Фермы
                </Typography>
                <Button onClick={goBack} variant="contained" sx={{ mb: 2, bgcolor: isDarkMode ? 'grey.800' : 'primary.main' }}>
                    Назад к выбору справочников
                </Button>

                <TextField
                    label="Поиск по названию фермы"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        mb: 2,
                        input: { color: isDarkMode ? 'grey.300' : 'text.primary' },
                        label: { color: isDarkMode ? 'grey.400' : 'text.secondary' }
                    }}
                />

                {loading ? (
                    <Box sx={{ textAlign: 'center', my: 2 }}>
                        <Typography variant="h6">Загрузка ...</Typography>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <List>
                            {paginatedFarms.map(farm => (
                                <ListItem
                                    key={farm.korg}
                                    sx={{
                                        bgcolor: isDarkMode ? 'grey.800' : 'grey.100',
                                        borderRadius: 2,
                                        mb: 1,
                                        '&:hover': { bgcolor: isDarkMode ? 'grey.700' : 'grey.200' }
                                    }}
                                >
                                    <ListItemText
                                        primary={farm.norg}
                                        secondary={
                                            <Typography
                                                sx={{
                                                    color: isDarkMode ? 'grey.500' : 'text.secondary', // Цвет для secondary текста
                                                }}
                                            >
                                                {`Код хозяйства: ${farm.kter}, Код района: ${farm.kter}`}
                                            </Typography>
                                        }
                                        sx={{ color: isDarkMode ? 'grey.300' : 'text.primary' }}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <StyledPagination
                            count={Math.ceil(filteredFarms.length / itemsPerPage)}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default FarmsList;