import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DensityChart = ({ datasets }) => {

    const [selectedLine, setSelectedLine] = useState(0);

     // Проверка на наличие данных
     if (!datasets || datasets.length < 1) {
        return null; // Не отображаем ничего, если datasets пуст или не существует
    }

    // Массив цветов для линий
    const lineColors = [
        'rgba(255, 99, 132, 1)',    // Красный
        'rgba(54, 162, 235, 1)',    // Синий
        'rgba(255, 206, 86, 1)',    // Желтый
        'rgba(75, 192, 192, 1)',    // Бирюзовый
        'rgba(153, 102, 255, 1)',   // Фиолетовый
        'rgba(255, 159, 64, 1)',    // Оранжевый

    ];

    // Генерация выбранной линии
    const generateDataset = {
        label: datasets[selectedLine].name,
        data: datasets[selectedLine].data,
        fill: false,
        borderColor: lineColors[selectedLine % lineColors.length],
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        datalabels: {
            display: false,
        },
    };


    const chartData = {
        labels: datasets[selectedLine].labels,
        datasets: [generateDataset],
    };


    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Диаграмма распределения плотности (однострочный дисплей)',
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Значения',
                },
                ticks: {
                    callback: function (value) {
                        return parseFloat(this.getLabelForValue(value)).toFixed(2);
                    },
                    maxTicksLimit: 10,
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Количество / Плотность',
                },
            },
        },
    };


    const handleLineChange = (event) => {
        setSelectedLine(parseInt(event.target.value));
    };

    return (
        <div>

            <div style={{ marginBottom: '10px' }}>
                <label>
                    Выберите линию для отображения:<span> </span>
                    <select
                        value={selectedLine}
                        onChange={handleLineChange}
                        style={{
                            width: '350px',
                            height: '40px',
                            border: `2px solid ${selectedLine !== null ? 'black' : 'gray'}`,
                            borderRadius: '4px',
                            padding: '5px',
                            fontSize: '16px',
                        }}
                    >
                        {datasets.map((dataset, index) => (
                            <option key={index} value={index}>
                                {dataset.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>


            <Line data={chartData} options={options} />
        </div>
    );
};

export default DensityChart;

