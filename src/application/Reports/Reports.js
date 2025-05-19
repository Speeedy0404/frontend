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
  Button,
  Box,
  Paper,
  TextField,
  Grid,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PreviewIcon from '@mui/icons-material/Preview';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import * as XLSX from 'xlsx';
import { Building2, FileText, FileSpreadsheet, DownloadCloud } from 'lucide-react';
import SortIcon from '@mui/icons-material/Sort';
import { InputAdornment, MenuItem, Select, FormControl } from '@mui/material';
import { useTheme } from "../ThemeContext"; // Импортируем хук useTheme

const Reports = () => {
  const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const [reportSort, setReportSort] = useState('date');
  const [reportSearch, setReportSearch] = useState('');

  const sortedFilteredReports = reports
    .filter(report => report.title.toLowerCase().includes(reportSearch.toLowerCase()))
    .sort((a, b) => {
      if (reportSort === 'name') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

  // Загрузка списка хозяйств при загрузке компонента
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get('farms-reports');
        setFarms(response.data.farms);
        setFilteredFarms(response.data.farms);  // Изначально показываем все хозяйства
      } catch (error) {
        console.error('Ошибка при загрузке списка хозяйств:', error);
      } finally {
        setIsLoading(false)
      }
    };
    fetchFarms();
  }, []);

  // Загрузка отчетов при выборе хозяйства
  const fetchReports = async (farm) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`farms-reports/${farm}`);
      setReports(response.data.reports);
      setSelectedFarm(farm);  // Устанавливаем выбранное хозяйство
    } catch (error) {
      console.error('Ошибка при загрузке отчетов:', error);
    } finally {
      setIsLoading(false)
    }
  };

  // Функции для работы с отчетами (предпросмотр, скачивание, печать)
  const handlePreview = async (report) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`get-report/${report}.pdf`, {
        responseType: 'blob', // Expecting a blob
      });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Ошибка при предпросмотре отчета:', error);
    } finally {
      setIsLoading(false)
    }
  };

  const handleDownload = async (report) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`get-report/${report}.pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Ошибка при скачивании отчета:', error);
    } finally {
      setIsLoading(false)
    }

  };

  const handlePrint = async (report) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`get-report/${report}.pdf`, {
        responseType: 'blob',
      });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);
      const printWindow = window.open(fileURL, '_blank');
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      console.error('Ошибка при печати отчета:', error);
    } finally {
      setIsLoading(false)
    }
  };

  const handleDownloadExcel = async (report) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`get-report/${report}.xlsx`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Ошибка при скачивании отчета:', error);
    } finally {
      setIsLoading(false)
    }
  };

  const handlePreviewExcel = async (report) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`get-report/${report}.xlsx`, {
        responseType: 'arraybuffer',
      });
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const html = XLSX.utils.sheet_to_html(sheet);
      const previewWindow = window.open('', '_blank');
      previewWindow.document.write(html);
    } catch (error) {
      console.error('Ошибка при предпросмотре отчета:', error);
    } finally {
      setIsLoading(false)
    }
  };

  const handleDelete = async (path) => {
    if (window.confirm("Вы уверены, что хотите удалить этот отчёт?")) {
      try {
        const response = await axiosInstance.delete(`get-report/${path}.pdf`);
        if (response.data.success) {
          setReports((prevReports) => prevReports.filter((report) => report.path !== path));
        } else {
          alert("Нет доступа для удаления отчета.");
        }
      } catch (error) {
        console.error("Ошибка при удалении отчета:", error);
        alert("Произошла ошибка при удалении отчета.");
      }
    }
  };

  const handleBack = () => {
    setSelectedFarm(null);
    setReports([]);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = farms.filter(farm => farm.toLowerCase().includes(query));
    setFilteredFarms(filtered);
  };

  // Скачивание общего отчета
  const handleDownloadAllReports = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`get-report-general/${selectedFarm}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedFarm}_общий_отчет.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Ошибка при скачивании отчета:', error);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: isDarkMode ? "#121212" : "#fff", color: isDarkMode ? "#e0e0e0" : "#000", boxShadow: isDarkMode ? "0 2px 4px rgba(255, 255, 255, 0.2)" : "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: isDarkMode ? "#90caf9" : "#1976d2" }}>
          Отчеты по хозяйствам
        </Typography>

        {!selectedFarm ? (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? "white" : "black", mb: 2, fontWeight: 'bold' }}>
              Список хозяйств
            </Typography>
            <TextField
              label="Поиск хозяйства"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { color: isDarkMode ? '#90caf9' : '#000' } }}
            />
            <List sx={{ maxHeight: "400px", overflow: "auto", backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5", borderRadius: "8px" }}>
              {filteredFarms.map(farm => (
                <ListItem button key={farm} onClick={() => fetchReports(farm)} sx={{ mb: 1, backgroundColor: isDarkMode ? "#2a2a2a" : "#e3f2fd", borderRadius: "8px", '&:hover': { backgroundColor: isDarkMode ? "#333" : "#bbdefb" } }}>
                  <ListItemText
                    primary={
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={18} style={{ marginRight: 8 }} /> {farm}
                      </span>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Box>
            <Box display="flex" alignItems="center" mb={3}>
              <IconButton sx={{ mr: 2, color: isDarkMode ? 'grey.400' : 'inherit' }} onClick={handleBack} >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  wordBreak: 'break-word', // позволяет разбивать длинные слова
                  overflowWrap: 'anywhere', // для современных браузеров
                  maxWidth: '100%',
                  lineHeight: 1.4,
                }}
              >
                {`Отчеты для хозяйства: ${selectedFarm}`}
              </Typography>
            </Box>

            <Box>
              {reports.length > 0 ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleDownloadAllReports} sx={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: '50px', backgroundColor: isDarkMode ? "#1976d2" : "#1976d2", '&:hover': { backgroundColor: isDarkMode ? "#1565c0" : "#1565c0" } }}>
                      <DownloadCloud size={16} style={{ marginRight: 8 }} /> Скачать обобщённый отчет
                    </Button>
                  </Box>
                  <hr />
                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" gap={2} mb={2}>
                    <TextField
                      placeholder="Поиск по названию..."
                      variant="outlined"
                      size="small"
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      sx={{ width: { xs: '100%', sm: '60%' } }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
                      }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={reportSort}
                        onChange={(e) => setReportSort(e.target.value)}
                        startAdornment={<SortIcon sx={{ mr: 1 }} />}
                      >
                        <MenuItem value="date">По дате (новые)</MenuItem>
                        <MenuItem value="name">По алфавиту</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Grid container spacing={2}>
                    {sortedFilteredReports.length > 0 ? (
                      sortedFilteredReports.map((report) => (
                        <Grid item xs={12} sm={6} md={4} key={report.id}>
                          <Card variant="outlined" sx={{ display: "flex", flexDirection: "column", backgroundColor: isDarkMode ? "#1c1c1c" : "#fff", border: isDarkMode ? "1px solid #333" : "1px solid #ddd", mb: 2 }}>
                            <CardContent>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: isDarkMode ? "#90caf9" : "#000" }}>
                                {report.title}
                              </Typography>
                              <Typography variant="body2" color={isDarkMode ? 'white' : 'black'}>
                                Автор: {report.user_name} | Дата создания: {new Date(report.created_at).toLocaleDateString()}
                              </Typography>
                            </CardContent>
                            <Box sx={{ textAlign: 'center', mx: 2 }}>
                              <Typography variant="body2" sx={{ bgcolor: isDarkMode ? "grey.800" : "grey.200", color: isDarkMode ? "#e0e0e0" : "#000", p: 0.5, borderRadius: "4px", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <FileText size={16} /> PDF
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
                              <Typography variant="body2" sx={{ bgcolor: isDarkMode ? "grey.800" : "grey.200", color: isDarkMode ? "#e0e0e0" : "#000", p: 0.5, borderRadius: "4px", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <FileSpreadsheet size={16} /> XLSX
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
                            <hr />
                            <Box sx={{ textAlign: 'center', mx: 2 }}>
                              <IconButton onClick={() => handleDelete(report.path)} color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Card>
                        </Grid>
                      ))) : (<Grid item xs={12}>
                        <Typography align="center" sx={{ mt: 4, opacity: 0.7, fontStyle: 'italic' }}>
                          Не найдено отчётов по вашему запросу.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                </>
              ) : (
                <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                  Отчеты отсутствуют
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Paper>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <CircularProgress size={60} color={"primary"} />
            <Typography variant="h6" color={'white'} sx={{ mt: 2 }}>Загрузка</Typography>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Reports;