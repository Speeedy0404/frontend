import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Импортируем плагин

// Регистрируем компоненты Chart.js и плагин данных
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const ParameterChart = ({ data }) => {

    // Получаем ключи (метки) и значения из переданных данных
    //   const labels = Object.keys(data);
    const labels = [
        'Тип', 'Крепость телосложения', 'Рост', 'Глубина туловища', 'Положение зада',
        'Ширина зада', 'Постановка задних конечностей (сбоку)', 'Постановка задних конечностей (сзади)', 'Выраженность скакательного сустава', 'Постановка задних копыт',
        'Глубина вымени', 'Прикрепление передней долей вымени', 'Высота задней части вымени', 'Ширина задней части вымени', 'Центральная связка (глубина доли)',
        'Расположение пердних сосков', 'Расположение задних сосков', 'Длина сосков (передних)'
    ];
    const values = Object.values(data);


    // Фильтрация и подготовка данных для диаграммы
    const filteredData = values.map((value, index) => ({
        label: labels[index],
        value: value < 100 ? -(100 - value) : value - 100, // Расчет разницы для значений меньше и больше 100
    }));

    // Данные для диаграммы
    const chartData = {
        labels: filteredData.map(data => data.label),
        datasets: [
            {
                label: 'Параметр в сравнении с 100',
                data: filteredData.map(data => data.value),
                backgroundColor: filteredData.map(data =>
                    data.value <= 0 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(75, 192, 192, 0.5)' // Цвет в зависимости от значения
                ),
                borderColor: filteredData.map(data =>
                    data.value <= 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'
                ),
                borderWidth: 1,
            },
        ],
    };

    // Опции для диаграммы
    const chartOptions = {
        indexAxis: 'y', // Горизонтальная диаграмма
        scales: {
            x: {
                min: -20, // Устанавливаем минимальное значение для оси X
                max: 20, // Максимальное значение для более четкого отображения правой стороны
                grid: {
                    color: '#e0e0e0', // Цвет сетки
                },
                ticks: {
                    stepSize: 5, // Шаг значений на оси X
                    callback: function (value) {
                        return value + 100; // Изменяем отображение значений на оси X, добавляя центральную линию 100
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                display: true,
                align: (context) => {
                    const value = context.dataset.data[context.dataIndex]; // Получаем текущее значение
                    return value < 0 ? 'end' : 'start'; // Определяем выравнивание
                },
                anchor: (context) => {
                    const value = context.dataset.data[context.dataIndex]; // Получаем текущее значение
                    return value < 0 ? 'end' : 'start'; // Определяем анкер
                },
                formatter: (value) => {
                    return value < 0 ? (100 - Math.abs(value)) : (100 + value); // Форматируем значения
                },
                color: 'black',
                font: {
                    weight: 'bold',
                    size: 12,
                },
                offset: 5, // Отступ
            },
        },
    };

    return (
        <div  className="card" > 
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default ParameterChart;
