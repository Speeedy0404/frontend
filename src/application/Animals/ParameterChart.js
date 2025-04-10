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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTheme } from "../ThemeContext.js"; // Импортируем хук useTheme
import "./ParameterChart.css";

// Регистрируем компоненты и плагин
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ParameterChart = ({ data }) => {
  // Используем useTheme для получения флага, включена ли тёмная тема
  const { isDarkMode } = useTheme();

  const labels = [
    "Тип",
    "Крепость телосложения",
    "Рост",
    "Глубина туловища",
    "Положение зада",
    "Ширина зада",
    "Постановка задних конечностей (сбоку)",
    "Постановка задних конечностей (сзади)",
    "Выраженность скакательного сустава",
    "Постановка задних копыт",
    "Глубина вымени",
    "Прикрепление передней доли вымени",
    "Высота задней части вымени",
    "Ширина задней части вымени",
    "Центральная связка (глубина доли)",
    "Расположение передних сосков",
    "Расположение задних сосков",
    "Длина сосков (передних)"
  ];

  const values = Object.values(data);

  const filteredData = values.map((value, index) => ({
    label: labels[index],
    value: value < 100 ? -(100 - value) : value - 100,
  }));

  const chartData = {
    labels: filteredData.map(item => item.label),
    datasets: [
      {
        label: "Показатель в сравнении с 100",
        data: filteredData.map(item => item.value),
        backgroundColor: filteredData.map(item =>
          item.value <= 0
            ? (isDarkMode ? "rgba(255, 99, 132, 0.8)" : "rgba(255, 99, 132, 0.5)")
            : (isDarkMode ? "rgba(75, 192, 192, 0.8)" : "rgba(75, 192, 192, 0.5)")
        ),
        borderColor: filteredData.map(item =>
          item.value <= 0
            ? "rgba(255, 99, 132, 1)"
            : "rgba(75, 192, 192, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    indexAxis: "y",
    scales: {
      x: {
        min: -20,
        max: 20,
        grid: {
          color: isDarkMode ? "#555" : "#e0e0e0",
        },
        ticks: {
          stepSize: 5,
          color: isDarkMode ? "white" : "#333",
          font: {
            size: 14,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            weight: "bold"
          },
          callback: function (value) {
            return value + 100;
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: isDarkMode ? "#555" : "#e0e0e0",
        },
        ticks: {
          color: isDarkMode ? "white" : "#333",
          font: {
            size: 14,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            weight: "bold"
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: isDarkMode ? "white" : "#333",
        },
      },
      datalabels: {
        display: true,
        align: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value < 0 ? "end" : "start";
        },
        anchor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value < 0 ? "end" : "start";
        },
        formatter: (value) => {
          return value < 0 ? 100 - Math.abs(value) : 100 + value;
        },
        color: isDarkMode ? "white" : "black",
        font: {
          weight: "bold",
          size: 12,
        },
        offset: 5,
      },
    },
  };

  return (
    <div className="card">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ParameterChart;

// import React from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import { useTheme } from "../ThemeContext.js"; // Импортируем хук useTheme
// import "./ParameterChart.css";

// // Регистрируем компоненты и плагин
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartDataLabels
// );

// const ParameterChart = ({ data,klichka }) => {
//   const { isDarkMode } = useTheme();

//   const labels = [
//     "Тип",
//     "Крепость телосложения",
//     "Рост",
//     "Глубина туловища",
//     "Положение зада",
//     "Ширина зада",
//     "Постановка задних конечностей (сбоку)",
//     "Постановка задних конечностей (сзади)",
//     "Выраженность скакательного сустава",
//     "Постановка задних копыт",
//     "Глубина вымени",
//     "Прикрепление передней доли вымени",
//     "Высота задней части вымени",
//     "Ширина задней части вымени",
//     "Центральная связка (глубина доли)",
//     "Расположение передних сосков",
//     "Расположение задних сосков",
//     "Длина сосков (передних)"
//   ];

//   const values = Object.values(data);

//   const filteredData = values.map((value, index) => ({
//     label: labels[index],
//     value: value < 100 ? -(100 - value) : value - 100,
//   }));

//   const chartData = {
//     labels: filteredData.map(item => item.label),
//     datasets: [
//       {
//         label: "Показатель в сравнении с 100",
//         data: filteredData.map(item => item.value),
//         backgroundColor: filteredData.map(item =>
//           item.value <= 0
//             ? (isDarkMode ? "rgba(255, 99, 132, 0.8)" : "rgba(255, 99, 132, 0.5)")
//             : (isDarkMode ? "rgba(75, 192, 192, 0.8)" : "rgba(75, 192, 192, 0.5)")
//         ),
//         borderColor: filteredData.map(item =>
//           item.value <= 0
//             ? "rgba(255, 99, 132, 1)"
//             : "rgba(75, 192, 192, 1)"
//         ),
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     maintainAspectRatio: false,
//     responsive: true,
//     indexAxis: "y",
//     scales: {
//       x: {
//         min: -20,
//         max: 20,
//         grid: {
//           color: isDarkMode ? "#555" : "#e0e0e0",
//         },
//         ticks: {
//           stepSize: 5,
//           color: isDarkMode ? "white" : "#333",
//           font: {
//             size: 14,
//             family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
//             weight: "bold"
//           },
//           callback: function (value) {
//             return value + 100;
//           },
//         },
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           display: true,
//           color: isDarkMode ? "#555" : "#e0e0e0",
//         },
//         ticks: {
//           color: isDarkMode ? "white" : "#333",
//           font: {
//             size: 14,
//             family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
//             weight: "bold"
//           },
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         display: false,
//         labels: {
//           color: isDarkMode ? "white" : "#333",
//         },
//       },
//       datalabels: {
//         display: true,
//         align: (context) => {
//           const value = context.dataset.data[context.dataIndex];
//           return value < 0 ? "end" : "start";
//         },
//         anchor: (context) => {
//           const value = context.dataset.data[context.dataIndex];
//           return value < 0 ? "end" : "start";
//         },
//         formatter: (value) => {
//           return value < 0 ? 100 - Math.abs(value) : 100 + value;
//         },
//         color: isDarkMode ? "white" : "black",
//         font: {
//           weight: "bold",
//           size: 12,
//         },
//         offset: 5,
//       },
//     },
//   };

//   const handlePrint = () => {
//     // Создаем новый стиль для печати, чтобы показать только график
//     const printStyle = `
//       @media print {
//         body * {
//           visibility: hidden;
//         }
//         .card, .card * {
//           visibility: visible;
//         }
//         .card {
//           position: absolute;
//           left: 0;
//           top: 0;
//         }
//       }
//     `;

//     // Добавляем стиль в документ
//     const styleSheet = document.createElement("style");
//     styleSheet.type = "text/css";
//     styleSheet.innerText = printStyle;
//     document.head.appendChild(styleSheet);

//     // Вызываем печать
//     window.print();
//   };

//   return (
//     <div className="card">
//       <button onClick={handlePrint} className="print-button">
//         Печать графика
//       </button>
//       <h1 style={{ textAlign: "center" }}>{klichka}</h1>
//       <Bar data={chartData} options={chartOptions} />
//     </div>
//   );
// };

// export default ParameterChart;