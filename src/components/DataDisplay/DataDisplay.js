import React, { useState, useEffect } from 'react';
import './DataDisplay.css';
import LakTable from './Tables/LakTable';
import MilkTable from './Tables/MilkTable';
import { useLocation } from 'react-router-dom';
import ResizableCowTable from './Tables/animal/ResizableCowTable';
import ResizableBullTable from './Tables/animal/ResizableBullTable';
import ResizableYoungAnimalTable from './Tables/animal/ResizableYoungAnimalTable'
import FilterBullTable from './Tables/animal/FilterBullTable';
import RelativeBreedingValueTable from './Tables/RelativeBreedingValueTable';
import DensityChart from './DensityChart/DensityChart';
const apiUrl = process.env.REACT_APP_API_URL
const DataDisplay = () => {
    const location = useLocation();
    const { aggregatedData, info, density_data } = location.state || {};
    const { farm, gpp, gppCode, farmCode, count, in_assessment } = info || {};
    const [complexInput, setComplexInput] = useState('');
    const [complexInputYoung, setComplexInputYoung] = useState('');
    const [data, setData] = useState('')
    const [isCow, setIsCow] = useState(localStorage.getItem('isCow') === 'True');
    const [filterValues, setFilterValues] = useState({
        minEBVUdoi: '',
        maxEBVUdoi: '',
        minEBVZhirKg: '',
        maxEBVZhirKg: '',
        minEBVZhirPprc: '',
        maxEBVZhirPprc: '',
        minEBVBelokKg: '',
        maxEBVBelokKg: '',
        minEBVBelokPprc: '',
        maxEBVBelokPprc: '',
        minRBVT: '',
        maxRBVT: '',
        minRBVF: '',
        maxRBVF: '',
        minRBVU: '',
        maxRBVU: '',
        minRC: '',
        maxRC: '',
        minRF: '',
        maxRF: '',
        minRscs: '',
        maxRscs: '',
        minRBVZhirKg: '',
        maxRBVZhirKg: '',
        minRBVBelokKg: '',
        maxRBVBelokKg: '',
        minRM: '',
        maxRM: '',
        minPI: '',
        maxPI: '',
        selectedComplex: [],
    });

    useEffect(() => {
        localStorage.setItem('isCow', 'True');
    }, [isCow]);

    const toggleAnimalMode = () => {
        setIsCow(!isCow);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFilterValues({
            ...filterValues,
            [name]: value,
        });
    };

    const handleInputChangeFilter = (event) => {
        setComplexInput(event.target.value);
    };

    const handleInputChangeFilterYoung = (event) => {
        setComplexInputYoung(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        setFilterValues((prevValues) => {
            const selectedComplex = prevValues.selectedComplex;

            if (checked) {
                // Если чекбокс отмечен, добавляем значение в массив
                return {
                    ...prevValues,
                    selectedComplex: [...selectedComplex, value],
                };
            } else {
                return {
                    ...prevValues,
                    selectedComplex: selectedComplex.filter((item) => item !== value),
                };
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Предотвращает перезагрузку страницы
        try {
            const response = await fetch(`${apiUrl}/api/v1/filter/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                    'Kodgpp': gppCode
                },
                body: JSON.stringify(filterValues),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setData(result)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmitFilter = async (event) => {
        event.preventDefault();
    };

    const handleReset = () => {
        setData(''); // Сбрасывает данные
    };

    return (
        <div className="data-display-container">

            <div className="info-container">
                {isCow ?
                    (
                        <div className="info-item farm-info">
                            <h3>{farm}</h3>
                            <div className="summary-container">
                                <br></br>
                                <div className="summary-item">
                                    <strong>Коров всего:</strong> {count}
                                </div>
                                <div className="summary-item">
                                    <strong>Коров в оценке:</strong> {in_assessment}
                                </div>

                                <br></br>

                                <button onClick={toggleAnimalMode} style={{ backgroundColor: 'gray' }}>Молодняк</button>

                                <br></br>
                                <br></br>
                                <br></br>

                                <LakTable data={aggregatedData} />
                            </div>
                        </div>
                    ) :
                    (
                        <div className="info-item farm-info">
                            <h3>{farm}</h3>
                            <div className="summary-container">
                                <button onClick={toggleAnimalMode} style={{ backgroundColor: 'gray' }}>Коровы</button>
                            </div>
                        </div>
                    )
                }
                <div className="info-item gpp-info">
                    <h3>{gpp}</h3>
                    <div className="form-container">
                        <h2>Подбор</h2>
                        <form className="filter-form" onSubmit={handleSubmit}>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Комплекс:</label>
                                    <div className="checkbox-group">
                                        {['1', '2', '3', '4', '5', '6'].map((complex) => (
                                            <div key={complex}>
                                                <input
                                                    type="checkbox"
                                                    name="selectedComplex"
                                                    value={complex}
                                                    checked={filterValues.selectedComplex.includes(complex)}
                                                    onChange={handleCheckboxChange}
                                                />
                                                <label>{complex}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>EBV удой:</label>
                                    <input
                                        type="number"
                                        name="minEBVUdoi"
                                        placeholder="Min"
                                        value={filterValues.minEBVUdoi}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxEBVUdoi"
                                        placeholder="Max"
                                        value={filterValues.maxEBVUdoi}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-between"></div>
                                <div className="form-group">
                                    <label>RBVT:</label>
                                    <input
                                        type="number"
                                        name="minRBVT"
                                        placeholder="Min"
                                        value={filterValues.minRBVT}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxRBVT"
                                        placeholder="Max"
                                        value={filterValues.maxRBVT}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>EBV жир кг:</label>
                                    <input
                                        type="number"
                                        name="minEBVZhirKg"
                                        placeholder="Min"
                                        value={filterValues.minEBVZhirKg}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxEBVZhirKg"
                                        placeholder="Max"
                                        value={filterValues.maxEBVZhirKg}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-between"></div>
                                <div className="form-group">
                                    <label>RBVF:</label>
                                    <input
                                        type="number"
                                        name="minRBVF"
                                        placeholder="Min"
                                        value={filterValues.minRBVF}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxRBVF"
                                        placeholder="Max"
                                        value={filterValues.maxRBVF}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>EBV жир %:</label>
                                    <input
                                        type="number"
                                        name="minEBVZhirPprc"
                                        placeholder="Min"
                                        value={filterValues.minEBVZhirPprc}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxEBVZhirPprc"
                                        placeholder="Max"
                                        value={filterValues.maxEBVZhirPprc}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-between"></div>
                                <div className="form-group">
                                    <label>RBVU:</label>
                                    <input
                                        type="number"
                                        name="minRBVU"
                                        placeholder="Min"
                                        value={filterValues.minRBVU}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxRBVU"
                                        placeholder="Max"
                                        value={filterValues.maxRBVU}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>EBV белок кг:</label>
                                    <input
                                        type="number"
                                        name="minEBVBelokKg"
                                        placeholder="Min"
                                        value={filterValues.minEBVBelokKg}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxEBVBelokKg"
                                        placeholder="Max"
                                        value={filterValues.maxEBVBelokKg}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-between"></div>
                                <div className="form-group">
                                    <label>RC:</label>
                                    <input
                                        type="number"
                                        name="minRC"
                                        placeholder="Min"
                                        value={filterValues.minRC}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxRC"
                                        placeholder="Max"
                                        value={filterValues.maxRC}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>EBV белок %:</label>
                                    <input
                                        type="number"
                                        name="minEBVBelokPprc"
                                        placeholder="Min"
                                        value={filterValues.minEBVBelokPprc}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxEBVBelokPprc"
                                        placeholder="Max"
                                        value={filterValues.maxEBVBelokPprc}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-between"></div>
                                <div className="form-group">
                                    <label>RF:</label>
                                    <input
                                        type="number"
                                        name="minRF"
                                        placeholder="Min"
                                        value={filterValues.minRF}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxRF"
                                        placeholder="Max"
                                        value={filterValues.maxRF}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>RBV жир кг:</label>
                                    <input
                                        type="number"
                                        name="minRBVZhirKg"
                                        placeholder="Min"
                                        value={filterValues.minRBVZhirKg}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxRBVZhirKg"
                                        placeholder="Max"
                                        value={filterValues.maxRBVZhirKg}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-between"></div>
                                <div className="form-group">
                                    <label>Rscs:</label>
                                    <input
                                        type="number"
                                        name="minRscs"
                                        placeholder="Min"
                                        value={filterValues.minRscs}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxRscs"
                                        placeholder="Max"
                                        value={filterValues.maxRscs}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>RBV белок кг:</label>
                                    <input
                                        type="number"
                                        name="minRBVBelokKg"
                                        placeholder="Min"
                                        value={filterValues.minRBVBelokKg}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxRBVBelokKg"
                                        placeholder="Max"
                                        value={filterValues.maxRBVBelokKg}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-between"></div>
                                <div className="form-group">
                                    <label>PI:</label>
                                    <input
                                        type="number"
                                        name="minPI"
                                        placeholder="Min"
                                        value={filterValues.minPI}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxPI"
                                        placeholder="Max"
                                        value={filterValues.maxPI}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>RM:</label>
                                    <input
                                        type="number"
                                        name="minRM"
                                        placeholder="Min"
                                        value={filterValues.minRM}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="maxRM"
                                        placeholder="Max"
                                        value={filterValues.maxRM}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-between"></div>
                            </div>

                            <div className="space"></div>
                            <div className="form-button">
                                <button type="submit" className="submit-button">Подобрать</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="tables-container">
                {isCow ?
                    (
                        <div className="farm-tables">
                            <MilkTable data={aggregatedData.milk} data_second={aggregatedData.median_milk} />
                            <RelativeBreedingValueTable data={aggregatedData} />
                            <div style={{
                                width: '100%',
                                margin: '0 auto',
                                backgroundColor: '#fff',  // Белый фон
                                padding: '20px',          // Добавляем отступы внутри контейнера
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Добавляем небольшую тень для красоты
                                borderRadius: '8px'       // Скругляем углы для улучшения стиля
                            }}>
                                <h2>График плотности распределения</h2>
                                <DensityChart datasets={density_data} />
                                {/* <DensityChart data={data} labels={labels} /> */}
                            </div>
                           <br></br>
                            <form onSubmit={handleSubmitFilter} className="complex-filter-form">
                                <input
                                    type="text"
                                    value={complexInput}
                                    onChange={handleInputChangeFilter}
                                    placeholder="Введите номер комплекса"
                                />
                            </form>
                            <ResizableCowTable kodrn={farmCode} selectedComplex={complexInput} />
                        </div>
                    ) :
                    (
                        <div className="farm-tables">
                            <form onSubmit={handleSubmitFilter} className="complex-filter-form">
                                <input
                                    type="text"
                                    value={complexInputYoung}
                                    onChange={handleInputChangeFilterYoung}
                                    placeholder="Введите номер комплекса"
                                />
                            </form>
                            <ResizableYoungAnimalTable kodrn={farmCode} selectedComplex={complexInputYoung} />
                        </div>
                    )
                }

                <div className="gpp-tables">
                    {data ?
                        (
                            <div>
                                <button onClick={handleReset} className="reset-button">Сбросить</button>
                                <FilterBullTable datas={data} selectedComplexYoung={complexInputYoung} selectedComplex={complexInput} kodrn={farmCode} isCow={isCow} />
                            </div>
                        )
                        :
                        (
                            <ResizableBullTable kodrn={gppCode} />
                        )}
                </div>
            </div>
        </div>
    );
};

export default DataDisplay;
