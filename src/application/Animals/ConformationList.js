import React from 'react';
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import './ConformationList.css';

// Заданные метки
const labels = [
  'Тип',
  'Крепость телосложения',
  'Рост',
  'Глубина туловища',
  'Положение зада',
  'Ширина зада',
  'Постановка задних конечностей (сбоку)',
  'Постановка задних конечностей (сзади)',
  'Выраженность скакательного сустава',
  'Постановка задних копыт',
  'Глубина вымени',
  'Прикрепление передней доли вымени',
  'Высота задней части вымени',
  'Ширина задней части вымени',
  'Центральная связка (глубина доли)',
  'Расположение передних сосков',
  'Расположение задних сосков',
  'Длина сосков (передних)'
];

// Функция для определения цвета значения
const getColorForValue = (value) => {
  if (value < 100) return "red";
  if (value >= 100 && value <= 120) return "orange";
  return "green";
};

const ConformationList = ({ data }) => {
  const values = Object.values(data);

  // Делим данные на два столбца: первые 9 меток и последние 9 меток
  const firstColumnLabels = labels.slice(0, 9);
  const firstColumnValues = values.slice(0, 9);
  const secondColumnLabels = labels.slice(9);
  const secondColumnValues = values.slice(9);

  return (
    <Card className="conformation-card">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Показатели оценки экстерьера
        </Typography>
        <Divider className="conformation-divider" />
        <Grid container spacing={2}>
          {/* Левый столбец */}
          <Grid item xs={6}>
            <Grid container spacing={1}>
              {firstColumnLabels.map((label, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={8}>
                    <Typography variant="body2" className="conformation-label">
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="body2"
                      className="conformation-value"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "right",
                        color:
                          firstColumnValues[index] !== undefined
                            ? getColorForValue(firstColumnValues[index])
                            : "gray",
                      }}
                    >
                      {firstColumnValues[index] !== undefined
                        ? firstColumnValues[index]
                        : "Нет данных"}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Grid>

          {/* Правый столбец */}
          <Grid item xs={6}>
            <Grid container spacing={1}>
              {secondColumnLabels.map((label, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={8}>
                    <Typography variant="body2" className="conformation-label">
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="body2"
                      className="conformation-value"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "right",
                        color:
                          secondColumnValues[index] !== undefined
                            ? getColorForValue(secondColumnValues[index])
                            : "gray",
                      }}
                    >
                      {secondColumnValues[index] !== undefined
                        ? secondColumnValues[index]
                        : "Нет данных"}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ConformationList;
