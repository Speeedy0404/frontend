import React from 'react';
import './Pin.css';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const formatNumber = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return value;

  if (Number.isInteger(number)) {
    return number;
  }

  const integerPart = Math.floor(Math.abs(number));

  if (integerPart >= 10) {
    return Math.round(number);
  } else {
    return number.toFixed(2);
  }
};

const SimpleTable = ({ headers, rows, customData }) => {
  let data;
  if (customData) {
    data = customData;
  } else {
    data = Array.from({ length: rows }, (_, rowIndex) =>
      headers.reduce(
        (acc, header, colIndex) => ({
          ...acc,
          [header.key]: `Данные ${rowIndex + 1}-${colIndex + 1}`
        }),
        {}
      )
    );
  }

  return (
    <div className="table-container simple-table">
      <table className="data-table">
        
        <thead>
          <tr>
            {headers.map((h, idx) => {
              const isTruncated = h.label.length > 30;
              const displayText = isTruncated ? h.label.slice(0, 24) + '…' : h.label;

              return (
                <th key={idx}>
                  <Tooltip title={h.label}>
                    <span style={{ cursor: isTruncated ? 'help' : 'default' }}>{displayText}</span>
                  </Tooltip>
                  {isTruncated && (
                    <InfoOutlinedIcon
                      onClick={() => alert(h.label)}
                      style={{
                        fontSize: 16,
                        marginLeft: 6,
                        color: '#888',
                        cursor: 'pointer',
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {headers.map((h, i) => {
                let cellValue = row[h.key];

                // Проверяем и форматируем только числа
                if (!isNaN(parseFloat(cellValue)) && isFinite(cellValue)) {
                  cellValue = formatNumber(cellValue);
                }

                // Спец. стиль для "Прогноз"
                if (h.label === "Прогнозируемый эффект селекции потомства от скрещивания закрепленных коров и быков на поколение") {
                  const numericValue = parseFloat(cellValue);
                  const color = numericValue >= 0 ? 'green' : 'red';
                  cellValue = <span style={{ color }}>{cellValue}</span>;
                }
                if (h.label === "Среднее генетическое превосходство быков над коровами") {
                  const numericValue = parseFloat(cellValue);
                  const color = numericValue >= 0 ? 'green' : 'red';
                  cellValue = <span style={{ color }}>{cellValue}</span>;
                }

                return <td key={i}>{cellValue}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;