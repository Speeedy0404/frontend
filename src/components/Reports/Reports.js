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
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PreviewIcon from '@mui/icons-material/Preview';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import * as XLSX from 'xlsx';

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
      const response = await axiosInstance.get(`get-report/${report}.pdf`, {
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

  // const handlePreview = async (report) => {
  //   try {
  //     const response = await axiosInstance.get(`get-pdf-report/${report}`, {
  //       responseType: 'arraybuffer',
  //     });

  //     const data = new Uint8Array(response.data);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];

  //     // Преобразование в HTML
  //     const html = XLSX.utils.sheet_to_html(sheet);
  //     const previewWindow = window.open('', '_blank');
  //     previewWindow.document.write(html);
  //   } catch (error) {
  //     console.error('Ошибка при предпросмотре отчета:', error);
  //   }
  // };

  // Функция для скачивания отчета
  const handleDownload = async (report) => {
    try {
      const response = await axiosInstance.get(`get-report/${report}.pdf`, {
        responseType: 'blob' // Получаем файл в формате blob
      });

      // Создаем URL для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report}.pdf`); // Указываем имя файла
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
      const response = await axiosInstance.get(`get-report/${report}.pdf`, {
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

  // Функция для скачивания отчета
  const handleDownloadExcel = async (report) => {
    try {
      const response = await axiosInstance.get(`get-report/${report}.xlsx`, {
        responseType: 'blob' // Получаем файл в формате blob
      });

      // Создаем URL для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report}.xlsx`); // Указываем имя файла
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Ошибка при скачивании отчета:', error);
    }
  };

  const handlePreviewExcel = async (report) => {
    console.log(report)
    try {
      const response = await axiosInstance.get(`get-report/${report}.xlsx`, {
        responseType: 'arraybuffer',
      });
      console.log(response.data)
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Преобразование в HTML
      const html = XLSX.utils.sheet_to_html(sheet);
      const previewWindow = window.open('', '_blank');
      previewWindow.document.write(html);
    } catch (error) {
      console.error('Ошибка при предпросмотре отчета:', error);
    }
  };

  const handleDelete = async (path) => {
    if (window.confirm("Вы уверены, что хотите удалить этот отчёт?")) {
      try {
        const response = await axiosInstance.delete(`get-report/${path}.pdf`);

        if (response.data.success) {
          // Если удаление успешно, обновляем список отчетов
          setReports((prevReports) => prevReports.filter((report) => report.path !== path));
        } else {
          // Если сервер вернул false
          alert("Нет доступа для удаления отчета.");
        }
      } catch (error) {
        console.error("Ошибка при удалении отчета:", error);
        alert("Произошла ошибка при удалении отчета.");
      }
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
                    <Card key={report.id} variant="outlined" sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', p: 2 }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {report.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Автор: {report.user_name} | Дата создания: {isNaN(new Date(report.created_at)) ? 'Invalid Date' : new Date(report.created_at).toLocaleDateString()}
                        </Typography>
                      </CardContent>

                      <Box sx={{ textAlign: 'center', mx: 2 }}>
                        <Typography variant="body2" sx={{ bgcolor: 'grey.200', p: 0.5, borderRadius: '4px' }}>
                          PDF
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                          <IconButton onClick={() => handlePreview(report.path)} color="primary">
                            <PreviewIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDownload(report.path)} color="secondary">
                            <DownloadIcon />
                          </IconButton>
                          <IconButton onClick={() => handlePrint(report.path)} color="default">
                            <PrintIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: 'center', mx: 2 }}>
                        <Typography variant="body2" sx={{ bgcolor: 'grey.200', p: 0.5, borderRadius: '4px' }}>
                          XLSX
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                          <IconButton onClick={() => handlePreviewExcel(report.path)} color="primary">
                            <PreviewIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDownloadExcel(report.path)} color="secondary">
                            <DownloadIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: 'center', mx: 2 }}>
                        <IconButton onClick={() => handleDelete(report.path)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
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
