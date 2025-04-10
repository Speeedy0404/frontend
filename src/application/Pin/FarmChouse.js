import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../application/ThemeContext'; // скорректируйте путь
import './FarmChouse.css';

const FarmChouse = () => {
  const [searchMethod, setSearchMethod] = useState('code');
  const [searchTerm, setSearchTerm] = useState('');
  const [farmResults, setFarmResults] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoadingSearch(true);
    setFarmResults([]);
    setSelectedFarm(null);
    try {
      const endpoint = `farms/?${searchMethod}=${encodeURIComponent(searchTerm)}`;
      const response = await axiosInstance.get(endpoint);
      setFarmResults(response.data);
    } catch (error) {
      console.error("Ошибка поиска хозяйства: ", error);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleSelectFarm = (farm) => {
    setSelectedFarm(farm);
    setSearchTerm(searchMethod === 'code' ? farm.korg : farm.norg);
  };

  const handleConfirmSelection = async () => {
    if (!selectedFarm) return;
    setIsLoadingDetails(true);
    try {
      const response = await axiosInstance.post('individual-pin/', {
        farmName: selectedFarm.norg, // значение названия хозяйства
        farmCode: selectedFarm.korg, // значение кода хозяйства
      });

      navigate('/data-pin', {
        state: {
          farmName: selectedFarm.norg,
          farmCode: selectedFarm.korg,
          lactation_data: response.data.lactation_data,
          breeding_value_of_milk_productivity: response.data.breeding_value_of_milk_productivity,
          relative_breeding_value_of_milk_productivity: response.data.relative_breeding_value_of_milk_productivity,
          forecasting_1: response.data.forecasting_1,
          forecasting_2: response.data.forecasting_2,
          forecasting_3: response.data.forecasting_3,
          forecasting_4: response.data.forecasting_4,
          aggregatedData: response.data.aggregated_data,
          density_data: response.data.density_data,
          parameterForecastingData: response.data.parameter_forecasting,
        },
      });
    } catch (error) {
      console.error("Ошибка получения данных хозяйства: ", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className={`farmchouse-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h2>Поиск хозяйства</h2>
      <form onSubmit={handleSearch} className="farmchouse-form">
        <div className="form-group">
          <label className="form-label">Искать по:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="searchMethod"
                value="code"
                checked={searchMethod === 'code'}
                onChange={() => setSearchMethod('code')}
              />
              <span>Код хозяйства</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="searchMethod"
                value="name"
                checked={searchMethod === 'name'}
                onChange={() => setSearchMethod('name')}
              />
              <span>Название хозяйства</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Введите значение поиска:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Введите код или название хозяйства"
            required
          />
        </div>
        <button type="submit" className="search-button">Найти</button>
      </form>

      {/* Анимация загрузки при поиске */}
      {isLoadingSearch && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка хозяйств...</p>
        </div>
      )}

      {/* Если элемент выбран – отображаем выбранное хозяйство и кнопку подтверждения */}
      {selectedFarm && (
        <div className="selected-farm">
          <p>
            Вы выбрали: <strong>{selectedFarm.norg}</strong> (Код: {selectedFarm.korg})
          </p>
          <button className="confirm-button" onClick={handleConfirmSelection}>
            {isLoadingDetails ? 'Загрузка данных...' : 'Подтвердить выбор'}
          </button>
        </div>
      )}

      {/* Список результатов с прокруткой */}
      {!isLoadingSearch && farmResults.length > 0 && (
        <div className="farm-results-list">
          {farmResults.map((farm) => (
            <div
              key={farm.korg}
              className={`farm-result-item ${selectedFarm && selectedFarm.korg === farm.korg ? 'selected' : ''}`}
              onClick={() => handleSelectFarm(farm)}
            >
              <span className="farm-code">{farm.korg}</span> – <span className="farm-name">{farm.norg}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default FarmChouse;
