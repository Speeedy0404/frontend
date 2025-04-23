// src/application/Pin/BindingTab.jsx

import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import AnimalTypeToggle from './AnimalTypeToggle';
import MinimalisticCowsFilter from './CowsBinding';
import CalvesBinding from './CalvesBinding';
import BullsBinding from './BullsBinding';
import './Pin.css';

import {
  Typography,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  TablePagination
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close'; // Импортируем иконку закрытия

import { useTheme as useCustomTheme } from "../ThemeContext"; // Импортируем хук useTheme

const apiUrl = process.env.REACT_APP_API_URL

const BindingTab = ({ farmName, farmCode }) => {
  const [animalType, setAnimalType] = useState("cows");
  const [boundChoices, setBoundChoices] = useState([]);
  const [loadingPhrase, setPhrase] = useState('Проверка на инбридинг ...')
  const [selectCow, setCow] = useState([])
  const [selectBull, setBull] = useState([])
  const [selectCalves, setCalves] = useState([])


  const [inbreedingStatus, setInbreedingStatus] = useState(null);
  const [inbredAnimals, setInbredAnimals] = useState([]);
  const [inbredCount, setInbredCount] = useState([]);


  const [loading, setLoading] = useState(false);
  const [pdfLink, setPdfLink] = useState(null);
  const [nameDock, setNameDock] = useState('');
  const [pdfname, setPdfName] = useState('')

  const [selectedBullLevel, setSelectedBullLevel] = useState('');
  const [selectedCowLevel, setSelectedCowLevel] = useState('');

  const [modalOpen, setModalOpen] = useState(false);

  const [reloadTables, setReloadTables] = useState(false);
  const [first, setFirst] = useState(false)
  const [event, setEvent] = useState(null);
  const { isDarkMode } = useCustomTheme();

  const [selectedBull, setSelectedBull] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const uniqueBulls = inbredAnimals.map((bull) => ({
    value: bull.bull,
    label: bull.klichka,
  }));

  const selectedBullData = inbredAnimals.find((item) => item.bull === selectedBull);
  const inbreedingCases = selectedBullData ? selectedBullData.inbreeding_cases : [];

  useEffect(() => {
    // Если состояние selectedCows изменилось, вызовем handleSubmitconsolidation
    if (animalType !== 'calves' && selectCow.length !== 0 && modalOpen == true) {
      if (event) {
        handleSubmitconsolidation(event); // Передаем событие
        setEvent(null)
      }
    } else if (animalType === 'calves' && selectCalves.length !== 0 && modalOpen == true) {
      if (event) {
        handleSubmitconsolidation(event); // Передаем событие
        setEvent(null)
      }
    }
  }, [selectCow, selectCalves]); // Следим за изменениями в этих состояниях

  useEffect(() => {
    setSelectedBull("")
    setRowsPerPage(5)
  }, [inbredAnimals]); // Следим за изменениями в этих состояниях

  const handleSubmitconsolidation = async (event) => {
    event.preventDefault();
    let payload; // Объявляем payload здесь
    if (animalType === 'calves') {
      if (selectCalves.length === 0) {
        alert('Вы должны выбрать хотя бы одно животное.');
        return;
      }

      if (selectBull.length === 0) {
        alert('Вы должны выбрать хотя бы одного быка.');
        return;
      }

      if (selectBull.length > 5) {
        alert('Вы не можете выбрать больше 5 быков.');
        return;
      }

      payload = { // Присваиваем значение payload
        cows: selectCalves,
        bulls: selectBull,
        inbred: inbredAnimals,
        mode: 'young',
        name: nameDock,
      };
    } else {
      if (selectCow.length === 0) {
        alert('Вы должны выбрать хотя бы одну корову.');
        return;
      }

      if (selectBull.length === 0) {
        alert('Вы должны выбрать хотя бы одного быка.');
        return;
      }

      if (selectBull.length > 5) {
        alert('Вы не можете выбрать больше 5 быков.');
        return;
      }

      payload = { // Присваиваем значение payload
        cows: selectCow,
        bulls: selectBull,
        inbred: inbredAnimals,
        mode: 'cow',
        name: nameDock,
      };
    }

    try {
      setLoading(true);
      setModalOpen(true); // Открываем модальное окно при начале проверки

      const response = await fetch(`${apiUrl}/api/v1/submit-consolidation/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
          'Kodrn': farmCode,
          'Mode': 'standard',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error('Ошибка при проверке инбридинга');
      }

      if (result.inbreeding_check) {
        setInbreedingStatus('success');
      } else {
        setInbreedingStatus('error');
        setInbredAnimals(result.inbred_animals);
        setInbredCount(result.count_unique_cows)
        setLoading(false);
      }

      setLoading(false);

    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка при отправке данных');
      setLoading(false);
      setPhrase('Проверка на инбридинг')
    }
  };

  const handleConfirmConsolidation = async (event) => {
    event.preventDefault();
    setPhrase('Закрепление')
    let payload; // Объявляем payload здесь

    if (animalType === 'calves') {
      if (selectCalves.length === 0) {
        alert('Вы должны выбрать хотя бы одно животное.');
        return;
      }

      if (selectBull.length === 0) {
        alert('Вы должны выбрать хотя бы одного быка.');
        return;
      }

      if (selectBull.length > 5) {
        alert('Вы не можете выбрать больше 5 быков.');
        return;
      }

      payload = { // Присваиваем значение payload
        cows: selectCalves,
        bulls: selectBull,
        inbred: inbredAnimals,
        mode: 'young',
        name: nameDock,
      };
    } else {
      if (selectCow.length === 0) {
        alert('Вы должны выбрать хотя бы одну корову.');
        return;
      }

      if (selectBull.length === 0) {
        alert('Вы должны выбрать хотя бы одного быка.');
        return;
      }

      if (selectBull.length > 5) {
        alert('Вы не можете выбрать больше 5 быков.');
        return;
      }

      payload = { // Присваиваем значение payload
        cows: selectCow,
        bulls: selectBull,
        inbred: inbredAnimals,
        mode: 'cow',
        name: nameDock,
      };
    }

    try {
      setLoading(true);
      setModalOpen(true); // Открываем модальное окно при начале проверки

      const response = await fetch(`${apiUrl}/api/v1/submit-consolidation/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
          'Kodrn': farmCode,
          'Mode': 'standard_confirm',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error('Ошибка при проверке инбридинга');
      }

      if (result.inbreeding_check) {
        setInbreedingStatus('success_confirm');
        setPdfName(result.pdf_filename)

        const pdfResponse = await fetch(`${apiUrl}/api/v1/get-report/${result.pdf_filename}`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          },
        });

        if (!pdfResponse.ok) {
          throw new Error('Ошибка при загрузке PDF файла');
        }

        const blob = await pdfResponse.blob();
        const pdfURL = window.URL.createObjectURL(blob);
        setPdfLink(pdfURL);  // Устанавливаем ссылку для скачивания PDF

        setLoading(false);

      } else {
        setInbreedingStatus('error');
        setInbredAnimals(result.inbred_animals);
        setInbredCount(result.count_unique_cows)
        setLoading(false);
      }

    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка при отправке данных');
      setLoading(false);
      setPhrase('Проверка на инбридинг')
    }
  };

  const handleFixWithoutInbreeding = async (event) => {
    event.preventDefault();
    setPhrase('Закрепление')
    let payload; // Объявляем payload здесь

    if (animalType === 'calves') {
      if (selectCalves.length === 0) {
        alert('Вы должны выбрать хотя бы одно животное.');
        return;
      }

      if (selectBull.length === 0) {
        alert('Вы должны выбрать хотя бы одного быка.');
        return;
      }

      if (selectBull.length > 5) {
        alert('Вы не можете выбрать больше 5 быков.');
        return;
      }

      payload = { // Присваиваем значение payload
        cows: selectCalves,
        bulls: selectBull,
        inbred: inbredAnimals,
        mode: 'young',
        name: nameDock,
      };
    } else {
      if (selectCow.length === 0) {
        alert('Вы должны выбрать хотя бы одну корову.');
        return;
      }

      if (selectBull.length === 0) {
        alert('Вы должны выбрать хотя бы одного быка.');
        return;
      }

      if (selectBull.length > 5) {
        alert('Вы не можете выбрать больше 5 быков.');
        return;
      }

      payload = { // Присваиваем значение payload
        cows: selectCow,
        bulls: selectBull,
        inbred: inbredAnimals,
        mode: 'cow',
        name: nameDock,
      };
    }

    try {
      setLoading(true);
      setModalOpen(true); // Открываем модальное окно при начале проверки

      const response = await fetch(`${apiUrl}/api/v1/submit-consolidation/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
          'Kodrn': farmCode,
          'Mode': 'Without',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error('Ошибка при проверке инбридинга');
      }

      if (result.inbreeding_check) {
        setInbreedingStatus('success_confirm');
      } else {
        setInbreedingStatus('error');
        setInbredAnimals(result.inbred_animals);
        setLoading(false);
        return;
      }
      setInbreedingStatus('success_confirm');
      setPdfName(result.pdf_filename)

      const pdfResponse = await fetch(`${apiUrl}/api/v1/get-report/${result.pdf_filename}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
      });

      if (!pdfResponse.ok) {
        throw new Error('Ошибка при загрузке PDF файла');
      }

      const blob = await pdfResponse.blob();
      const pdfURL = window.URL.createObjectURL(blob);
      setPdfLink(pdfURL);  // Устанавливаем ссылку для скачивания PDF

      setLoading(false);

    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка при отправке данных');
      setLoading(false);
      setPhrase('Проверка на инбридинг')
    }
  }

  const handleFixWithInbreeding = async (event) => {
    event.preventDefault();
    setPhrase('Закрепление')
    let payload; // Объявляем payload здесь

    if (animalType === 'calves') {
      if (selectCalves.length === 0) {
        alert('Вы должны выбрать хотя бы одно животное.');
        return;
      }

      if (selectBull.length === 0) {
        alert('Вы должны выбрать хотя бы одного быка.');
        return;
      }

      if (selectBull.length > 5) {
        alert('Вы не можете выбрать больше 5 быков.');
        return;
      }

      payload = { // Присваиваем значение payload
        cows: selectCalves,
        bulls: selectBull,
        inbred: inbredAnimals,
        mode: 'young',
        name: nameDock,
      };
    } else {
      if (selectCow.length === 0) {
        alert('Вы должны выбрать хотя бы одну корову.');
        return;
      }

      if (selectBull.length === 0) {
        alert('Вы должны выбрать хотя бы одного быка.');
        return;
      }

      if (selectBull.length > 5) {
        alert('Вы не можете выбрать больше 5 быков.');
        return;
      }

      payload = { // Присваиваем значение payload
        cows: selectCow,
        bulls: selectBull,
        inbred: inbredAnimals,
        mode: 'cow',
        name: nameDock,
      };
    }

    try {
      setLoading(true);
      setModalOpen(true); // Открываем модальное окно при начале проверки

      const response = await fetch(`${apiUrl}/api/v1/submit-consolidation/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
          'Kodrn': farmCode,
          'Mode': 'With',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error('Ошибка при проверке инбридинга');
      }

      if (result.inbreeding_check) {
        setInbreedingStatus('success_confirm');
      } else {
        setInbreedingStatus('error');
        setInbredAnimals(result.inbred_animals);
        setLoading(false);
        return;
      }
      setInbreedingStatus('success_confirm');
      setPdfName(result.pdf_filename)

      const pdfResponse = await fetch(`${apiUrl}/api/v1/get-report/${result.pdf_filename}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
      });

      if (!pdfResponse.ok) {
        throw new Error('Ошибка при загрузке PDF файла');
      }

      const blob = await pdfResponse.blob();
      const pdfURL = window.URL.createObjectURL(blob);
      setPdfLink(pdfURL);  // Устанавливаем ссылку для скачивания PDF

      setLoading(false);

    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка при отправке данных');
      setLoading(false);
      setPhrase('Проверка на инбридинг')
    }
  }

  const handleApplyExclusion = (event) => {
    setEvent(event);
    setPhrase('Исключение')
    if (animalType !== 'calves') {
      const updatedSelectedCows = selectCow.filter((cow) => {
        return !inbredAnimals.some((bullData) =>
          bullData.inbreeding_cases.some((item) =>
            item.bull_level === Number(selectedBullLevel) &&
            item.cow_level === Number(selectedCowLevel) &&
            item.cow === cow
          )
        );
      });

      setCow(updatedSelectedCows);
    } else {
      const updatedSelectedCows = selectCalves.filter((cow) => {
        return !inbredAnimals.some((bullData) =>
          bullData.inbreeding_cases.some((item) =>
            item.bull_level === Number(selectedBullLevel) &&
            item.cow_level === Number(selectedCowLevel) &&
            item.cow === cow
          )
        );
      });

      setCalves(updatedSelectedCows);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);  // Закрываем модальное окно
    if (pdfLink !== null) {
      setPdfLink(null);
      setCow([])
      setBull([])
      setCalves([])
      setInbredAnimals([])
      setInbredCount([])
      setFirst(true)
      setReloadTables(!reloadTables);  // Меняем состояние, чтобы вызвать ререндеринг таблиц
    }
  };

  const handleBullLevelChange = (event) => {
    setSelectedBullLevel(event.target.value);
  };

  const handleCowLevelChange = (event) => {
    setSelectedCowLevel(event.target.value);
  };

  return (
    <div className="binding-tab">
      <div className="binding-split">
        <div className="right-side">
          <h3>{farmName}</h3>
          {/* Переключатель для коров / молодняка */}
          <AnimalTypeToggle animalType={animalType} setAnimalType={setAnimalType} />
          {animalType === "cows" && <MinimalisticCowsFilter select={selectCow} first={first} key={`cow-table-${reloadTables}`} functionCow={setCow} functionChoices={setBoundChoices} farmCode={farmCode} />}
          {animalType === "calves" && <CalvesBinding select={selectCalves} first={first} key={`young-table-${reloadTables}`} functionCalves={setCalves} farmName={farmName} farmCode={farmCode} />}
          {/* Отдельный блок для быков */}
        </div>
        <div className="left-side">
          <div className="all-gpp">
            <h3>Все ГПП</h3>
          </div>
          <div className="bulls-section">
            <BullsBinding functionBull={setBull} boundChoices={boundChoices} />
          </div>
        </div>
      </div>

      <div className="binding-common" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px' }}>
        <TextField
          label="Название документа"
          variant="outlined"
          value={nameDock}
          onChange={(e) => setNameDock(e.target.value)}
          sx={{ width: '300px' }} // фиксированная ширина
          InputLabelProps={{
            style: {
              color: isDarkMode ? '#90caf9' : '#000', // Цвет лейбла для темной и светлой темы
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          className="action-button"
          onClick={handleSubmitconsolidation}
        >
          Закрепить
        </Button>
      </div>

      <Dialog
        open={modalOpen}  // Показывается, если проверка запущена
        onClose={handleCloseModal}  // Закрытие через функцию handleCloseModal
        className={isDarkMode ? 'dark-mode' : ''}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>

          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModal}
            aria-label="close"
            sx={{ position: 'absolute', right: 20, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>

          {loading && (
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h6">{loadingPhrase}</Typography>
              <CircularProgress />
            </div>
          )}

          {!loading && (
            <div>
              {inbreedingStatus === 'success' && (
                <div>
                  <div>
                    {/* Отображение нужного текста перед успешным сообщением */}
                    <Typography variant="h6" style={{ color: 'green' }} >Результа проверки инбридинга: </Typography>
                    <Typography variant="body1" style={{ color: 'green' }}>
                      Проверка инбридинга пройдена успешно!
                    </Typography>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <Button variant="contained" color="primary" onClick={handleConfirmConsolidation}>
                      Закрепить
                    </Button>
                  </div>
                </div>
              )}
              {inbreedingStatus === 'success_confirm' && (
                <div>
                  <div>
                    {/* Отображение нужного текста перед успешным сообщением */}
                    <Typography variant="h6" style={{ color: 'green' }} >Результа проверки инбридинга: </Typography>
                    <Typography variant="body1" style={{ color: 'green' }}>
                      Проверка инбридинга пройдена успешно!
                    </Typography>
                  </div>
                  {pdfLink && (
                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }}>
                      {/* Иконка файла и название отчета */}
                      <DescriptionIcon style={{ marginRight: '8px' }} />
                      <Typography variant="body1" style={{ marginRight: '16px' }}>{pdfname}</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        href={pdfLink}
                        download={pdfname}
                      >
                        Скачать отчет
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {inbreedingStatus === 'error' && (
                <div style={{ color: 'red', marginTop: '16px' }}>
                  <Typography color={isDarkMode ? 'white' : 'black'} variant="h6">Результаты проверки инбридинга:</Typography>
                  {inbredCount.map((bullData) => (
                    <Typography key={bullData.bull} variant="body1" color={isDarkMode ? 'white' : 'black'}>
                      Инбредных коров для {bullData.bull} - {bullData.inbred_cows_count}
                    </Typography>
                  ))}

                  <Typography variant="h6" color={isDarkMode ? 'white' : 'black'} > Исключить коров с неподходящим уровнем инбридинга </Typography>
                  {/* Радио кнопки для выбора уровня быка и коровы, размещенные в строку */}
                  <div style={{ marginTop: '5px' }}>
                    <Typography variant="body1" color={isDarkMode ? 'white' : 'black'}>Выберите уровень быка:</Typography>
                    <RadioGroup
                      value={selectedBullLevel}
                      onChange={handleBullLevelChange}
                      row  // Располагаем элементы в строку
                      style={{
                        display: 'flex',
                        gap: '16px',
                        color: isDarkMode ? 'white' : 'black'
                      }}
                    >
                      <FormControlLabel value="2" control={<Radio />} label="2" />
                      <FormControlLabel value="3" control={<Radio />} label="3" />
                      <FormControlLabel value="4" control={<Radio />} label="4" />
                    </RadioGroup>

                    <Typography variant="body1" color={isDarkMode ? 'white' : 'black'}>Выберите уровень коровы:</Typography>
                    <RadioGroup
                      value={selectedCowLevel}
                      onChange={handleCowLevelChange}
                      row  // Располагаем элементы в строку
                      style={{
                        display: 'flex',
                        gap: '16px',
                        color: isDarkMode ? 'white' : 'black'
                      }}
                    // Добавляем пространство между радио кнопками
                    >
                      <FormControlLabel value="2" control={<Radio />} label="2" />
                      <FormControlLabel value="3" control={<Radio />} label="3" />
                      <FormControlLabel value="4" control={<Radio />} label="4" />
                    </RadioGroup>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <Button variant="contained" color="primary" onClick={handleApplyExclusion}>
                      Применить исключение
                    </Button>
                  </div>

                  <Typography variant="h6" color="primary">Выберите быка:</Typography>
                  <Select
                    value={selectedBull}
                    onChange={(e) => setSelectedBull(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "16px" }}
                  >
                    {uniqueBulls.map((bull) => (
                      <MenuItem key={bull.value} value={bull.value}>
                        {bull.label}
                      </MenuItem>
                    ))}
                  </Select>

                  {selectedBull && (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Корова</TableCell>
                            <TableCell>Уровень быка</TableCell>
                            <TableCell>Уровень коровы</TableCell>
                            <TableCell>Общие Предки</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {inbreedingCases.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((caseItem, index) => (
                            <TableRow key={index}>
                              <TableCell>{caseItem.cow}</TableCell>
                              <TableCell>{caseItem.bull_level}</TableCell>
                              <TableCell>{caseItem.cow_level}</TableCell>
                              <TableCell>{caseItem.common_ancestors.join(", ")}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* Пагинация */}
                  {selectedBull && (
                    <TablePagination
                      component="div"
                      count={inbreedingCases.length}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onPageChange={(e, newPage) => setPage(newPage)}
                      rowsPerPageOptions={[5, 10, 20]}
                      onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                      }}
                    />
                  )}
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <Button variant="contained" color="primary" onClick={handleFixWithoutInbreeding}>
                      Закрепить без инбредных коров
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleFixWithInbreeding}>
                      Закрепить с инбредностью
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleCloseModal}>
                      Закрыть
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default BindingTab;
