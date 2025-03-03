import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../axiosConfig';
import BarChartComponent from './BarChartComponent'

import {
    Box,
    Button,
    TextField,
    Container,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
    IconButton
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { Alert } from '@mui/material';
import BullAnimal from './Animal';
import './Animal.css';
import CowAnimal from './CowAnimal';
import debounce from 'lodash.debounce';

const apiUrl = process.env.REACT_APP_API_URL

const Animal = ({ indivNumber: initialIndivNumber }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndivNumber, setSelectedIndivNumber] = useState(null);
    const [animalType, setAnimalType] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [indivNumber, setIndivNumber] = useState(initialIndivNumber || '');
    const [workNumber, setWorkNumber] = useState('');
    const [nickname, setNickname] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [animalData, setAnimalData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const getValueOrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(2) : 'Не указан');
    const getValue_OrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(0) : '-');


    useEffect(() => {
        if (initialIndivNumber) {
            fetchAnimalData(initialIndivNumber);
        }
    }, [initialIndivNumber]); // будет запускаться при изменении initialIndivNumber


    const fetchSuggestions = async (queryParam, searchType) => {
        try {
            const response = await axiosInstance.get(`find-animal/?${searchType}=${queryParam}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Ошибка получения подсказок', error);
        }
    };

    const fetchFarmSuggestions = useCallback(debounce((queryParam, searchType) => {
        fetchSuggestions(queryParam, searchType);
    }, 1000), []);

    useEffect(() => {
        if (indivNumber && !workNumber && !nickname) {
            fetchFarmSuggestions(indivNumber, 'search_uniq_key');
        } else {
            setSuggestions([]);
        }
    }, [indivNumber]);

    useEffect(() => {
        if (workNumber && !indivNumber && !nickname) {
            fetchFarmSuggestions(workNumber, 'search_nomer');
        } else {
            setSuggestions([]);
        }
    }, [workNumber]);

    useEffect(() => {
        if (nickname && !indivNumber && !workNumber) {
            fetchFarmSuggestions(nickname, 'search_klichka');
        } else {
            setSuggestions([]);
        }
    }, [nickname]);

    const handleSuggestionSelect = (suggestion) => {
        setIndivNumber(suggestion.uniq_key);
        setWorkNumber(suggestion.nomer);
        setNickname(suggestion.klichka);
        setSuggestions([]);
    };

    const fetchAnimalData = async (number) => {
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/api/v1/get-info-animal/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                    'Uniqkey': number
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.Answer === "Данные отсутсвуют.") {
                setAnimalData(null);
                setAnswer(result.Answer)
            } else { setAnimalData(result); }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!indivNumber) {
            alert('Пожалуйста, введите индивидуальный номер');
            return;
        }
        fetchAnimalData(indivNumber);
    };

    const handleReset = () => {
        setIndivNumber('');
        setWorkNumber('');
        setNickname('');
        setAnimalData(null);
        setSuggestions([]);
    };

    const renderTable = (data) => {
        if (!data) return null;
        return (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontSize: '18px', textAlign: 'center' }} >Показатель</TableCell>
                            <TableCell style={{ fontSize: '18px', textAlign: 'center' }} >EBV</TableCell>
                            <TableCell style={{ fontSize: '18px', textAlign: 'center' }} >REL</TableCell>
                            <TableCell style={{ fontSize: '18px', textAlign: 'center' }} >RBV</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.milkproductionindexbull && (
                            <>
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" sx={{ mb: 2 }}>
                                            Количество дочерей: <strong>{getValue_OrDefault(data.milkproductionindexbull.num_daug_est)}</strong>
                                            {' || '}
                                            Количество стад: <strong>{getValue_OrDefault(data.milkproductionindexbull.num_herd_est)}</strong>
                                        </Typography>
                                        <Divider />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }}  >{'M,kg'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.ebv_milk) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.rel_milk) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.rbv_milk) : 'Не указан'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }}  >{'F,kg'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.ebv_fkg) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.rel_fkg) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.rbv_fkg) : 'Не указан'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }}  >{'F,%'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.ebv_fprc) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.rel_fprc) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.rbv_fprc) : 'Не указан'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }}  >{'P,kg'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.ebv_pkg) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.rel_pkg) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.rbv_pkg) : 'Не указан'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }}  >{'P,%'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.ebv_pprc) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.rel_pprc) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.milkproductionindexbull ? getValueOrDefault(data.milkproductionindexbull.rbv_pprc) : 'Не указан'}</TableCell>
                                </TableRow>
                            </>
                        )}
                        {data.reproductionindexbull && (
                            <>
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" sx={{ mb: 2 }}>
                                            Количество дочерей: <strong>{getValue_OrDefault(data.reproductionindexbull.num_daug_est)}</strong>
                                            {' || '}
                                            Количество стад: <strong>{getValue_OrDefault(data.reproductionindexbull.num_herd_est)}</strong>
                                        </Typography>
                                        <Divider />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} >{'CRh'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.reproductionindexbull ? getValueOrDefault(data.reproductionindexbull.ebv_crh) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.reproductionindexbull ? getValueOrDefault(data.reproductionindexbull.rel_crh) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.reproductionindexbull ? getValueOrDefault(data.reproductionindexbull.rbv_crh) : 'Не указан'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} >{'CTF'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.reproductionindexbull ? getValueOrDefault(data.reproductionindexbull.ebv_ctfi) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.reproductionindexbull ? getValueOrDefault(data.reproductionindexbull.rel_ctfi) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.reproductionindexbull ? getValueOrDefault(data.reproductionindexbull.rbv_ctfi) : 'Не указан'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} >{'DO'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.reproductionindexbull ? getValueOrDefault(data.reproductionindexbull.ebv_do) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.reproductionindexbull ? getValueOrDefault(data.reproductionindexbull.rel_do) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.reproductionindexbull ? getValueOrDefault(data.reproductionindexbull.rbv_do) : 'Не указан'}</TableCell>
                                </TableRow>
                            </>
                        )}
                        {data.somaticcellindexbull && (
                            <>
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" sx={{ mb: 2 }}>
                                            Количество дочерей: <strong>{getValue_OrDefault(data.somaticcellindexbull.num_daug_est)}</strong>
                                            {' || '}
                                            Количество стад: <strong>{getValue_OrDefault(data.somaticcellindexbull.num_herd_est)}</strong>
                                        </Typography>
                                        <Divider />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} >{'SCS'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.somaticcellindexbull ? getValueOrDefault(data.somaticcellindexbull.ebv_scs) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.somaticcellindexbull ? getValueOrDefault(data.somaticcellindexbull.rel_scs) : 'Не указан'}</TableCell>
                                    <TableCell style={{ fontSize: '18px', textAlign: 'center' }} align="right">{data.somaticcellindexbull ? getValueOrDefault(data.somaticcellindexbull.rscs) : 'Не указан'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Divider />
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const renderParameterGrid = (data) => {
        if (!data) return null;
        return (
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader />
                        {data.conformationindexbull && (
                            <div>
                                <Typography style={{ padding: 10, textAlign: 'center' }} variant="h6" sx={{ mb: 2 }}>
                                    Количество дочерей: <strong>{getValue_OrDefault(data.conformationindexbull.num_daug_est)}</strong>
                                    {' || '}
                                    Количество стад: <strong>{getValue_OrDefault(data.conformationindexbull.num_herd_est)}</strong>
                                </Typography>

                                <CardContent>
                                    <Typography style={{ fontSize: '18px', textAlign: 'center' }}>RBVT: {getValue_OrDefault(data.conformationindexbull.rbvt)} RBVF: {getValue_OrDefault(data.conformationindexbull.rbvf)} RBVU: {getValue_OrDefault(data.conformationindexbull.rbvu)} RC: {getValue_OrDefault(data.conformationindexbull.rc)}</Typography>
                                </CardContent>
                                <hr></hr>
                                {
                                    data.milkproductionindexbull && data.reproductionindexbull && data.somaticcellindexbull && data.conformationindexbull && data.complexindexbull &&
                                    (
                                        <CardContent>
                                            <Typography style={{ fontSize: '18px', textAlign: 'center' }}>RM: {getValue_OrDefault(data.milkproductionindexbull.rm)} RF: {getValue_OrDefault(data.reproductionindexbull.rf)} RSCS: {getValue_OrDefault(data.somaticcellindexbull.rscs)} RC: {getValue_OrDefault(data.conformationindexbull.rc)} PI: {getValue_OrDefault(data.complexindexbull.pi)}</Typography>
                                        </CardContent>
                                    )
                                }

                            </div>
                        )}
                    </Card>
                </Grid>
            </Grid>

        );
    };

    const renderParentTable = (parentData) => {
        if (!parentData) return null;

        const parentEntries = [
            { label: 'M', value: parentData['M'], subEntries: [{ subLabel: 'M M', subValue: parentData['M M'] }, { subLabel: 'O M', subValue: parentData['M O'] }] },
            { label: 'O', value: parentData['O'], subEntries: [{ subLabel: 'M O', subValue: parentData['O M'] }, { subLabel: 'O O', subValue: parentData['O O'] }] }
        ];

        return (
            <div>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontSize: '18px', textAlign: 'center' }}>Родитель</TableCell>
                                <TableCell style={{ fontSize: '18px', textAlign: 'center' }} >Родители родителя</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {parentEntries.map(({ label, value, subEntries }) => (
                                <React.Fragment key={label}>
                                    <TableRow>
                                        <TableCell onContextMenu={(e) => {
                                            e.preventDefault();
                                            handleModalOpen(value, label);
                                        }}
                                            style={{ cursor: 'pointer', fontSize: '18px', textAlign: 'center' }} rowSpan={subEntries.length + 1}>{label}: {value || 'Не указан'}</TableCell>
                                    </TableRow>
                                    {subEntries.map(({ subLabel, subValue }) => (
                                        <TableRow key={subLabel}>
                                            <TableCell onContextMenu={(e) => {
                                                e.preventDefault();
                                                handleModalOpen(subValue, subLabel);
                                            }}
                                                style={{ cursor: 'pointer', fontSize: '18px', textAlign: 'center' }}>{subLabel}: {subValue || 'Не указан'}</TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Modal
                    open={isModalOpen}
                    onClose={handleModalClose}
                    aria-labelledby="animal-modal-title"
                    aria-describedby="animal-modal-description"
                >
                    <Box
                        sx={{
                            width: '80%',
                            maxHeight: '80vh',
                            margin: 'auto',
                            marginTop: '5%',
                            padding: '2rem',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            overflowY: 'auto',
                            position: 'relative',
                        }}
                    >
                        <IconButton
                            onClick={handleModalClose}
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        {animalType === 'bull' ? (
                            <BullAnimal indivNumber={selectedIndivNumber} />
                        ) : (
                            <CowAnimal indivNumber={selectedIndivNumber} />
                        )}
                    </Box>
                </Modal>
            </div>
        );
    };

    const handleModalOpen = (number, label) => {
        const indiv = number.includes(' ') ? number.split(' ')[0] : number;
        setSelectedIndivNumber(indiv);
        setIsModalOpen(true);
        if (label === 'O' || label === 'O M' || label === 'O O') {
            setAnimalType('bull');
        } else {
            setAnimalType('cow');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Container maxWidth="100%" sx={{ mt: 8 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                    mb: 4,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 2,
                    p: 3,
                    boxShadow: 1,
                }}
            >
                <TextField
                    label="Индивидуальный номер"
                    variant="outlined"
                    value={indivNumber}
                    onChange={(e) => setIndivNumber(e.target.value)}
                    placeholder="Введите номер"
                    fullWidth
                    sx={{ flex: 1 }}
                />
                <TextField
                    label="Рабочий номер"
                    variant="outlined"
                    value={workNumber}
                    onChange={(e) => setWorkNumber(e.target.value)}
                    placeholder="Введите номер"
                    fullWidth
                    sx={{ flex: 1 }}
                />
                <TextField
                    label="Кличка"
                    variant="outlined"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Введите кличку"
                    fullWidth
                    sx={{ flex: 1 }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button type="submit" variant="contained" color="primary">
                        Применить
                    </Button>
                    <Button type="button" variant="outlined" color="secondary" onClick={handleReset}>
                        Сбросить
                    </Button>
                </Box>
            </Box>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {suggestions.length > 0 && !animalData && (
                <Box
                    sx={{
                        maxHeight: 300,
                        overflowY: 'auto',
                        mt: 2,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        boxShadow: 1,
                    }}
                >
                    <List>
                        {suggestions.map((suggestion) => (
                            <ListItem button key={suggestion.uniq_key} onClick={() => handleSuggestionSelect(suggestion)}>
                                <ListItemText
                                    primary={`${suggestion.uniq_key} - ${suggestion.klichka}`}
                                    secondary={suggestion.nomer}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {animalData && (
                <div>
                    <Grid container spacing={3} sx={{ mt: 4 }}>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardHeader title="Общие данные о животном" />
                                <Divider />
                                <CardContent>
                                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left', marginLeft: '20px' }}>
                                        <strong>Индивидуальный номер:</strong> {animalData.info[0].uniq_key || 'Не указан'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left', marginLeft: '20px' }}>
                                        <strong>Рабочий номер:</strong> {animalData.info[0].nomer || 'Не указан'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left', marginLeft: '20px' }}>
                                        <strong>Кличка:</strong> {animalData.info[0].klichka || 'Не указана'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left', marginLeft: '20px' }}>
                                        <strong>Дата рождения:</strong> {animalData.info[0].datarojd || 'Не указана'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left', marginLeft: '20px' }}>
                                        <strong>Место рождения:</strong> {animalData.mestorojd || 'Не указан'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left', marginLeft: '20px' }}>
                                        <strong>Принадлежит:</strong> {animalData.ovner || 'Не указан'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left', marginLeft: '20px' }}>
                                        <strong>Комплекс:</strong> {animalData.info[0].kompleks || 'Не указан'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left', marginLeft: '20px' }}>
                                        <strong>Семя:</strong> {animalData.info[0].sperma || 'Не указаны'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left', marginLeft: '20px' }}>
                                        <strong>Ветка:</strong> {animalData.branch || 'Не указан'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left', marginLeft: '20px' }}>
                                        <strong>Линия:</strong> {animalData.info[0].lin_name || 'Не указано'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, textAlign: 'left', marginLeft: '20px' }}>
                                        <strong>Порода:</strong> {animalData.por.join(', ') || 'Не указано'}
                                    </Typography>
                                </CardContent>
                            </Card>


                            <br></br>

                            <Card>
                                <CardHeader title="Родословная" />
                                <Divider />
                                <CardContent>
                                    {renderParentTable(animalData.parent)}
                                </CardContent>
                            </Card>

                            <br></br>

                            <Card>
                                <CardContent>
                                    <Divider />
                                    {animalData.info[0].conformationindexdiagrambull && (
                                        <div className="print-area">
                                            <button style={{ width: '120px' }} onClick={handlePrint} className="print-button">Печатать</button>
                                            <div className="animal-id-print">
                                                <strong style={{ paddingRight: "10px" }}>Индивидуальный номер:</strong>
                                                {animalData.info[0].uniq_key || 'Не указан'}
                                                <span style={{ marginLeft: "20px" }}>
                                                    <strong>Рабочий номер: </strong>
                                                    {animalData.info[0].nomer || 'Не указан'}
                                                </span>
                                            </div>
                                            <BarChartComponent data={animalData.info[0].conformationindexdiagrambull} />
                                        </div>)
                                    }
                                </CardContent>
                            </Card>

                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, backgroundColor: 'white' }}>
                                <Typography variant="h6">Индексы</Typography>
                                {renderTable(animalData.info[0])}
                                {renderParameterGrid(animalData.info[0])}
                            </Box>
                        </Grid>

                    </Grid>

                    {/* <br></br>                
                    <Card>
                        <CardContent >
                            <Divider />
                            {animalData.info[0].conformationindexdiagrambull && (
                                <BarChartComponent data={animalData.info[0].conformationindexdiagrambull} />)
                            }
                        </CardContent>
                    </Card> */}

                </div>
            )}
            {answer && (
                <Box sx={{ mt: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Alert severity="info" sx={{ width: '400px', fontSize: '1.5rem', textAlign: 'center' }}>
                        Нет данных о таком животном.
                    </Alert>
                </Box>
            )}

        </Container>
    );
};

export default Animal;
