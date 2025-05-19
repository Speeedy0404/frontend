// components/AnimalTableDialog.jsx
import React from "react";
import { Dialog, Box, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import AnimalDetails from "../../Animals/AnimalDetails";

const AnimalTableDialog = ({ open, onClose, selectedAnimal, isDarkMode }) => {
  return (
    <Dialog open={open} onClose={onClose} fullScreen sx={{
      p: 2,
      '& .MuiDialog-paper': {
        m: { xs: 1, sm: 2 },
        width: '100%',
        maxWidth: 'md',
        borderRadius: 2,
        p: { xs: 1, sm: 3 },
        bgcolor: isDarkMode ? '#424242' : '#fff',
        overflowY: 'auto'
      }
    }}>
      <Box className={isDarkMode ? 'dark-mode' : ''} sx={{ position: 'relative' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, color: isDarkMode ? '#fff' : 'inherit' }}>
          <CloseIcon />
        </IconButton>
        {selectedAnimal && (
          <AnimalDetails
            animalType="bull"
            animaluniq_key={selectedAnimal.uniq_key}
            pin={true}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default AnimalTableDialog;
