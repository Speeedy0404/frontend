import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Box,
  Paper,
  TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PreviewIcon from '@mui/icons-material/Preview';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';

const Reports = () => {
  const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Загрузка списка хозяйств при загрузке компонента
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axiosInstance.get('farms-reports');
        setFarms(response.data.farms);
        setFilteredFarms(response.data.farms);  // Изначально показываем все хозяйства
      } catch (error) {
        console.error('Ошибка при загрузке списка хозяйств:', error);
      }
    };
    fetchFarms();
  }, []);

  // Загрузка отчетов при выборе хозяйства
  const fetchReports = async (farm) => {
    try {
      const response = await axiosInstance.get(`farms-reports/${farm}`);
      setReports(response.data.reports);
      setSelectedFarm(farm);  // Устанавливаем выбранное хозяйство
    } catch (error) {
      console.error('Ошибка при загрузке отчетов:', error);
    }
  };

  // Функция для предпросмотра отчета
  const handlePreview = async (report) => {
    try {
      const response = await axiosInstance.get(`get-pdf-report/${report}`, {
        responseType: 'blob', // Expecting a blob
      });
  
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);
  
      // Open the PDF in a new tab
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Ошибка при предпросмотре отчета:', error);
    }
  };
  
  // Функция для скачивания отчета
  const handleDownload = async (report) => {
    try {
      const response = await axiosInstance.get(`get-pdf-report/${report}`, {
        responseType: 'blob' // Получаем файл в формате blob
      });

      // Создаем URL для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', report); // Указываем имя файла
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Ошибка при скачивании отчета:', error);
    }
  };

  // Функция для печати отчета
  const handlePrint = async (report) => {
    try {
      const response = await axiosInstance.get(`get-pdf-report/${report}`, {
        responseType: 'blob', // Expecting a blob
      });
  
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);
  
      // Open the PDF in a new tab for printing
      const printWindow = window.open(fileURL, '_blank');
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      console.error('Ошибка при печати отчета:', error);
    }
  };
  

  // Функция возврата к списку хозяйств
  const handleBack = () => {
    setSelectedFarm(null);
    setReports([]);
  };

  // Обработка ввода в поле поиска
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Фильтрация хозяйств по введенному запросу
    const filtered = farms.filter(farm => farm.toLowerCase().includes(query));
    setFilteredFarms(filtered);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Отчеты по хозяйствам
        </Typography>

        {/* Если хозяйство не выбрано, отображаем список хозяйств */}
        {!selectedFarm ? (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#333', mb: 2, fontWeight: 'bold' }}>
              Список хозяйств
            </Typography>
            {/* Поле для поиска */}
            <TextField
              label="Поиск хозяйства"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ mb: 2 }}
            />
            <List sx={{ maxHeight: '400px', overflow: 'auto', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              {filteredFarms.map(farm => (
                <ListItem
                  button
                  key={farm}
                  onClick={() => fetchReports(farm)}
                  sx={{
                    mb: 1,
                    backgroundColor: '#e3f2fd',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#bbdefb',
                    },
                  }}
                >
                  <ListItemText
                    primary={farm}
                    sx={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Box>
            {/* Если выбрано хозяйство, показываем его название и список отчетов */}
            <Box display="flex" alignItems="center" mb={3}>
              <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {`Отчеты для хозяйства: ${selectedFarm}`}
              </Typography>
            </Box>

            <Box>
              {reports.length > 0 ? (
                <List>
                  {reports.map((report) => (
                    <Card key={report} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{report}</Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton onClick={() => handlePreview(report)} color="primary">
                          <PreviewIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDownload(report)} color="secondary">
                          <DownloadIcon />
                        </IconButton>
                        <IconButton onClick={() => handlePrint(report)} color="default">
                          <PrintIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                  Отчеты отсутствуют
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Reports;
