import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useTheme } from '../../application/ThemeContext';
import './Pin.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DensityChart = ({ datasets }) => {
    const { isDarkMode } = useTheme();
    const [selectedLine, setSelectedLine] = useState(0);

    if (!datasets || datasets.length < 1) {
        return null;
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

    const generateDataset = {
        label: datasets[selectedLine].name,
        data: datasets[selectedLine].data,
        fill: false,
        borderColor: lineColors[selectedLine % lineColors.length],
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        datalabels: {
            display: false
        },
    };

    const chartData = {
        labels: datasets[selectedLine].labels,
        datasets: [generateDataset],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Позволяет графику занять всю высоту контейнера
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: isDarkMode ? '#fff' : '#000',
                },
            },
            title: {
                display: true,
                text: 'График распределения плотности',
                color: isDarkMode ? '#fff' : '#000',
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Значения',
                    color: isDarkMode ? '#fff' : '#000',
                },
                ticks: {
                    color: isDarkMode ? '#fff' : '#000',
                    callback: function (value) {
                        return parseFloat(this.getLabelForValue(value)).toFixed(2);
                    },
                    maxTicksLimit: 10,
                },
                grid: {
                    color: isDarkMode ? '#444' : '#ccc',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Количество / Плотность',
                    color: isDarkMode ? '#fff' : '#000',
                },
                ticks: {
                    color: isDarkMode ? '#fff' : '#000',
                },
                grid: {
                    color: isDarkMode ? '#444' : '#ccc',
                },
            },
        },
    };

    const handleLineChange = (event) => {
        setSelectedLine(parseInt(event.target.value, 10));
    };

    return (
        <div className="density-chart-wrapper">
            <div className="density-chart-select" style={{ marginBottom: '10px' }}>
                <label style={{ padding: '5px', marginTop: '30px' }}>
                    Выберите линию для отображения:
                    <select
                        value={selectedLine}
                        onChange={handleLineChange}
                        style={{
                            width: '90%',        // занимает всю доступную ширину родительского контейнера
                            maxWidth: '330px',     // но не больше 350px на больших экранах
                            height: '40px',
                            border: `2px solid ${isDarkMode ? '#fff' : 'black'}`,
                            borderRadius: '2px',
                            padding: '10px',
                            fontSize: '16px',
                            backgroundColor: isDarkMode ? '#333' : '#fff',
                            color: isDarkMode ? '#fff' : '#000'
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
            <div className="density-chart-container">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default DensityChart;
