import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import AnimalDetails from './AnimalDetails';
import './Animals.css';
import { Pagination, styled, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Search, PawPrint, SlidersHorizontal } from 'lucide-react';

const Animals = ({ isDarkMode }) => {
  const [animalType, setAnimalType] = useState('cow');
  const [searchField, setSearchField] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const handleAnimalTypeChange = (e) => {
    setAnimalType(e.target.value);
    setSearchField('');
    setSearchValue('');
    setResults([]);
    setCurrentPage(1);
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
    setSearchValue('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentPage(1);
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
      setLoading(false);
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
        pin={false}
      />
    );
  }

  const indexOfLastAnimal = currentPage * itemsPerPage;
  const indexOfFirstAnimal = indexOfLastAnimal - itemsPerPage;
  const currentAnimals = results.slice(indexOfFirstAnimal, indexOfLastAnimal);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const StyledPagination = styled(Pagination)(({ isDarkMode }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    '& .MuiPaginationItem-root': {
      color: isDarkMode ? '#fff' : 'inherit',
    },
    '& .MuiPaginationItem-ellipsis, & .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast': {
      color: isDarkMode ? '#fff' : 'inherit',
    },
  }));
  
  return (
    <div className="animals-container">
      <h2><PawPrint size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Поиск животных</h2>
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
          <label><SlidersHorizontal size={16} style={{ marginRight: '6px' }} />Поле поиска:</label>
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
          <Search size={16} style={{ marginRight: '8px' }} /> Найти
        </button>
      </form>

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
                    color: isDarkMode ? '#fff' : '#000',
                    '&.Mui-focused': {
                      color: isDarkMode ? '#fff' : '#000',
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
                        backgroundColor: isDarkMode ? '#333' : '#fff',
                        color: isDarkMode ? '#fff' : '#000',
                      },
                    },
                  }}
                  sx={{
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                    color: isDarkMode ? '#fff' : '#000',
                    '& .MuiSelect-icon': {
                      color: isDarkMode ? '#fff' : '#000',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? '#fff' : '#000',
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
                    <div className="card-content">
                      <h3>{animal.klichka || 'Без клички'}</h3>
                      <p><strong>Инд. номер:</strong> {animal.uniq_key}</p>
                      <p><strong>Раб. номер:</strong> {animal.nomer}</p>
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
