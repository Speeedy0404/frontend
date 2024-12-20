import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CowTable from './Tables/animal/CowTable';
import YoungTable from './Tables/animal/YoungTable';
import BullTable from './Tables/animal/BullTable';

import LakTable from './Tables/LakTable';
import MilkTable from './Tables/MilkTable';
import RelativeBreedingValueTable from './Tables/RelativeBreedingValueTable';
import DensityChart from './DensityChart/DensityChart';

import {
    Box,
    Grid,
    Autocomplete,
    Button,
    TextField,
    Typography,
    Stack,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close'; // Импортируем иконку закрытия
const apiUrl = process.env.REACT_APP_API_URL
const options = [
    'АННАС АДЕМА 30587', 'ФРИЗО ВОУТЕРА 44116', 'ВИС АЙДИАЛА 933122', 'РЕФЛЕКШН СОВЕРИНГА 198998',
    'ПОНИ ФАРМ АРЛИНДА ЧИФА 1427381', 'МОНТВИК ЧИФТЕЙНА 95679', 'ЛИНИИ ДАТСКОЙ ПОРОДЫ', 'ЛИНИИ БРИТАНОФРИЗСКОЙ ПОРОДЫ',
    'ЛИНИИ ШВЕДСКОЙ ПОРОДЫ', 'ЛИНИИ СИММЕНТАЛЬСКОЙ ПОРОДЫ', 'ЛИНИИ ДЖЕРСЕЙСКОЙ ПОРОДЫ', 'ЛИНИИ ЛИМУЗИНСКОЙ ПОРОДЫ', 'ЛИНИИ ПОРОДЫ ШАРОЛЕ',
    'ЛИНИИ ГЕРЕФОРДСКОЙ ПОРОДЫ', 'ЛИНИИ АБЕРДИН-АНГУССКОЙ ПОРОДЫ', 'ЛИНИИ СВЕТЛО-АКВИТАНСКОЙ', 'ЛИНИИ ПОРОДЫ МЕН-АНЖУ', 'ЛИНИИ ПОРОДЫ БЕЛЬГИЙСКАЯ ГОЛУБАЯ',
    'ЛИНИИ ПОРОДЫ ВАГЮ', 'БЕЗ ЛИНИИ', 'ВИСТУРТА АННАС АДЕМА 36079', 'БЛИТСАЕРД ЕТ АДЕМА 44850,63349', 'ХАУБОЙС АННАС АДЕМА 44162', 'АННАС АДЕМА 2,33209', 'ВИСТОРЕЛА 35949',
    'ХАУБОЙС АДЕМА 40849', 'ФРИЗО ГРЕГОРА 43215', 'ДИАМАНТА 33251', 'БЕРНАРДА 29100', 'ХИЛЬТЬЕС АДЕМА 37910', 'АДЕМА 441', 'АДЕМА 443', 'РЕЙНТЬЕС ХИЛЬТЬЕС АДЕМА 45379', 'НЕТТЕ 82',
    'РУТЬЕС ЭДУАРДА 31646', 'БАНГА РЕЙНДЕРА 47221', 'АЛЕКСА 66644', 'НИКО 31652,31831', 'СТЕФФЕНА 40126', 'АДЕМА 25437', 'БЕРТУСА 77804', 'КОЛДХОСТЕР ЯНКЕ КАТС 2233/137,90936', 'РОТЕРДА ПАУЛЯ 36498',
    'ЛИНДБЕРГА 2363', 'КЛЯЙНЕ АДЕМА 21047', 'РИКУСА 25415', 'ТАЙДИ БЕК ЭЛЕВЕЙШН 1271810,50218', 'ПАКЛАМАР АСТРОНАВТ 1258744,50202', 'ПАКЛАМАР БООТМАРКЕРА 1450228,502', 'РОЗЕЙФ СИТЕЙШН 267150,1492073,50',
    'РОМАНДЕЙЛ РЕФЛЕКШН МАРКИЗ 260008', 'ОСБОРНДЭЙЛ ИВАНХОЕ 1189870', 'ЛИНМАК 303731', 'РОЙБРУК ТЕЛСТЕР 1626041,288790', 'ФОНД МЭТТ 1392858,502096', 'СИЛИНГ ТРАЙДЖУН РОКИТ 252803', 'ГОВЕРНОР КОРНЕЙШН 629472',
    'ПАБСТ ГОВЕРНЕРА 882933', 'ИНКА СУПРИМ РЕФЛЕКШН 121004', 'ИРВИНГТОН ПРАЙТ АДМИРАЛ', 'ФРАНСА ГРОЕНХОВЕНА 247,18553', 'ОЛЬДАМСТЕР АДЕМА 19056', 'Р.ГР.СКОКИЕ.ДИЗАЙН 1298378', 'БОНТЬЕС АДЕМА 24674', 'Р.РГ.Ф.ГРЕЙЛИТ 205943/203949',
    'Р.РГ.ЛАВЕНХАМ ГАНДОЛЕ 179,387022', 'Р.РГ.ТЕРЛИНГ МАРТЬЕС 21533', 'Р.РГ.ЛАВЕНХАМ ГРЕНАДЕРА 58373', 'Р.РГ.ЛАВЕНХАМ ГАЛОРЕ 178795', 'Р.РГ.ЛАВЕНХАМ ТАРГЕ 145643', 'ЦИРРУС 16497', 'РУДОЛЬФА ЯНА 34558', 'СКОКИ СЕНСЕЙШЕН 1267271'
]


const IndividualDataDisplay = () => {
    const location = useLocation();
    const { farmName, farmCode, aggregatedData, density_data } = location.state || {};
    const [selectedTab, setSelectedTab] = useState('filter'); // Стейт для хранения выбранной вкладки


    const [filterValues, setFilterValues] = useState({
        selectedGpp: [],
    });

    const [paramBull, setParamBull] = useState({
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
        selectedLine: '',
        selectedComplex: [],
    });
    const [paramCow, setParamCow] = useState({
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
        selectedLine: '',
        selectedComplex: [],
    });
    const [paramYoung, setParamYoung] = useState({
        selectedLine: '',
        selectedComplex: [],
    });

    const [selectedLineCow, setSelectedLineCow] = useState(null);
    const [selectedLineYoung, setSelectedLineYoung] = useState(null);
    const [selectedLineBull, setSelectedLineBull] = useState(null);

    const [dataBull, setdataBull] = useState(paramBull);
    const [additionalParam, setAdditionalParam] = useState(null);
    const [dataCow, setdataCow] = useState(paramCow);
    const [dataYoung, setdataYoung] = useState(paramYoung);

    const [reloadTables, setReloadTables] = useState(false);
    const [selectedCows, setSelectedCows] = useState([]);
    const [selectedYoung, setSelectedYoung] = useState([]);
    const [selectedBulls, setSelectedBulls] = useState([]);
    const [pdfname, setPdfName] = useState('')

    const [inbreedingStatus, setInbreedingStatus] = useState(null);
    const [inbredAnimals, setInbredAnimals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pdfLink, setPdfLink] = useState(null);
    const [nameDock, setNameDock] = useState('');

    const [modalOpen, setModalOpen] = useState(false);

    const handleTabChange = (tab) => setSelectedTab(tab);

    const handleInputChangeBull = (event) => {
        const { name, value } = event.target;
        setParamBull({
            ...paramBull,
            [name]: value,
        });
    };

    const handleInputChangeCow = (event) => {
        const { name, value } = event.target;
        setParamCow({
            ...paramCow,
            [name]: value,
        });
    };

    const handleInputChangeYoung = (event) => {
        const { name, value } = event.target;
        setParamYoung({
            ...paramYoung,
            [name]: value,
        });
    };

    const handleCheckboxChangeBull = (event) => {
        const { value, checked } = event.target;

        setParamBull((prevValues) => {
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

    const handleCheckboxChangeCow = (event) => {
        const { value, checked } = event.target;

        setParamCow((prevValues) => {
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

    const handleCheckboxChangeYoung = (event) => {
        const { value, checked } = event.target;

        setParamYoung((prevValues) => {
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

    const handleAutocompleteChangeCow = (event, newValue) => {
        setSelectedLineCow(newValue);
        // Обновление состояния paramCow с выбранным значением
        handleInputChangeCow({ target: { name: 'selectedLine', value: newValue } });
    };

    const handleAutocompleteChangeYoung = (event, newValue) => {
        setSelectedLineYoung(newValue);
        // Обновление состояния paramCow с выбранным значением
        handleInputChangeYoung({ target: { name: 'selectedLine', value: newValue } });
    };

    const handleAutocompleteChangeBull = (event, newValue) => {
        setSelectedLineBull(newValue);
        // Обновление состояния paramCow с выбранным значением
        handleInputChangeBull({ target: { name: 'selectedLine', value: newValue } });
    };

    const handleCheckboxChange = (event) => {
        event.preventDefault();
        const { value, checked } = event.target;

        setFilterValues((prevValues) => {
            const selectedGpp = prevValues.selectedGpp;

            if (checked) {
                // Если чекбокс отмечен, добавляем значение в массив
                return {
                    ...prevValues,
                    selectedGpp: [...selectedGpp, value],
                };
            } else {
                return {
                    ...prevValues,
                    selectedGpp: selectedGpp.filter((item) => item !== value),
                };
            }
        });
    };

    const handleSubmitFilterAll = (event) => {
        event.preventDefault();
        setdataBull(paramBull);
    };

    const handleSubmitCow = (event) => {
        event.preventDefault();
        setdataCow(paramCow);
    };

    const handleSubmitYoung = (event) => {
        event.preventDefault();
        console.log(paramYoung)
        setdataYoung(paramYoung);
    }

    const handleSelectedCowsChange = (selected) => {
        setSelectedCows(selected);
    };

    const handleAdditionalParamChange = (additionalParam) => {
        setAdditionalParam(additionalParam);
    };

    const handleSelectedYoungChange = (selected) => {
        setSelectedYoung(selected);
    };

    const handleSelectedBullsChange = (selected) => {
        setSelectedBulls(selected);
    };

    const handleSubmitconsolidation = async (event) => {
        event.preventDefault();

        let payload; // Объявляем payload здесь

        if (selectedTab === 'young') {
            if (selectedYoung.length === 0) {
                alert('Вы должны выбрать хотя бы одно животное.');
                return;
            }

            if (selectedBulls.length === 0) {
                alert('Вы должны выбрать хотя бы одного быка.');
                return;
            }

            if (selectedBulls.length > 5) {
                alert('Вы не можете выбрать больше 5 быков.');
                return;
            }

            payload = { // Присваиваем значение payload
                cows: selectedYoung,
                bulls: selectedBulls,
                inbred: inbredAnimals,
                mode: 'young',
                name: nameDock,
            };
        } else {
            if (selectedCows.length === 0) {
                alert('Вы должны выбрать хотя бы одну корову.');
                return;
            }

            if (selectedBulls.length === 0) {
                alert('Вы должны выбрать хотя бы одного быка.');
                return;
            }

            if (selectedBulls.length > 5) {
                alert('Вы не можете выбрать больше 5 быков.');
                return;
            }

            payload = { // Присваиваем значение payload
                cows: selectedCows,
                bulls: selectedBulls,
                inbred: inbredAnimals,
                mode: 'cow',
                name: nameDock,
            };
        }

        try {
            setLoading(true);
            setModalOpen(true); // Открываем модальное окно при начале проверки

            const response = await fetch(`${apiUrl}/api/v1/submit-consolidation/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                    'Kodrn': farmCode,
                    'Mode': 'standard',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error('Ошибка при проверке инбридинга');
            }

            if (result.inbreeding_check) {
                setInbreedingStatus('success');
            } else {
                setInbreedingStatus('error');
                setInbredAnimals(result.inbred_animals);
                setLoading(false);
                return;
            }

            setPdfName(result.pdf_filename)

            const pdfResponse = await fetch(`${apiUrl}/api/v1/get-report/${result.pdf_filename}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            });

            if (!pdfResponse.ok) {
                throw new Error('Ошибка при загрузке PDF файла');
            }

            const blob = await pdfResponse.blob();
            const pdfURL = window.URL.createObjectURL(blob);
            setPdfLink(pdfURL);  // Устанавливаем ссылку для скачивания PDF

            setLoading(false);

        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Произошла ошибка при отправке данных');
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);  // Закрываем модальное окно
        if (pdfLink !== null) {
            setPdfLink(null);
            setSelectedCows([])
            setSelectedBulls([])
            setReloadTables(!reloadTables);  // Меняем состояние, чтобы вызвать ререндеринг таблиц
        }
    };

    const handleFixWithoutInbreeding = async (event) => {
        event.preventDefault();
        
        let payload; // Объявляем payload здесь

        if (selectedTab === 'young') {
            if (selectedYoung.length === 0) {
                alert('Вы должны выбрать хотя бы одно животное.');
                return;
            }

            if (selectedBulls.length === 0) {
                alert('Вы должны выбрать хотя бы одного быка.');
                return;
            }

            if (selectedBulls.length > 5) {
                alert('Вы не можете выбрать больше 5 быков.');
                return;
            }

            payload = { // Присваиваем значение payload
                cows: selectedYoung,
                bulls: selectedBulls,
                inbred: inbredAnimals,
                mode: 'young',
                name: nameDock,
            };
        } else {
            if (selectedCows.length === 0) {
                alert('Вы должны выбрать хотя бы одну корову.');
                return;
            }

            if (selectedBulls.length === 0) {
                alert('Вы должны выбрать хотя бы одного быка.');
                return;
            }

            if (selectedBulls.length > 5) {
                alert('Вы не можете выбрать больше 5 быков.');
                return;
            }

            payload = { // Присваиваем значение payload
                cows: selectedCows,
                bulls: selectedBulls,
                inbred: inbredAnimals,
                mode: 'cow',
                name: nameDock,
            };
        }

        try {
            setLoading(true);
            setModalOpen(true); // Открываем модальное окно при начале проверки

            const response = await fetch(`${apiUrl}/api/v1/submit-consolidation/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                    'Kodrn': farmCode,
                    'Mode': 'Without',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error('Ошибка при проверке инбридинга');
            }

            if (result.inbreeding_check) {
                setInbreedingStatus('success');
            } else {
                setInbreedingStatus('error');
                setInbredAnimals(result.inbred_animals);
                setLoading(false);
                return;
            }

            setPdfName(result.pdf_filename)

            const pdfResponse = await fetch(`${apiUrl}/api/v1/get-report/${result.pdf_filename}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            });

            if (!pdfResponse.ok) {
                throw new Error('Ошибка при загрузке PDF файла');
            }

            const blob = await pdfResponse.blob();
            const pdfURL = window.URL.createObjectURL(blob);
            setPdfLink(pdfURL);  // Устанавливаем ссылку для скачивания PDF

            setLoading(false);

        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Произошла ошибка при отправке данных');
            setLoading(false);
        }
    }

    const handleFixWithInbreeding = async (event) => {
        event.preventDefault();
        
        let payload; // Объявляем payload здесь

        if (selectedTab === 'young') {
            if (selectedYoung.length === 0) {
                alert('Вы должны выбрать хотя бы одно животное.');
                return;
            }

            if (selectedBulls.length === 0) {
                alert('Вы должны выбрать хотя бы одного быка.');
                return;
            }

            if (selectedBulls.length > 5) {
                alert('Вы не можете выбрать больше 5 быков.');
                return;
            }

            payload = { // Присваиваем значение payload
                cows: selectedYoung,
                bulls: selectedBulls,
                inbred: inbredAnimals,
                mode: 'young',
                name: nameDock,
            };
        } else {
            if (selectedCows.length === 0) {
                alert('Вы должны выбрать хотя бы одну корову.');
                return;
            }

            if (selectedBulls.length === 0) {
                alert('Вы должны выбрать хотя бы одного быка.');
                return;
            }

            if (selectedBulls.length > 5) {
                alert('Вы не можете выбрать больше 5 быков.');
                return;
            }

            payload = { // Присваиваем значение payload
                cows: selectedCows,
                bulls: selectedBulls,
                inbred: inbredAnimals,
                mode: 'cow',
                name: nameDock,
            };
        }

        try {
            setLoading(true);
            setModalOpen(true); // Открываем модальное окно при начале проверки

            const response = await fetch(`${apiUrl}/api/v1/submit-consolidation/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                    'Kodrn': farmCode,
                    'Mode': 'With',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error('Ошибка при проверке инбридинга');
            }

            if (result.inbreeding_check) {
                setInbreedingStatus('success');
            } else {
                setInbreedingStatus('error');
                setInbredAnimals(result.inbred_animals);
                setLoading(false);
                return;
            }

            setPdfName(result.pdf_filename)

            const pdfResponse = await fetch(`${apiUrl}/api/v1/get-report/${result.pdf_filename}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            });

            if (!pdfResponse.ok) {
                throw new Error('Ошибка при загрузке PDF файла');
            }

            const blob = await pdfResponse.blob();
            const pdfURL = window.URL.createObjectURL(blob);
            setPdfLink(pdfURL);  // Устанавливаем ссылку для скачивания PDF

            setLoading(false);

        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Произошла ошибка при отправке данных');
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="data-display-container">

                <div className="info-container">

                    <div className="info-item farm-info">
                        <h3>{farmName}</h3>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <Button variant={selectedTab === 'filter' ? 'contained' : 'outlined'} onClick={() => handleTabChange('filter')}>
                                Фильтр
                            </Button>
                            <Button variant={selectedTab === 'info' ? 'contained' : 'outlined'} onClick={() => handleTabChange('info')}>
                                Информация о хозяйстве
                            </Button>
                            <Button variant={selectedTab === 'young' ? 'contained' : 'outlined'} onClick={() => handleTabChange('young')}>
                                Молодняк
                            </Button>
                        </div>
                        {selectedTab === 'filter' && (
                            <Box
                                component="form"
                                onSubmit={handleSubmitCow}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: 2,
                                    p: 2,
                                    boxShadow: 1,
                                    mb: 2
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 1 }}>Фильтр</Typography>


                                <Grid container spacing={2}>
                                    {[
                                        [
                                            { label: 'EBVUdoi', min: paramCow.minEBVUdoi, onChangeMin: handleInputChangeCow, max: paramCow.maxEBVUdoi, onChangeMax: handleInputChangeCow },
                                            { label: 'RBVT', min: paramCow.minRBVT, onChangeMin: handleInputChangeCow, max: paramCow.maxRBVT, onChangeMax: handleInputChangeCow }
                                        ],
                                        [
                                            { label: 'EBVZhirKg', min: paramCow.minEBVZhirKg, onChangeMin: handleInputChangeCow, max: paramCow.maxEBVZhirKg, onChangeMax: handleInputChangeCow },
                                            { label: 'RBVF', min: paramCow.minRBVF, onChangeMin: handleInputChangeCow, max: paramCow.maxRBVF, onChangeMax: handleInputChangeCow }
                                        ],
                                        [
                                            { label: 'EBVZhirPprc', min: paramCow.minEBVZhirPprc, onChangeMin: handleInputChangeCow, max: paramCow.maxEBVZhirPprc, onChangeMax: handleInputChangeCow },
                                            { label: 'RBVU', min: paramCow.minRBVU, onChangeMin: handleInputChangeCow, max: paramCow.maxRBVU, onChangeMax: handleInputChangeCow }
                                        ],
                                        [
                                            { label: 'EBVBelokKg', min: paramCow.minEBVBelokKg, onChangeMin: handleInputChangeCow, max: paramCow.maxEBVBelokKg, onChangeMax: handleInputChangeCow },
                                            { label: 'RC', min: paramCow.minRC, onChangeMin: handleInputChangeCow, max: paramCow.maxRC, onChangeMax: handleInputChangeCow }
                                        ],
                                        [
                                            { label: 'EBVBelokPprc', min: paramCow.minEBVBelokPprc, onChangeMin: handleInputChangeCow, max: paramCow.maxEBVBelokPprc, onChangeMax: handleInputChangeCow },
                                            { label: 'RF', min: paramCow.minRF, onChangeMin: handleInputChangeCow, max: paramCow.maxRF, onChangeMax: handleInputChangeCow }
                                        ],
                                        [
                                            { label: 'RBVZhirKg', min: paramCow.minRBVZhirKg, onChangeMin: handleInputChangeCow, max: paramCow.maxRBVZhirKg, onChangeMax: handleInputChangeCow },
                                            { label: 'Rscs', min: paramCow.minRscs, onChangeMin: handleInputChangeCow, max: paramCow.maxRscs, onChangeMax: handleInputChangeCow }
                                        ],
                                        [
                                            { label: 'RBVBelokKg', min: paramCow.minRBVBelokKg, onChangeMin: handleInputChangeCow, max: paramCow.maxRBVBelokKg, onChangeMax: handleInputChangeCow },
                                            { label: 'PI', min: paramCow.minPI, onChangeMin: handleInputChangeCow, max: paramCow.maxPI, onChangeMax: handleInputChangeCow }
                                        ]
                                    ].map((row, rowIndex) => (
                                        <Grid container item spacing={2} key={rowIndex} xs={12}>
                                            {row.map(({ label, min, onChangeMin, max, onChangeMax }) => (
                                                <Grid item xs={6} key={label}>
                                                    <Stack direction="row" spacing={1}>
                                                        <TextField
                                                            label={`Мин ${label}`}
                                                            name={`min${label}`}
                                                            variant="outlined"
                                                            type="number"
                                                            value={min}
                                                            onChange={onChangeMin}
                                                            size="small"
                                                            sx={{ flex: 1 }}
                                                        />
                                                        <TextField
                                                            label={`Макс ${label}`}
                                                            name={`max${label}`}
                                                            variant="outlined"
                                                            type="number"
                                                            value={max}
                                                            onChange={onChangeMax}
                                                            size="small"
                                                            sx={{ flex: 1 }}
                                                        />
                                                    </Stack>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ))}
                                </Grid>

                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        label="Мин RM"
                                        name="minRM"
                                        variant="outlined"
                                        type="number"
                                        value={paramCow.minRM}
                                        onChange={handleInputChangeCow}
                                        size="small"
                                        sx={{ flex: 1 }}
                                    />
                                    <TextField
                                        label="Макс RM"
                                        name="maxRM"
                                        variant="outlined"
                                        type="number"
                                        value={paramCow.maxRM}
                                        onChange={handleInputChangeCow}
                                        size="small"
                                        sx={{ flex: 1 }}
                                    />
                                </Stack>

                                <Stack direction="column" sx={{ mt: 2 }}>
                                    <Typography variant="body1">Комплекс:</Typography>
                                    <Stack direction="row" spacing={2} className="checkbox-group">
                                        {['1', '2', '3', '4', '5', '6', '0'].map((complex) => (
                                            <div key={complex} style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    name="selectedComplex"
                                                    value={complex}
                                                    checked={paramCow.selectedComplex.includes(complex)}
                                                    onChange={handleCheckboxChangeCow}
                                                />
                                                <label style={{ marginLeft: '5px' }}>{complex}</label>
                                            </div>
                                        ))}
                                    </Stack>
                                </Stack>

                                <Autocomplete
                                    options={options}
                                    value={selectedLineCow}
                                    onChange={handleAutocompleteChangeCow}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Выберите линию"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                    sx={{ mt: 2 }}
                                />

                                {/* Кнопка отправки */}
                                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                    Применить
                                </Button>
                            </Box>
                        )}

                        {selectedTab === 'young' && (
                            <Box
                                component="form"
                                onSubmit={handleSubmitYoung}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: 2,
                                    p: 2,
                                    boxShadow: 1,
                                    mb: 2
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 1 }}>Фильтр</Typography>

                                <Stack direction="column" sx={{ mt: 2 }}>
                                    <Typography variant="body1">Комплекс:</Typography>
                                    <Stack direction="row" spacing={2} className="checkbox-group">
                                        {['1', '2', '3', '4', '5', '6'].map((complex) => (
                                            <div key={complex} style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    name="selectedComplex"
                                                    value={complex}
                                                    checked={paramYoung.selectedComplex.includes(complex)}
                                                    onChange={handleCheckboxChangeYoung}
                                                />
                                                <label style={{ marginLeft: '5px' }}>{complex}</label>
                                            </div>
                                        ))}
                                    </Stack>
                                </Stack>

                                <Autocomplete
                                    options={options}
                                    value={selectedLineYoung}
                                    onChange={handleAutocompleteChangeYoung}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Выберите линию"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                    sx={{ mt: 2 }}
                                />

                                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                    Применить
                                </Button>
                            </Box>
                        )}
                    </div>

                    <div className="info-item gpp-info">
                        <h3 style={{ marginBottom: '55px' }}>Все ГПП</h3>
                        {(selectedTab === 'filter' || selectedTab === 'young') && (
                            <>
                                <Box
                                    component="form"
                                    onSubmit={handleSubmitFilterAll}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: 2,
                                        p: 2,
                                        boxShadow: 1,
                                        mb: 2
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 1 }}>Фильтр</Typography>

                                    {/* Группы полей ввода */}
                                    <Grid container spacing={2}>
                                        {[
                                            // Первая строка полей
                                            [
                                                { label: 'EBVUdoi', min: paramBull.minEBVUdoi, onChangeMin: handleInputChangeBull, max: paramBull.maxEBVUdoi, onChangeMax: handleInputChangeBull },
                                                { label: 'RBVT', min: paramBull.minRBVT, onChangeMin: handleInputChangeBull, max: paramBull.maxRBVT, onChangeMax: handleInputChangeBull }
                                            ],
                                            // Вторая строка полей
                                            [
                                                { label: 'EBVZhirKg', min: paramBull.minEBVZhirKg, onChangeMin: handleInputChangeBull, max: paramBull.maxEBVZhirKg, onChangeMax: handleInputChangeBull },
                                                { label: 'RBVF', min: paramBull.minRBVF, onChangeMin: handleInputChangeBull, max: paramBull.maxRBVF, onChangeMax: handleInputChangeBull }
                                            ],
                                            // Дополнительные строки, если нужно
                                            [
                                                { label: 'EBVZhirPprc', min: paramBull.minEBVZhirPprc, onChangeMin: handleInputChangeBull, max: paramBull.maxEBVZhirPprc, onChangeMax: handleInputChangeBull },
                                                { label: 'RBVU', min: paramBull.minRBVU, onChangeMin: handleInputChangeBull, max: paramBull.maxRBVU, onChangeMax: handleInputChangeBull }
                                            ],
                                            [
                                                { label: 'EBVBelokKg', min: paramBull.minEBVBelokKg, onChangeMin: handleInputChangeBull, max: paramBull.maxEBVBelokKg, onChangeMax: handleInputChangeBull },
                                                { label: 'RC', min: paramBull.minRC, onChangeMin: handleInputChangeBull, max: paramBull.maxRC, onChangeMax: handleInputChangeBull },

                                            ],
                                            [
                                                { label: 'EBVBelokPprc', min: paramBull.minEBVBelokPprc, onChangeMin: handleInputChangeBull, max: paramBull.maxEBVBelokPprc, onChangeMax: handleInputChangeBull },
                                                { label: 'RF', min: paramBull.minRF, onChangeMin: handleInputChangeBull, max: paramBull.maxRF, onChangeMax: handleInputChangeBull },

                                            ],
                                            [
                                                { label: 'RBVZhirKg', min: paramBull.minRBVZhirKg, onChangeMin: handleInputChangeBull, max: paramBull.maxRBVZhirKg, onChangeMax: handleInputChangeBull },
                                                { label: 'Rscs', min: paramBull.minRscs, onChangeMin: handleInputChangeBull, max: paramBull.maxRscs, onChangeMax: handleInputChangeBull },

                                            ],
                                            [
                                                { label: 'RBVBelokKg', min: paramBull.minRBVBelokKg, onChangeMin: handleInputChangeBull, max: paramBull.maxRBVBelokKg, onChangeMax: handleInputChangeBull },
                                                { label: 'PI', min: paramBull.minPI, onChangeMin: handleInputChangeBull, max: paramBull.maxPI, onChangeMax: handleInputChangeBull },

                                            ]
                                            // [
                                            //     { label: 'RM', min: paramBull.minRM, onChangeMin: handleInputChangeBull, max: paramBull.maxRM, onChangeMax: handleInputChangeBull }
                                            // ],
                                        ].map((row, rowIndex) => (
                                            <Grid container item spacing={2} key={rowIndex} xs={12}>
                                                {row.map(({ label, min, onChangeMin, max, onChangeMax }) => (
                                                    <Grid item xs={6} key={label}>
                                                        <Stack direction="row" spacing={1}>
                                                            <TextField
                                                                label={`Мин ${label}`}
                                                                name={`min${label}`}
                                                                variant="outlined"
                                                                type="number"
                                                                value={min}
                                                                onChange={onChangeMin}
                                                                size="small"
                                                                sx={{ flex: 1 }}
                                                            />
                                                            <TextField
                                                                label={`Макс ${label}`}
                                                                name={`max${label}`}
                                                                variant="outlined"
                                                                type="number"
                                                                value={max}
                                                                onChange={onChangeMax}
                                                                size="small"
                                                                sx={{ flex: 1 }}
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                ))}
                                            </Grid>

                                        ))}
                                    </Grid>

                                    {[
                                        { label: 'RM', min: paramBull.minRM, onChangeMin: handleInputChangeBull, max: paramBull.maxRM, onChangeMax: handleInputChangeBull },
                                    ].map(({ label, min, onChangeMin, max, onChangeMax }) => (
                                        <Stack key={label} direction="row" spacing={1}>
                                            <TextField
                                                label={`Мин ${label}`}
                                                name={`min${label}`}
                                                variant="outlined"
                                                type="number"
                                                value={min}
                                                onChange={onChangeMin}
                                                size="small"  // Более компактный размер
                                                sx={{ flex: 1 }} // Поля будут занимать одинаковую ширину
                                            />
                                            <TextField
                                                label={`Макс ${label}`}
                                                name={`max${label}`}
                                                variant="outlined"
                                                type="number"
                                                value={max}
                                                onChange={onChangeMax}
                                                size="small"  // Более компактный размер
                                                sx={{ flex: 1 }} // Поля будут занимать одинаковую ширину
                                            />
                                        </Stack>
                                    ))}

                                    {/* Комплексный выбор */}
                                    <Stack direction="column" sx={{ mt: 2 }}>
                                        <Typography variant="body1">Комплекс:</Typography>
                                        <Stack direction="row" spacing={2} className="checkbox-group">
                                            {['1', '2', '3', '4', '5', '6', '0'].map((complex) => (
                                                <div key={complex} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <input
                                                        type="checkbox"
                                                        name="selectedComplex"
                                                        value={complex}
                                                        checked={paramBull.selectedComplex.includes(complex)}
                                                        onChange={handleCheckboxChangeBull}
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>{complex}</label>
                                                </div>
                                            ))}
                                        </Stack>
                                    </Stack>

                                    <Autocomplete
                                        options={options}
                                        value={selectedLineBull}
                                        onChange={handleAutocompleteChangeBull}
                                        filterSelectedOptions
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Выберите линию"
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                        sx={{ mt: 2 }}
                                    />

                                    {/* Кнопка отправки */}
                                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                        Применить
                                    </Button>
                                </Box>

                                <Box
                                    component="form"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: 2,
                                        p: 3,
                                        boxShadow: 1,
                                        mb: 3
                                    }}
                                >
                                    <Typography variant="h6">ГПП</Typography>
                                    <FormGroup>
                                        <Stack direction="row" spacing={2}>
                                            {['РСУП БРЕСТСКОЕ ПП', 'РУП ВИТЕБСКОЕ ПП', 'РСУП ГОМЕЛЬСКОЕ ГПП', 'РУСП ГРОДНЕНСКОЕ ПП', 'РУСП МИНСКОЕ ПП', 'РУСПП МОГИЛЕВСКОЕ ПП', 'ПОКУПНЫЕ'].map((gpp) => (
                                                <FormControlLabel
                                                    key={gpp}
                                                    control={
                                                        <Checkbox
                                                            name="selectedComplex"
                                                            value={gpp}
                                                            checked={filterValues.selectedGpp.includes(gpp)}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                    }
                                                    label={<Typography sx={{ fontSize: '0.75rem' }}>{gpp}</Typography>} // Указываем размер шрифта
                                                />
                                            ))}
                                        </Stack>
                                    </FormGroup>
                                </Box>
                            </>
                        )}
                    </div>

                </div>
            </div>

            {selectedTab === 'info' && aggregatedData && (
                <div className="farm-tables">
                    <LakTable data={aggregatedData} />
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
                    </div>
                    <br></br>
                </div>
            )}

            <div className="data-display-container">
                <div className="tables-container">
                    <div className="farm-tables">
                        {selectedTab !== 'young' && (
                            <CowTable
                                key={`cow-table-${reloadTables}`} // Уникальный ключ для перерисовки
                                kodrn={farmCode}
                                dataCow={dataCow}
                                onSelectedChange={handleSelectedCowsChange}
                                onParamChange={handleAdditionalParamChange}
                            />
                        )}
                        {selectedTab === 'young' && (
                            <YoungTable
                                key={`young-table-${reloadTables}`} // Уникальный ключ для перерисовки
                                kodrn={farmCode}
                                dataYoung={dataYoung}
                                onSelectedChange={handleSelectedYoungChange}
                            />
                        )}
                    </div>
                    <div className="gpp-tables">
                        <BullTable
                            key={`bull-table-${reloadTables}`} // Уникальный ключ для перерисовки
                            gpp={filterValues.selectedGpp}
                            dataBull={dataBull}
                            additionalParam={additionalParam}
                            onSelectedChange={handleSelectedBullsChange}
                        />
                    </div>
                </div>
            </div>

            <Box
                component="form"
                onSubmit={handleSubmitconsolidation}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '520px',
                    margin: '0 auto',
                    mt: 2,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 1
                }}
            >

                <TextField
                    label="Название документа"
                    name="minRM"
                    variant="outlined"
                    type="text"
                    placeholder="Введите преписку к названию"
                    value={nameDock}
                    onChange={(e) => setNameDock(e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                />

                <Button type="submit" variant="contained" color="primary">
                    Закрепить
                </Button>
            </Box>

            <Dialog
                open={modalOpen}  // Показывается, если проверка запущена
                onClose={handleCloseModal}  // Закрытие через функцию handleCloseModal
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>

                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleCloseModal}
                        aria-label="close"
                        sx={{ position: 'absolute', right: 20, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {loading && (
                        <div style={{ textAlign: 'center' }}>
                            <Typography variant="h6">Проверка на инбридинг ...</Typography>
                            <CircularProgress />
                        </div>
                    )}
                    {!loading && (
                        <div>
                            {inbreedingStatus === 'success' && (
                                <div>
                                    <div>
                                        {/* Отображение нужного текста перед успешным сообщением */}
                                        <Typography variant="h6" style={{ color: 'green' }} >Результа проверки инбридинга: </Typography>
                                        <Typography variant="body1" style={{ color: 'green' }}>
                                            Проверка инбридинга пройдена успешно!
                                        </Typography>
                                    </div>
                                    {pdfLink && (
                                        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }}>
                                            {/* Иконка файла и название отчета */}
                                            <DescriptionIcon style={{ marginRight: '8px' }} />
                                            <Typography variant="body1" style={{ marginRight: '16px' }}>{pdfname}</Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                href={pdfLink}
                                                download={pdfname}
                                            >
                                                Скачать отчет
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {inbreedingStatus === 'error' && (
                                <div style={{ color: 'red', marginTop: '16px' }}>
                                    <Typography variant="h6">Результаты проверки инбридинга:</Typography>
                                    <Typography variant="body1">Найдены инбредные животные:</Typography>
                                    <TableContainer component={Paper} style={{ marginTop: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Бык</TableCell>
                                                    <TableCell>Корова</TableCell>
                                                    <TableCell>Уровень Быка</TableCell>
                                                    <TableCell>Уровень Коровы</TableCell>
                                                    <TableCell>Общие Предки</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {inbredAnimals.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.bull}</TableCell>
                                                        <TableCell>{item.cow}</TableCell>
                                                        <TableCell>{item.bull_level}</TableCell>
                                                        <TableCell>{item.cow_level}</TableCell>
                                                        <TableCell>
                                                            {item.common_ancestors.join(', ')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                                        <Button variant="contained" color="primary" onClick={handleFixWithoutInbreeding}>
                                            Закрепить без инбредных коров
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={handleFixWithInbreeding}>
                                            Закрепить с инбредностью
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default IndividualDataDisplay;
