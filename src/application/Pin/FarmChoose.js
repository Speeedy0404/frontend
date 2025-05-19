import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { Search, CheckCircle, List, Building2 } from 'lucide-react';
import './FarmChoose.css';

const FarmChoose = () => {
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
        farmName: selectedFarm.norg,
        farmCode: selectedFarm.korg,
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
      <h2><Search size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Поиск хозяйства</h2>
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
            aria-label="Поисковое значение"
            required
          />
        </div>
        <button type="submit" className="search-button">
          <Search size={16} style={{ marginRight: '8px' }} /> Найти
        </button>
      </form>

      {isLoadingSearch && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка хозяйств...</p>
        </div>
      )}

      {selectedFarm && (
        <div className="selected-farm">
          <p>
            <Building2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Вы выбрали: <strong>{selectedFarm.norg}</strong> (Код: {selectedFarm.korg})
          </p>
          <button className="confirm-button" onClick={handleConfirmSelection}>
            <CheckCircle size={16} style={{ marginRight: '8px' }} />
            {isLoadingDetails ? 'Загрузка данных...' : 'Подтвердить выбор'}
          </button>
        </div>
      )}

      {!isLoadingSearch && farmResults.length > 0 && (
        <>
          <h3 style={{ display: 'flex', alignItems: 'center', marginTop: '20px', fontSize: '1.25rem' }}>
            <List size={20} style={{ marginRight: '8px' }} /> Найденные хозяйства
          </h3>
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
        </>
      )}
    </div>
  );
};

export default FarmChoose;
