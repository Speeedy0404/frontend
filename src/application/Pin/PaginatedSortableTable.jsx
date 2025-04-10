import React, { useState, useEffect } from 'react';
import { Button, Select, MenuItem, TextField, CircularProgress, Typography } from '@mui/material';
import './Pin.css';

import CowActionModal from './CowActionModal';
import AnimalDetails from '../Animals/AnimalDetails'; // Импорт компонента деталей
import axiosInstance from '../../axiosConfig';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from "../ThemeContext"; // Импортируем хук useTheme

const parameterLabels = {
  rbv_milk: "M,kg",
  rbv_fkg: "F,kg",
  rbv_fprc: "F,%",
  rbv_pkg: "P,kg",
  rbv_pprc: "P,%",
  rm: "RM",
  rbv_crh: "CRh",
  rbv_ctfi: "CTF",
  rbv_do: "DO",
  rf: "RF",
  rscs: "RSCS",
  rbvt: "RBVT",
  rbvf: "RVBF",
  rbvu: "RBVU",
  rc: "RC",
  pi: "PI",
  rbv_tip: "Тип",
  rbv_kt: "Крепость телосложения",
  rbv_rost: "Рост",
  rbv_gt: "Глубина туловища",
  rbv_pz: "Положение зада",
  rbv_shz: "Ширина зада",
  rbv_pzkb: "Постановка задних конечностей (сбоку)",
  rbv_pzkz: "Постановка задних конечностей (сзади)",
  rbv_sust: "Выраженность скакательного сустава",
  rbv_pzkop: "Постановка задних копыт",
  rbv_gv: "Глубина вымени",
  rbv_pdv: "Прикрепление передней долей вымени",
  rbv_vzcv: "Высота задней части вымени",
  rbv_szcv: "Ширина задней части вымени",
  rbv_csv: "Центральная связка (глубина доли)",
  rbv_rps: "Расположение передних сосков",
  rbv_rzs: "Расположение задних сосков",
  rbv_ds: "Длина сосков (передних)",
};

const formatNumber = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return value;

  if (Number.isInteger(number)) {
    return number;
  }

  const integerPart = Math.floor(Math.abs(number));

  if (integerPart >= 10) {
    return Math.round(number);
  } else {
    return number.toFixed(2);
  }
};

