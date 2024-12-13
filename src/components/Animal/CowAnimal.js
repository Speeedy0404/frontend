import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../axiosConfig';
import ConformationList from './ConformationList'

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
import CowAnimal from './CowAnimal';
import BullAnimal from './Animal';
import debounce from 'lodash.debounce';

const apiUrl = process.env.REACT_APP_API_URL

const Animal = ({ indivNumber: initialIndivNumber }) => {
    const [isloading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndivNumber, setSelectedIndivNumber] = useState(null);
    const [animalType, setAnimalType] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [indivNumber, setIndivNumber] = useState(initialIndivNumber || '');
    const [workNumber, setWorkNumber] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [animalData, setAnimalData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const getValueOrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(2) : 'Не указан');
    const getValue_OrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(0) : '-');


    useEffect(() => {
        if (initialIndivNumber) {
            fetchAnimalData(initialIndivNumber);
        }
    }, [initialIndivNumber]);

    const fetchSuggestions = async (queryParam, searchType) => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`find-cow-animal/?${searchType}=${queryParam}`);
            setSuggestions(response.data);
            setLoading(false)
        } catch (error) {
            console.error('Ошибка получения подсказок', error);
        }
    };

    const fetchFarmSuggestions = useCallback(debounce((queryParam, searchType) => {
        fetchSuggestions(queryParam, searchType);
    }, 1000), []);


    useEffect(() => {
        if (indivNumber && !workNumber) {
            fetchFarmSuggestions(indivNumber, 'search_uniq_key');
        } else {
            setSuggestions([]);
        }
    }, [indivNumber]);

    useEffect(() => {
        if (workNumber && !indivNumber) {
            fetchFarmSuggestions(workNumber, 'search_nomer');
        } else {
            setSuggestions([]);
        }
    }, [workNumber]);


    const handleSuggestionSelect = (suggestion) => {
        setIndivNumber(suggestion.uniq_key);
        setWorkNumber(suggestion.nomer);
        setSuggestions([]);
    };

    const fetchAnimalData = async (number) => {
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/api/v1/get-info-cow-animal/`, {
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
                            <TableCell>Показатель</TableCell>
                            <TableCell>EBV</TableCell>
                            <TableCell>REL</TableCell>
                            <TableCell>RBV</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <>
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Divider />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'M,kg'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.ebv_milk) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.rel_milk) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.rbv_milk) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'F,kg'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.ebv_fkg) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.rel_fkg) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.rbv_fkg) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'F,%'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.ebv_fprc) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.rel_fprc) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.rbv_fprc) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'P,kg'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.ebv_pkg) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.rel_pkg) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.rbv_pkg) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'P,%'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.ebv_pprc) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.rel_pprc) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.rbv_pprc) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'RM'}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">{data.milkproductionindex ? getValueOrDefault(data.milkproductionindex.rm) : 'Не указан'}</TableCell>
                            </TableRow>
                        </>

                        <>
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Divider />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'CRh'}</TableCell>
                                <TableCell align="right">{data.reproductionindex ? getValueOrDefault(data.reproductionindex.ebv_crh) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.reproductionindex ? getValueOrDefault(data.reproductionindex.rel_crh) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.reproductionindex ? getValueOrDefault(data.reproductionindex.rbv_crh) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'CTF'}</TableCell>
                                <TableCell align="right">{data.reproductionindex ? getValueOrDefault(data.reproductionindex.ebv_ctfi) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.reproductionindex ? getValueOrDefault(data.reproductionindex.rel_ctfi) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.reproductionindex ? getValueOrDefault(data.reproductionindex.rbv_ctfi) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'DO'}</TableCell>
                                <TableCell align="right">{data.reproductionindex ? getValueOrDefault(data.reproductionindex.ebv_do) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.reproductionindex ? getValueOrDefault(data.reproductionindex.rel_do) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.reproductionindex ? getValueOrDefault(data.reproductionindex.rbv_do) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'RF'}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">{data.reproductionindex ? getValueOrDefault(data.reproductionindex.rf) : 'Не указан'}</TableCell>
                            </TableRow>
                        </>

                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const renderParameterGrid = (data) => {
        if (!data) return null;
        return (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Показатель</TableCell>
                            <TableCell>EBV</TableCell>
                            <TableCell>REL</TableCell>
                            <TableCell>RBV</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <>
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Divider />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'RSCS'}</TableCell>
                                <TableCell align="right">{data.somaticcellindex ? getValueOrDefault(data.somaticcellindex.ebv_scs) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.somaticcellindex ? getValueOrDefault(data.somaticcellindex.rel_scs) : 'Не указан'}</TableCell>
                                <TableCell align="right">{data.somaticcellindex ? getValueOrDefault(data.somaticcellindex.rscs) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Divider />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'RBVT'}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">{data.conformationindex ? getValueOrDefault(data.conformationindex.rbvt) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'RVBF'}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">{data.conformationindex ? getValueOrDefault(data.conformationindex.rbvf) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'RBVU'}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">{data.conformationindex ? getValueOrDefault(data.conformationindex.rbvu) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{'RC'}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">{data.conformationindex ? getValueOrDefault(data.conformationindex.rc) : 'Не указан'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Divider />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>{'PI'}</strong></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">{data.complexindex ? getValueOrDefault(data.complexindex.pi) : 'Не указан'}</TableCell>
                            </TableRow>
                        </>
                    </TableBody>
                </Table>
            </TableContainer>
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
                                <TableCell>Родитель</TableCell>
                                <TableCell align="left">Родители родителя</TableCell>
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
                                            style={{ cursor: 'pointer' }} rowSpan={subEntries.length + 1}>{label}: {value || 'Не указан'}</TableCell>
                                    </TableRow>
                                    {subEntries.map(({ subLabel, subValue }) => (
                                        <TableRow key={subLabel}>
                                            <TableCell onContextMenu={(e) => {
                                                e.preventDefault();
                                                handleModalOpen(subValue, subLabel);
                                            }}
                                                style={{ cursor: 'pointer' }}>{subLabel}: {subValue || 'Не указан'}</TableCell>
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
                    disabled={isloading} // Отключаем поле при загрузке
                />
                <TextField
                    label="Рабочий номер"
                    variant="outlined"
                    value={workNumber}
                    onChange={(e) => setWorkNumber(e.target.value)}
                    placeholder="Введите номер"
                    fullWidth
                    sx={{ flex: 1 }}
                    disabled={isloading} // Отключаем поле при загрузке
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                        Применить
                    </Button>
                    <Button type="button" variant="outlined" color="secondary" onClick={handleReset} disabled={isLoading}>
                        Сбросить
                    </Button>
                </Box>
                {isloading && <CircularProgress />}
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
                                    primary={`${suggestion.uniq_key} - ${suggestion.nomer}`}
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
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Основная информация
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        <strong>Индивидуальный номер:</strong> {animalData.info[0].uniq_key || 'Не указан'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        <strong>Рабочий номер:</strong> {animalData.info[0].nomer || 'Не указан'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        <strong>Дата рождения:</strong> {animalData.info[0].datarojd || 'Не указана'}
                                    </Typography>
                                    {/* <Typography variant="body1" sx={{ mb: 1 }}>
                                        <strong>Дата выбытия:</strong> {animalData.info[0].datavybr || 'Не указана'}
                                    </Typography> */}
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        <strong>Место рождения:</strong> {animalData.mestorojd || 'Не указан'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        <strong>Комплекс:</strong> {animalData.kompleks || 'Не указан'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        <strong>Ветка:</strong> {animalData.branch || 'Не указан'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }} >
                                        <strong>Линия:</strong> {animalData.lin || 'Не указано'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }} >
                                        <strong>Порода:</strong> {animalData.por || 'Не указано'}
                                    </Typography>
                                </CardContent>
                            </Card>

                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardHeader title="Родословная" />
                                <Divider />
                                <CardContent>
                                    {renderParentTable(animalData.parent)}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, backgroundColor: 'white' }}>
                                <Typography variant="h6">Индексы</Typography>
                                {renderTable(animalData.info[0])}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, backgroundColor: 'white' }}>
                                <Typography variant="h6">Индексы</Typography>
                                {renderParameterGrid(animalData.info[0])}
                            </Box>
                        </Grid>

                    </Grid>

                    <br></br>

                    {animalData.info[0].conformationindex && (
                        <ConformationList data={animalData.info[0].conformationindex} />)
                    }


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
