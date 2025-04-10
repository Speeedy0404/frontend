import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, List, ListItem, TextField, ListItemText,
    Paper, CircularProgress, Pagination
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';


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

const BreedsList = ({ isDarkMode }) => {

    const [loading, setLoading] = useState(false);
    const [breeds, setBreeds] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10; // Количество элементов на странице
    const navigate = useNavigate();

    useEffect(() => {
        fetchBreeds();
    }, []);

    const fetchBreeds = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`${apiUrl}/api/v1/breeds-book`);
            setBreeds(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при получении пород:', error);
            setLoading(false);
        }
    };

    // Фильтрация по названию породы
    const filteredBreeds = breeds.filter(breed =>
        breed.breed_name.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedBreeds = filteredBreeds.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
                    Породы
                </Typography>
                <Button
                    onClick={goBack}
                    variant="contained"
                    sx={{
                        mb: 2,
                        bgcolor: isDarkMode ? 'grey.800' : 'primary.main'
                    }}
                >
                    Назад к выбору справочников
                </Button>

                <TextField
                    label="Поиск по названию породы"
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
                            {paginatedBreeds.map(breed => (
                                <ListItem
                                    key={breed.breed_code}
                                    sx={{
                                        bgcolor: isDarkMode ? 'grey.800' : 'grey.100',
                                        borderRadius: 2,
                                        mb: 1,
                                        '&:hover': { bgcolor: isDarkMode ? 'grey.700' : 'grey.200' }
                                    }}
                                >
                                    <ListItemText
                                        primary={breed.breed_name}
                                        secondary={
                                            <Typography
                                                sx={{
                                                    color: isDarkMode ? 'grey.500' : 'text.secondary'
                                                }}
                                            >
                                                {`Код: ${breed.breed_code}`}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <StyledPagination
                            count={Math.ceil(filteredBreeds.length / itemsPerPage)}
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

export default BreedsList;