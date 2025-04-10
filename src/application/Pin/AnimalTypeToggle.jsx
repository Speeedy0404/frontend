// src/application/Pin/AnimalTypeToggle.jsx

import React from 'react';
import { Button, Box } from '@mui/material';

const AnimalTypeToggle = ({ animalType, setAnimalType }) => {
  return (
    <Box className="animal-type-toggle" sx={{ mb: 2 }}>
      <Button variant={animalType === "cows" ? "contained" : "outlined"} onClick={() => setAnimalType("cows")}>
        Коровы
      </Button>
      <Button variant={animalType === "calves" ? "contained" : "outlined"} onClick={() => setAnimalType("calves")} sx={{ ml: 1 }}>
        Молодняк
      </Button>
    </Box>
  );
};

export default AnimalTypeToggle;
