import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import './Statistics.css';
import LakTable from '../DataDisplay/Tables/LakTable';
import MilkTable from '../DataDisplay/Tables/MilkTable';
import RelativeBreedingValueTable from '../DataDisplay/Tables/RelativeBreedingValueTable';
import { useLocation } from 'react-router-dom';

const Statistics = () => {
    const [aggregatedData, setAggregatedData] = useState(null);
    const [count, setCount] = useState('');
    const [inAssessment, setInAssessment] = useState('');

    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('statistics/');
                setAggregatedData(response.data.aggregated_data);
                setCount(response.data.info.count);
                setInAssessment(response.data.info.in_assessment);
            } catch (error) {
                console.error('Ошибка получения данных', error);
            }
        };

        fetchData();
    }, [location.pathname]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="statistics-container">
            <button onClick={handlePrint} className="print-button">Распечатать</button>
            <div className="summary-item">
                <strong>Коров всего:</strong> {count}
            </div>
            <div className="summary-item">
                <strong>Коров в оценке:</strong> {inAssessment}
            </div>
            {aggregatedData && (
                <>
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
        </div>
    );
};

export default Statistics;
