import React, { useState } from 'react';
import Button from '@mui/material/Button';
import SimpleTable from './SimpleTable';
import './Pin.css';
import { CircularProgress, Typography } from '@mui/material';

const apiUrl = process.env.REACT_APP_API_URL

const ForecastTab = ({ farmCode, forecasting_1, forecasting_2, forecasting_3, forecasting_4 }) => {

  const [loading, setLoading] = useState(false);

  const [forecasting_one, setForecastingDataOne] = useState(forecasting_1);
  const [forecasting_two, setForecastingDataTwo] = useState(forecasting_2);
  const [forecasting_three, setForecastingDataThree] = useState(forecasting_3);
  const [forecasting_four, setForecastingDataFour] = useState(forecasting_4);

  const handleParameterForecasting = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(`${apiUrl}/api/v1/parameter-forecasting/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
          'Kodrn': farmCode,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при прогнозировании');
      }

      const data = await response.json();

      if (data) {
        setForecastingDataOne(data.forecasting_data_one);
        setForecastingDataTwo(data.forecasting_data_two);
        setForecastingDataThree(data.forecasting_data_thee);
        setForecastingDataFour(data.forecasting_data_four);
        console.log(data.forecasting_data_one)
      } else {
        console.log('Похоже, не удалось получить прогноз');
      }

    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка при отправке данных');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forecast-tab">
      {/* <h3>Прогноз показателей</h3> */}

      {/* Выделяем область с кнопкой в отдельном блоке */}
      <div className="forecast-button-container">
        <Button
          variant="contained"
          color="primary"
          className="action-button forecast-button"
          onClick={handleParameterForecasting}
        >
          Прогнозировать
        </Button>
      </div>

      <div className="forecast-top">
        <div className="forecast-section table-item">
          <SimpleTable headers={[
            { label: "Показатель", key: "param" },
            { label: "Средняя генетическая ценность коров", key: "avg" },
            { label: "Среднее генетическое превосходство быков над коровами", key: "bull_superiority" },
            { label: "Прогнозируемый эффект селекции потомства от скрещивания закрепленных коров и быков на поколение", key: "predict" },
          ]}
            customData={forecasting_one}
            rows={5}
          />

        </div>
        <div className="forecast-section table-item">
          <SimpleTable headers={[
            { label: "Показатель", key: "param" },
            { label: "Средняя генетическая ценность коров", key: "avg" },
            { label: "Среднее генетическое превосходство быков над коровами", key: "bull_superiority" },
            { label: "Прогнозируемый эффект селекции потомства от скрещивания закрепленных коров и быков на поколение", key: "predict" },
          ]}
            customData={forecasting_two}
            rows={4}
          />
        </div>
      </div>
      <div className="forecast-bottom">
        <div className="forecast-half table-item">
          <SimpleTable headers={[
            { label: "Показатель", key: "param" },
            { label: "Средняя генетическая ценность коров", key: "avg" },
            { label: "Среднее генетическое превосходство быков над коровами", key: "bull_superiority" },
            { label: "Прогнозируемый эффект селекции потомства от скрещивания закрепленных коров и быков на поколение", key: "predict" },
          ]} customData={forecasting_three} rows={9} />
        </div>
        <div className="forecast-half table-item">
          <SimpleTable headers={[
            { label: "Показатель", key: "param" },
            { label: "Средняя генетическая ценность коров", key: "avg" },
            { label: "Среднее генетическое превосходство быков над коровами", key: "bull_superiority" },
            { label: "Прогнозируемый эффект селекции потомства от скрещивания закрепленных коров и быков на поколение", key: "predict" },
          ]} customData={forecasting_four} rows={9} />
        </div>
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <CircularProgress size={60} color={"primary"} />
            <Typography variant="h6" color={'white'} sx={{ mt: 2 }}>Прогнозирование...</Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastTab;
