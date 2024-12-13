import React from 'react';
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';

// Пример объекта для отображения
const labels = [
    'Тип', 'Крепость телосложения', 'Рост', 'Глубина туловища', 'Положение зада',
    'Ширина зада', 'Постановка задних конечностей (сбоку)', 'Постановка задних конечностей (сзади)', 
    'Выраженность скакательного сустава', 'Постановка задних копыт',
    'Глубина вымени', 'Прикрепление передней долей вымени', 'Высота задней части вымени', 
    'Ширина задней части вымени', 'Центральная связка (глубина доли)',
    'Расположение передних сосков', 'Расположение задних сосков', 'Длина сосков (передних)'
];

// Функция для определения цвета на основе значения
const getColorForValue = (value) => {
    if (value < 100) return 'red';
    if (value >= 100 && value <= 120) return 'orange';
    return 'green';
};

const ConformationList = ({ data }) => {
    const values = Object.values(data);

    // Разделяем данные на две части: первые 9 и последние 9 элементов
    const firstColumnLabels = labels.slice(0, 9);
    const firstColumnValues = values.slice(0, 9);
    const secondColumnLabels = labels.slice(9);
    const secondColumnValues = values.slice(9);

    return (
        <Card sx={{ maxWidth: 1000, margin: 'auto', backgroundColor: '#f9f9f9' }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Показатели оценки экстерьера
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                
                {/* Сетка для двух столбцов */}
                <Grid container spacing={2}>
                    {/* Левый столбец */}
                    <Grid item xs={6}>
                        <Grid container spacing={1}>
                            {firstColumnLabels.map((label, index) => (
                                <React.Fragment key={index}>
                                    {/* Метка в первой колонке */}
                                    <Grid item xs={8}>
                                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                            {label}
                                        </Typography>
                                    </Grid>
                                    {/* Значение напротив метки с цветовой индикацией */}
                                    <Grid item xs={4}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: firstColumnValues[index] !== undefined ? getColorForValue(firstColumnValues[index]) : 'gray',
                                                textAlign: 'right'
                                            }}
                                        >
                                            {firstColumnValues[index] !== undefined ? firstColumnValues[index] : 'Нет данных'}
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
                                    {/* Метка в первой колонке */}
                                    <Grid item xs={8}>
                                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                            {label}
                                        </Typography>
                                    </Grid>
                                    {/* Значение напротив метки с цветовой индикацией */}
                                    <Grid item xs={4}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: secondColumnValues[index] !== undefined ? getColorForValue(secondColumnValues[index]) : 'gray',
                                                textAlign: 'right'
                                            }}
                                        >
                                            {secondColumnValues[index] !== undefined ? secondColumnValues[index] : 'Нет данных'}
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
