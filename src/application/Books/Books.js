import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Paper } from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import GrassIcon from '@mui/icons-material/Grass';
import PetsIcon from '@mui/icons-material/Pets';

import FarmsList from './Shelf/FarmsList';
import BreedsList from './Shelf/BreedsList';
import BranchesList from './Shelf/BranchesList';
import { useTheme as useCustomTheme } from "../ThemeContext";

const Books = () => {
    const { isDarkMode } = useCustomTheme();

    return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: '80%',
                    maxWidth: '500px',
                    bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
                    color: isDarkMode ? 'grey.100' : 'text.primary'
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Выберите справочник
                </Typography>
                <List>
                    <ListItem button component={Link} to="/books/farms">
                        <ListItemIcon sx={{ color: isDarkMode ? 'grey.400' : 'inherit' }}>
                            <AgricultureIcon />
                        </ListItemIcon>
                        <ListItemText primary="Фермы" sx={{ color: isDarkMode ? 'grey.300' : 'text.primary' }} />
                    </ListItem>
                    <ListItem button component={Link} to="/books/lines">
                        <ListItemIcon sx={{ color: isDarkMode ? 'grey.400' : 'inherit' }}>
                            <GrassIcon />
                        </ListItemIcon>
                        <ListItemText primary="Линии животных" sx={{ color: isDarkMode ? 'grey.300' : 'text.primary' }} />
                    </ListItem>
                    <ListItem button component={Link} to="/books/breeds">
                        <ListItemIcon sx={{ color: isDarkMode ? 'grey.400' : 'inherit' }}>
                            <PetsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Породы" sx={{ color: isDarkMode ? 'grey.300' : 'text.primary' }} />
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
};

export default function BooksApp() {
    const { isDarkMode } = useCustomTheme();
    return (
        <Routes>
            <Route path="/books" element={<Books />} />
            <Route path="/books/farms" element={<FarmsList isDarkMode={isDarkMode} />} />
            <Route path="/books/lines" element={<BranchesList isDarkMode={isDarkMode} />} />
            <Route path="/books/breeds" element={<BreedsList isDarkMode={isDarkMode} />} />
        </Routes>
    );
}