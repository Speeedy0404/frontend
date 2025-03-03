import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import './Statistics.css';
import LakTable from '../DataDisplay/Tables/LakTable';
import RatingTable from './RatingTable';
import MilkTable from '../DataDisplay/Tables/MilkTable';
import RelativeBreedingValueTable from '../DataDisplay/Tables/RelativeBreedingValueTable';
import { useLocation } from 'react-router-dom';
import { Typography, CircularProgress, Button } from '@mui/material';

const Statistics = () => {
    const [loading, setLoading] = useState(false);
    const [aggregatedData, setAggregatedData] = useState(null);
    const [ratingData, setRatingData] = useState(null);
    const [state, setState] = useState('statistics');
    const [count, setCount] = useState('');
    const [inAssessment, setInAssessment] = useState('');

    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get('statistics/');
                setAggregatedData(response.data.aggregated_data);
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="statistics-container">
            {/* <button onClick={handlePrint} className="print-button">Распечатать</button> */}

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
            {aggregatedData && state === 'statistics' && (
                <>
                    <div className="summary-item">
                        <strong>Коров всего:</strong> {count}
                    </div>
                    <div className="summary-item">
                        <strong>Коров в оценке:</strong> {inAssessment}
                    </div>
                    <div className="table-title"></div>
                    <LakTable data={aggregatedData} />
                    {aggregatedData.milk && aggregatedData.median_milk && (
                        <>
                            <div className="table-title"></div>
                            <MilkTable data={aggregatedData.milk} data_second={aggregatedData.median_milk} />
                        </>
                    )}
                    <div className="table-title"></div>
                    <RelativeBreedingValueTable data={aggregatedData} />
                </>
            )}
            {ratingData && state === 'rating' && (
                    <RatingTable ratingData={ratingData} />
            )}

        </div>
    );
};

export default Statistics;
