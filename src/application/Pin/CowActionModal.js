import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'

const CowActionModal = ({ open, onClose, onViewCard, onPin, isDarkMode }) => (
    <Modal open={open} onClose={onClose}>
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            backgroundColor: isDarkMode ? '#424242' : '#fff',
      
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    color: isDarkMode ? '#fff' : 'inherit',
                }}
            >
                <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="h2" align="center">
                Выберите действие
            </Typography>
            <Button variant="contained" onClick={onViewCard}>Посмотреть карточку</Button>
            <Button variant="outlined" onClick={onPin}>Индивидуальное закрепление</Button>
        </Box>
    </Modal>
);

export default CowActionModal;