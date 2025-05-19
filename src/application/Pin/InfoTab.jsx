import React from 'react';
import SimpleTable from './SimpleTable';
import DensityChart from './DensityChart'; // Ваш компонент графика или placeholder
import './Pin.css';

const InfoTab = ({ lac, breeding_value_of_milk_productivity, relative_breeding_value_of_milk_productivity, density_data }) => {
  return (
    <div className="info-tab">
      {/* Контейнер для таблиц */}
      <div className="tables-container">
        <div className="table-item">
          <h3>Молочная продуктивность</h3>
          <SimpleTable
            headers={[
              { label: "Лактация", key: "lak" },
              { label: "Кол-во", key: "count_u305" },
              { label: "Удой кг", key: "avg_u305" },
              { label: "Жир кг", key: "avg_j305kg" },
              { label: "Жир %", key: "fat_percentage" },
              { label: "Белок кг", key: "avg_b305kg" },
              { label: "Белок %", key: "protein_percentage" }
            ]}
            customData={lac}
            rows={3}
          />
        </div>
        <div className="table-item">
          <h3>Племенная ценность молочной продуктивности</h3>
          <SimpleTable
            headers={[
              { label: "Показатель", key: "param" },
              { label: "Кол-во", key: "count" },
              { label: "Сред", key: "avg" },
              { label: "Мин", key: "min" },
              { label: "Макс", key: "max" },
              { label: "Сигма", key: "stddev" },
              { label: "Медиана", key: "median" },
            ]}
            customData={breeding_value_of_milk_productivity}
            rows={9}
          />
        </div>
        <div className="table-item">
          <h3>Относительная племенная ценность молочной продуктивности</h3>
          <SimpleTable
            headers={[
              { label: "Показатель", key: "param" },
              { label: "Кол-во", key: "count" },
              { label: "Сред", key: "avg" },
              { label: "Мин", key: "min" },
              { label: "Макс", key: "max" },
              { label: "Сигма", key: "stddev" },
              { label: "Медиана", key: "median" },
            ]}
            customData={relative_breeding_value_of_milk_productivity}
            rows={10}
          />
        </div>
      </div>

      {/* Контейнер для графика */}
      <div className="chart-container">
        <h3>График распределения плотности</h3>
        <div className="density-chart-placeholder">
          <DensityChart datasets={density_data} />
        </div>
      </div>
    </div>
  );
};

export default InfoTab;