const PaginatedSortableTable = ({ select, data, columns, maxSelectable, onBindChoices, mode, functionSelect, updateFunction }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedItems, setSelectedItems] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: columns[0].key, direction: 'asc' });

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalClose = () => setModalOpen(false);
  const [cowActionModalOpen, setCowActionModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const totalCount = data.length;
  const fixedCount = data.filter((row) => row['consolidation']).length;

  const { isDarkMode } = useTheme();

  const searchField = mode === 'bull' ? 'Раб. номер' : 'Номер';
  const searchNameParam = mode === 'bull' ? 'nomer' : 'uniq_key';

  const [isIndividModalOpen, setIsIndividModalOpen] = useState(false);
  const handleIndividModalClose = () => setIsIndividModalOpen(false);
  const [cowParams, setCowParams] = useState([]);

  const [choices, setChoices] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === 'cow') {
      handleClearSelect()
    }
    setSelectedItems([])
  }, [data]);

  useEffect(() => {
    functionSelect(selectedItems)
  }, [selectedItems]);

  useEffect(() => {
    if (mode === 'cow' || mode === 'young') {
      if (JSON.stringify(select) !== JSON.stringify(selectedItems)) {
        setSelectedItems(select);
      }
    }
  }, [select, mode]);

  const handleChoiceChange = (param, value) => {
    setChoices(prev => {
      const updatedChoices = { ...prev, [param]: value };
      // Получаем текущие сохраненные данные
      let savedChoices = JSON.parse(localStorage.getItem(`choices-${selectedAnimal.uniq_key}`)) || [];
      // Удаляем запись с данным параметром, если она уже есть
      savedChoices = savedChoices.filter(choice => choice[0] !== param);
      // Добавляем новую запись, если значение не пустое
      if (value) {
        savedChoices.push([param, cowParams[param], value]);
      }
      // Сохраняем в localStorage
      localStorage.setItem(`choices-${selectedAnimal.uniq_key}`, JSON.stringify(savedChoices));
      return updatedChoices;
    });
  };

  const handleClearSelect = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('choices-')) {
        localStorage.removeItem(key);
      }
    });
    setChoices({});
    handleBindChoices()
  };

  const handleIndividModalOpen = () => {
    if (selectedAnimal?.uniq_key) {
      // Загружаем сохраненные данные из localStorage
      const savedChoices = JSON.parse(localStorage.getItem(`choices-${selectedAnimal.uniq_key}`)) || [];

      // Преобразуем массив обратно в объект формата { param: value }
      const choicesObject = savedChoices.reduce((acc, [param, , value]) => {
        acc[param] = value;
        return acc;
      }, {});

      // Устанавливаем преобразованные данные в state
      setChoices(choicesObject);
      setIsIndividModalOpen(true);
    }
  };

  const handleSave = () => {
    handleIndividModalClose();
  };

  const handleClearChoices = () => {
    localStorage.removeItem(`choices-${selectedAnimal.uniq_key}`);
    setChoices({});
  };

  const handleBindChoices = () => {
    const allChoices = [];

    // Перебираем все ключи в localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("choices-")) {
        // Получаем и парсим данные
        const storedData = JSON.parse(localStorage.getItem(key)) || [];

        // Добавляем данные для текущей "коровы" в общий массив
        allChoices.push(storedData);
      }
    });

    // Отправляем данные в родительский компонент
    if (typeof onBindChoices === "function") {
      onBindChoices(allChoices); // Теперь allChoices будет массивом массивов
    }
  };
  const filteredData = data.filter((row) => {
    const value = (row[searchNameParam] || '').toString().toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  // const sortedData = [...filteredData].sort((a, b) => {
  //   let aValue = a[sortConfig.key];
  //   let bValue = b[sortConfig.key];

  //   // Обработка пустых значений
  //   if (aValue === undefined || aValue === null || aValue === '') aValue = -Infinity;
  //   if (bValue === undefined || bValue === null || bValue === '') bValue = -Infinity;

  //   // Проверяем — это числа?
  //   const aNum = parseFloat(aValue);
  //   const bNum = parseFloat(bValue);

  //   const bothNumbers = !isNaN(aNum) && !isNaN(bNum);

  //   if (bothNumbers) {
  //     // Сортируем как числа
  //     return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
  //   } else {
  //     // Сортируем как строки
  //     const aStr = aValue.toString();
  //     const bStr = bValue.toString();
  //     if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
  //     if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
  //     return 0;
  //   }
  // });

  const sortedData = [...filteredData].sort((a, b) => {
    // Если сортируем по колонке "Выбор"
    if (sortConfig.key === 'Выбор') {
      const isSelectedA = selectedItems.includes(a.id);
      const isSelectedB = selectedItems.includes(b.id);

      // Если есть выбранные животные, сортируем по selectedItems
      if (selectedItems.length > 0) {
        if (isSelectedA && !isSelectedB) return -1;
        if (!isSelectedA && isSelectedB) return 1;
        return 0; // Если оба либо выбраны, либо нет — не меняем порядок
      } else {
        // Если нет выбранных — сортируем по закрепленным
        const isFixedA = a['consolidation'] === true;
        const isFixedB = b['consolidation'] === true;

        if (isFixedA && !isFixedB) return -1;
        if (!isFixedA && isFixedB) return 1;
        return 0; // Если оба закреплены или нет — не меняем порядок
      }
    }

    // Общая сортировка по другим колонкам
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Обработка пустых значений
    if (aValue === undefined || aValue === null || aValue === '') aValue = -Infinity;
    if (bValue === undefined || bValue === null || bValue === '') bValue = -Infinity;

    // Проверяем — это числа?
    const aNum = parseFloat(aValue);
    const bNum = parseFloat(bValue);

    const bothNumbers = !isNaN(aNum) && !isNaN(bNum);

    if (bothNumbers) {
      // Сортируем как числа
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    } else {
      // Сортируем как строки
      const aStr = aValue.toString();
      const bStr = bValue.toString();
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleSelectItem = (uniqKey, isFixed) => {
    if (isFixed) return;
    setSelectedItems((prev) => {
      const isSelected = prev.includes(uniqKey);
      if (isSelected) return prev.filter((key) => key !== uniqKey);
      if (maxSelectable && prev.length >= maxSelectable) {
        alert(`Можно выбрать не более ${maxSelectable} животных`);
        return prev;
      }
      return [...prev, uniqKey];
    });
  };


  const allSelectableSelected = filteredData
    .filter((row) => !row['consolidation'])
    .every((row) => selectedItems.includes(row['uniq_key']));

  const handleSelectAll = () => {
    const allSelectableKeys = filteredData
      .filter((row) => !row['consolidation'])
      .map((row) => row['uniq_key']);
    const allSelected = allSelectableKeys.every((key) => selectedItems.includes(key));
    if (allSelected) {
      setSelectedItems((prev) => prev.filter((key) => !allSelectableKeys.includes(key)));
    } else {
      setSelectedItems((prev) => [...new Set([...prev, ...allSelectableKeys])]);
    }
  };

  const handleRowClick = (row) => {
    if (mode === 'cow') {
      setSelectedAnimal(row);
      setCowActionModalOpen(true);
    } else if (mode === 'bull') {
      setSelectedAnimal(row);
      setModalOpen(true);
    }
  };

  const handlePinAnimal = async () => {
    setCowActionModalOpen(false)
    setIsLoading(true);
    if (!selectedAnimal?.uniq_key) {
      alert("Ошибка: животное не выбрано");
      return;
    }
    try {
      const response = await axiosInstance.get(`pkcow-params/${selectedAnimal.uniq_key}`);
      setCowParams(response.data.params);
      handleIndividModalOpen();
    } catch (error) {
      console.error('Ошибка загрузки параметров:', error);
    }
    finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="table-container">

      {/* Статистика */}
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        {mode === 'bull'
          ? `Всего животных: ${totalCount}`
          : `Закреплено: ${fixedCount} / ${totalCount}`}
      </div>

      {/* Поиск */}
      <TextField
        label={`Поиск по ${searchField}`}
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(0);
        }}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{
          style: {
            color: isDarkMode ? '#90caf9' : '#000', // Цвет лейбла для темной и светлой темы
          },
        }}
      />

      {/* Таблица */}
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('Выбор')}>
              Выбор {sortConfig.key === 'Выбор' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            {columns.map((col) => (
              <th key={col.key} style={{ cursor: 'pointer' }} onClick={() => handleSort(col.key)}>
                {col.label} {sortConfig.key === col.key && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => {
            const isFixed = row['consolidation'] === true;
            const isSelected = selectedItems.includes(row['uniq_key']);  // Используем uniq_key вместо id
            return (
              <tr
                key={row['uniq_key']}
                className={`${isFixed ? 'fixed-row' : isSelected ? 'selected-row' : ''} ${isDarkMode ? 'dark' : ''}`}
              >
                <td>
                  {isFixed ? (
                    <span style={{ color: 'gray', fontWeight: 'bold' }}>Закреплено</span>
                  ) : (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectItem(row['uniq_key'], isFixed)}  // Передаем uniq_key вместо id
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </td>
                {columns.map((col) => {
                  let value = row[col.key];
                  if (!isNaN(parseFloat(value)) && isFinite(value)) {
                    value = formatNumber(value);
                  }
                  return (
                    <td key={col.key} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }}>
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Пагинация */}
      <div className="pagination-controls">
        <Button onClick={() => setPage(page - 1)} disabled={page === 0}>
          Предыдущая
        </Button>
        <span>Страница {page + 1}</span>
        <Button onClick={() => setPage(page + 1)} disabled={(page + 1) * rowsPerPage >= sortedData.length}>
          Следующая
        </Button>
        <Select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(parseInt(e.target.value)); // Ставим новое значение
            setPage(0); // Сбрасываем на первую страницу
          }}
        >
          {[5, 10, 20, 50].map((n) => (
            <MenuItem key={n} value={n}>{n} на странице</MenuItem>
          ))}
        </Select>

        {mode === 'cow' && (
          <>
            <Button onClick={handleBindChoices} variant="outlined" sx={{ ml: 1 }}>Подобрать быков</Button>
            <Button onClick={handleClearSelect} variant="outlined" sx={{ ml: 1 }}>Сбросить фильтры</Button>
            <Button onClick={updateFunction} variant="contained" color="primary" sx={{ ml: 1 }}>Обновить</Button>
          </>
        )}
        {mode !== 'bull' && (
          <Button variant="contained" color="primary" onClick={handleSelectAll}>
            {allSelectableSelected ? 'Снять выделение' : 'Выбрать всех'}
          </Button>
        )}
        {mode === 'young' && (
          <Button onClick={updateFunction} variant="contained" color="primary" sx={{ ml: 1 }}>Обновить</Button>
        )}
      </div>

      <Modal open={isIndividModalOpen} onClose={handleIndividModalClose}>
        <Box
          className={isDarkMode ? 'dark-mode' : ''}
          sx={{
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            margin: 'auto',
            marginTop: '5%',
            padding: '2rem',
            backgroundColor: isDarkMode ? '#424242' : '#fff',
            borderRadius: '8px',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          <IconButton onClick={handleIndividModalClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" mb={2}>Параметры животного {selectedAnimal?.uniq_key}</Typography>
          {Object.entries(cowParams).map(([key, value]) => (
            <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>{parameterLabels[key] || key}: {value}</Typography>
              <Select
                size="small"
                value={choices[key] || ''}  // Используем сохраненный выбор для этого параметра
                onChange={(e) => handleChoiceChange(key, e.target.value)}
              >
                <MenuItem value="">Не выбрано</MenuItem>
                <MenuItem value="improve">Улучшить</MenuItem>
                <MenuItem value="keep">Зафиксировать</MenuItem>
              </Select>
            </Box>
          ))}
          <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>Сохранить</Button>
          <Button variant="outlined" onClick={handleClearChoices} sx={{ mt: 2, ml: 1 }}>Очистить выбор</Button>
        </Box>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="animal-modal-title"
        aria-describedby="animal-modal-description"
      >
        <Box
          className={isDarkMode ? 'dark-mode' : ''}
          sx={{
            width: { xs: '95%', sm: '80%' },
            maxHeight: '90vh',
            margin: 'auto',
            marginTop: { xs: '2%', sm: '5%' },
            padding: { xs: '1rem', sm: '2rem' },
            backgroundColor: isDarkMode ? '#424242' : '#fff',
            borderRadius: '8px',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleModalClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: isDarkMode ? '#fff' : 'inherit',
            }}
          >
            <CloseIcon />
          </IconButton>
          <AnimalDetails
            animalType={mode}
            animaluniq_key={selectedAnimal?.uniq_key}
          />
        </Box>
      </Modal>

      <CowActionModal
        open={cowActionModalOpen}
        onClose={() => setCowActionModalOpen(false)}
        onViewCard={() => { setCowActionModalOpen(false); setModalOpen(true); }}
        onPin={handlePinAnimal}
        isDarkMode={isDarkMode}
      />
      {isLoading && (
        <div className={`loading-overlay`}>
          <div className="loading-content">
            <CircularProgress size={60} color={"primary"} />
            <Typography variant="h6" color={'white'} sx={{ mt: 2 }}>Загрузка данных...</Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedSortableTable;