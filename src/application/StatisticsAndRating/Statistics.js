import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import RatingTable from './RatingTable';
import SimpleTable from '../Pin/SimpleTable';
import './Statistics.css';
import { useLocation } from 'react-router-dom';
import { Typography, CircularProgress, Button } from '@mui/material';
import { useTheme as useCustomTheme } from "../ThemeContext"; // Импортируем хук useTheme

const Statistics = () => {
    const [loading, setLoading] = useState(false);
    const [lac, setLac] = useState(null);
    const [breeding_value_of_milk_productivity, setBreedingvalueOfMilkProductivity] = useState(null);
    const [relative_breeding_value_of_milk_productivity, setRelativeBreedingValueOfMilkProductivity] = useState(null);

    const [ratingData, setRatingData] = useState(null);
    const [state, setState] = useState('statistics');
    const [count, setCount] = useState('');
    const [inAssessment, setInAssessment] = useState('');

    const { isDarkMode } = useCustomTheme();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get('statistics/');
                setLac(response.data.lactation_data);
                setBreedingvalueOfMilkProductivity(response.data.breeding_value_of_milk_productivity);
                setRelativeBreedingValueOfMilkProductivity(response.data.relative_breeding_value_of_milk_productivity);
                setCount(response.data.info.count);
                setInAssessment(response.data.info.in_assessment);
                setLoading(false)
            } catch (error) {
                console.error('Ошибка получения данных', error);
            }
        };

        fetchData();
    }, [location.pathname]);

    const handleSetStateStatistics = (event) => {
        event.preventDefault();
        setState('statistics')
    }

    const handleGetRatingData = async (event) => {
        event.preventDefault();
        setState('rating')
        if (ratingData === null) {
            try {
                setLoading(true);
                const response = await axiosInstance.get('rating-of-farms/');
                if (response.data.rating_data) {
                    setRatingData(response.data.rating_data);
                } else {
                    console.log('Похоже, не удалось получить для рейтинга');
                }
            } catch (error) {
                console.error('Ошибка отправки:', error);
                alert('Произошла ошибка при отправке данных');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="statistics-container" data-theme={isDarkMode ? "dark" : "light"}>

            <div style={{ display: 'flex', alignItems: 'center', padding: '5px', flexDirection: 'row', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
                <Button onClick={handleSetStateStatistics} variant="contained" style={{ marginBottom: '5px', width: '200px' }}>
                    Статистика
                </Button>
                <Button onClick={handleGetRatingData} variant="contained" style={{ marginBottom: '5px', width: '200px' }}>
                    Рейтинг хозяйств
                </Button>
            </div>
            {loading && (
                <div style={{ textAlign: 'center' }}>
                    <Typography variant="h6">Загрузка ...</Typography>
                    <CircularProgress />
                </div>
            )}
            {count && inAssessment && lac && breeding_value_of_milk_productivity && relative_breeding_value_of_milk_productivity && state === 'statistics' && (
                <>
                    <div className="summary-item">
                        <strong>Коров всего:</strong> {count}
                    </div>
                    <div className="summary-item">
                        <strong>Коров в оценке:</strong> {inAssessment}
                    </div>



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
                                    { label: "Сред.", key: "avg" },
                                    { label: "Мин.", key: "min" },
                                    { label: "Макс.", key: "max" },
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
                                    { label: "Сред.", key: "avg" },
                                    { label: "Мин.", key: "min" },
                                    { label: "Макс.", key: "max" },
                                    { label: "Сигма", key: "stddev" },
                                    { label: "Медиана", key: "median" },
                                ]}
                                customData={relative_breeding_value_of_milk_productivity}
                                rows={10}
                            />
                        </div>
                    </div>
                </>
            )}
            {ratingData && state === 'rating' && (
                <RatingTable ratingData={ratingData} isDarkMode={isDarkMode} />
            )}

        </div>
    );
};

export default Statistics;
