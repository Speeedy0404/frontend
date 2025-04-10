import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import AnimalDetails from './AnimalDetails'; // Импорт компонента деталей
import './Animals.css';
import { Pagination, styled, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const Animals = ({ isDarkMode }) => {
  const [animalType, setAnimalType] = useState('cow'); // 'cow' или 'bull'
  const [searchField, setSearchField] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [loading, setLoading] = useState(false); // Состояние для отображения загрузки
  const [currentPage, setCurrentPage] = useState(1); // Пагинация
  const [itemsPerPage, setItemsPerPage] = useState(6); // Количество элементов на странице, по умолчанию 10

  const handleAnimalTypeChange = (e) => {
    setAnimalType(e.target.value);
    setSearchField('');
    setSearchValue('');
    setResults([]);
    setCurrentPage(1)
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
    setSearchValue('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true); // Начало загрузки
    setCurrentPage(1)
    try {
      const endpoint =
        animalType === 'cow'
          ? `find-cow-animal/?${searchField}=${searchValue}`
          : `find-animal/?${searchField}=${searchValue}`;
      const response = await axiosInstance.get(endpoint);
      setResults(response.data);
    } catch (error) {
      console.error('Ошибка получения подсказок', error);
    } finally {
      setLoading(false); // Конец загрузки
    }
  };

  const handleAnimalClick = (animal) => {
    setSelectedAnimal({
      animalType,
      animaluniq_key: animal.uniq_key,
      ...animal,
    });
  };

  const handleBack = () => {
    setSelectedAnimal(null);
  };

  if (selectedAnimal) {
    return (
      <AnimalDetails
        animalType={selectedAnimal.animalType}
        animaluniq_key={selectedAnimal.uniq_key}
        onBack={handleBack}
      />
    );
  }

  // Вычисление начального и конечного индекса для пагинации
  const indexOfLastAnimal = currentPage * itemsPerPage;
  const indexOfFirstAnimal = indexOfLastAnimal - itemsPerPage;
  const currentAnimals = results.slice(indexOfFirstAnimal, indexOfLastAnimal);

  // Функции для переключения страниц
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Функция для изменения количества элементов на странице
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Сбросить на первую страницу при изменении количества элементов на странице
  };

  // Стилизация пагинации
  const StyledPagination = styled(Pagination)(({ isDarkMode }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    '& .MuiPaginationItem-root': {
      color: isDarkMode ? '#fff' : 'inherit', // Белые стрелки в темной теме
    },
    '& .MuiPaginationItem-ellipsis, & .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast': {
      color: isDarkMode ? '#fff' : 'inherit', // Белые стрелки в темной теме
    },
  }));

  return (
    <div className="animals-container">
      <h2>Поиск животных</h2>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label>Тип животного:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="cow"
                checked={animalType === 'cow'}
                onChange={handleAnimalTypeChange}
              />
              Коровы
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="bull"
                checked={animalType === 'bull'}
                onChange={handleAnimalTypeChange}
              />
              Быки
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Поле поиска:</label>
          <select value={searchField} onChange={handleSearchFieldChange} required>
            <option value="" disabled>
              Выберите поле
            </option>
            <option value="search_uniq_key">Индивидуальный номер</option>
            <option value="search_nomer">Рабочий номер</option>
            {animalType === 'bull' && <option value="search_klichka">Кличка</option>}
          </select>
        </div>

        <div className="form-group">
          <label>Значение для поиска:</label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            required
            placeholder="Введите значение для поиска"
          />
        </div>

        <button type="submit" className="search-button">
          Найти
        </button>
      </form>

      {/* Анимация загрузки */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка...</p>
        </div>
      )}

      {!loading && (
        <div className="results">
          {currentAnimals.length > 0 ? (
            <>
              <FormControl sx={{ minWidth: 120 }} margin="normal">
                <InputLabel
                  sx={{
                    color: isDarkMode ? '#fff' : '#000', // Цвет лейбла в зависимости от темы
                    '&.Mui-focused': {
                      color: isDarkMode ? '#fff' : '#000', // При фокусе сохраняем цвет
                    },
                  }}
                >
                  Элементов
                </InputLabel>
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  label="Элементов"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: isDarkMode ? '#333' : '#fff', // Фон меню
                        color: isDarkMode ? '#fff' : '#000', // Цвет текста в меню
                      },
                    },
                  }}
                  sx={{
                    backgroundColor: isDarkMode ? '#333' : '#fff', // Цвет фона для Select
                    color: isDarkMode ? '#fff' : '#000', // Цвет текста для Select
                    '& .MuiSelect-icon': {
                      color: isDarkMode ? '#fff' : '#000', // Цвет стрелки
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? '#fff' : '#000', // Обводка
                    },
                  }}
                >
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={48}>48</MenuItem>
                </Select>
              </FormControl>

              <div className="cards-grid">
                {currentAnimals.map((animal) => (
                  <div
                    className="animal-card"
                    key={animal.pk}
                    onClick={() => handleAnimalClick(animal)}
                  >
                    <img src={animal.image} alt={animal.nickname || 'Фотография'} />
                    <div className="card-content">
                      <h3>{animal.klichka || 'Без клички'}</h3>
                      <p>
                        <strong>Инд. номер:</strong> {animal.uniq_key}
                      </p>
                      <p>
                        <strong>Раб. номер:</strong> {animal.nomer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <StyledPagination
                count={Math.ceil(results.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                isDarkMode={isDarkMode}
              />
            </>
          ) : (
            <p>Нет результатов для отображения.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Animals;