import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Box, Button, Typography, List, ListItem, ListItemText, ListItemIcon, Paper } from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture'; // Иконка для ферм
import GrassIcon from '@mui/icons-material/Grass'; // Иконка для линий животных
import PetsIcon from '@mui/icons-material/Pets'; // Иконка для пород

import FarmsList from './Shelf/FarmsList';
import BreedsList from './Shelf/BreedsList';
import BranchesList from './Shelf/BranchesList'; // Переименуем этот компонент позже

const Books = () => {
    return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}
        >
            <Paper elevation={3} sx={{ padding: 4, width: '80%', maxWidth: '500px' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Выберите справочник
                </Typography>
                <List>
                    <ListItem button component={Link} to="/books/farms">
                        <ListItemIcon>
                            <AgricultureIcon />
                        </ListItemIcon>
                        <ListItemText primary="Фермы" />
                    </ListItem>
                    <ListItem button component={Link} to="/books/lines">
                        <ListItemIcon>
                            <GrassIcon />
                        </ListItemIcon>
                        <ListItemText primary="Линии животных" /> {/* Замена текста */}
                    </ListItem>
                    <ListItem button component={Link} to="/books/breeds">
                        <ListItemIcon>
                            <PetsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Породы" />
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
};

export default function BooksApp() {
    return (
        <Routes>
            <Route path="/books" element={<Books />} />
            <Route path="/books/farms" element={<FarmsList />} />
            <Route path="/books/lines" element={<BranchesList />} /> {/* Заменяем путь на lines */}
            <Route path="/books/breeds" element={<BreedsList />} />
        </Routes>
    );
}
