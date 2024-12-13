// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// // Регистрация компонентов Chart.js
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const DensityChart = ({ data, labels }) => {

//     // // Округляем значения данных до 4-х знаков после запятой
//     // const roundedData = data.map(value => Number(value.toFixed(4))); // Округление до 4-х знаков после запятой
//     // const roundedLabels = labels.map(value => Number(value.toFixed(4))); // Округление для меток, если это необходимо

//     // // Отображаем каждую 100-ю точку
//     // const reducedData = roundedData.filter((_, index) => index % 10 === 0);
//     // const reducedLabels = roundedLabels.filter((_, index) => index % 10 === 0);

//     const chartData = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'Распределение плотности',
//                 data: data,
//                 fill: false,
//                 borderColor: 'rgba(75,192,192,1)',
//                 tension: 0.4,
//                 pointRadius: 0,
//                 borderWidth: 2,
//                 datalabels: {
//                     display: false,
//                 },
//                 hidden: true
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: 'Density Distribution Chart',
//             },
//             tooltip: {
//                 enabled: true, // Включить всплывающие подсказки
//                 mode: 'index', // Можно настроить режим отображения
//                 intersect: false,
//             }
//         },
//         scales: {
//             x: {
//                 title: {
//                     display: true,
//                     text: 'X-Axis Label',
//                 },
//                 ticks: {
//                     callback: function (value, index, values) {
//                         return parseFloat(this.getLabelForValue(value)).toFixed(2); // Округляем до 2 знаков
//                     },
//                     maxTicksLimit: 10, // Ограничиваем количество меток на оси X
//                 }
//             },
//             y: {
//                 title: {
//                     display: true,
//                     text: 'Density',
//                 },
//             },
//         },
//     };


//     return (
//         <div>
//             <Line data={chartData} options={options} />
//         </div>
//     );
// };

// export default DensityChart;

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DensityChart = ({ datasets }) => {

    const [selectedLine, setSelectedLine] = useState(0);

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
                            width: '340px',
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

