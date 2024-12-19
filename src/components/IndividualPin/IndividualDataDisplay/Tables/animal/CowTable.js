import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTable, useSortBy } from 'react-table';
import { VariableSizeList as List } from 'react-window';
import axiosInstance from '../../../../../axiosConfig';
import { Modal, Box, IconButton, Checkbox, CircularProgress, Button, Typography, TextField, RadioGroup, FormControlLabel, Radio, TableContainer, Paper, Table, TableHead, TableRow, TableCell, Divider, TableBody } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CowAnimal from '../../../../Animal/CowAnimal';
import './CowTable.css';

const labels = [
    'M,kg', 'F,kg', 'F,%', 'P,kg', 'P,%', 'RM', 'CRh', 'CTF', 'DO', 'RF', 'RSCS', 'RBVT', 'RVBF', 'RBVU', 'RC', 'PI',
    'Тип', 'Крепость телосложения', 'Рост', 'Глубина туловища', 'Положение зада',
    'Ширина зада', 'Постановка задних конечностей (сбоку)', 'Постановка задних конечностей (сзади)',
    'Выраженность скакательного сустава', 'Постановка задних копыт',
    'Глубина вымени', 'Прикрепление передней долей вымени', 'Высота задней части вымени',
    'Ширина задней части вымени', 'Центральная связка (глубина доли)',
    'Расположение передних сосков', 'Расположение задних сосков', 'Длина сосков (передних)'
];

const keyMapping = {
    "CRh": "rbv_crh",
    "CTF": "rbv_ctfi",
    "DO": "rbv_do",
    "F,%": "rbv_fprc",
    "F,kg": "rbv_fkg",
    "M,kg": "rbv_milk",
    "P,%": "rbv_pprc",
    "P,kg": "rbv_pkg",
    "PI": "pi",
    "RBVT": "rbvt",
    "RBVU": "rbvu",
    "RC": "rc",
    "RF": "rf",
    "RM": "rm",
    "RSCS": "rscs",
    "RVBF": "rbvf",
    "Выраженность скакательного сустава": "rbv_sust",
    "Высота задней части вымени": "rbv_vzcv",
    "Глубина вымени": "rbv_gv",
    "Глубина туловища": "rbv_gt",
    "Длина сосков (передних)": "rbv_ds",
    "Крепость телосложения": "rbv_kt",
    "Положение зада": "rbv_pz",
    "Постановка задних конечностей (сбоку)": "rbv_pzkb",
    "Постановка задних конечностей (сзади)": "rbv_pzkz",
    "Постановка задних копыт": "rbv_pzkop",
    "Прикрепление передней долей вымени": "rbv_pdv",
    "Расположение задних сосков": "rbv_rzs",
    "Расположение передних сосков": "rbv_rps",
    "Рост": "rbv_rost",
    "Тип": "rbv_tip",
    "Центральная связка (глубина доли)": "rbv_csv",
    "Ширина зада": "rbv_shz",
    "Ширина задней части вымени": "rbv_szcv",
};
const apiUrl = process.env.REACT_APP_API_URL
const CowTable = ({ key, kodrn, dataCow, onSelectedChange, onParamChange }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(null)
    const [avg, setAvg] = useState([])
    const [isLeftModalOpen, setIsLeftModalOpen] = useState(false);
    const [isRightModalOpen, setIsRightModalOpen] = useState(false);
    const [selectedIndivNumber, setSelectedIndivNumber] = useState(null);
    const [selectedCows, setSelectedCows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [cowParams, setCowParams] = useState([]);

    const [param, setParam] = useState({});

    const [selectedChoices, setSelectedChoices] = useState([]);

    const getValue_OrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(0) : '');
    const getCons = (value) => (value !== false ? 'Закреп' : '');

    useEffect(() => {
        fetchData();
    }, [dataCow, key]);

    useEffect(() => {
        // При изменении selectedIndivNumber, проверяем, есть ли сохраненные данные для этой коровы
        if (selectedIndivNumber) {
            const existingChoice = selectedChoices.find(choice => choice[0] === selectedIndivNumber);
            if (existingChoice) {
                const params = existingChoice[1].reduce((acc, [key, , value]) => {
                    acc[key] = value; // Восстанавливаем сохраненные значения параметров
                    return acc;
                }, {});
                setParam(params); // Устанавливаем их в param, чтобы отображать в модальном окне
            } else {
                // Если сохраненных данных нет, сбрасываем параметры на начальные значения
                setParam({
                    "M,kg": '?', "F,kg": '?', "F,%": '?', "P,kg": '?', "P,%": '?', "RM": '?',
                    "CRh": '?', "CTF": '?', "DO": '?', "RF": '?', "RSCS": '?', "RBVT": '?',
                    "RVBF": '?', "RBVU": '?', "RC": '?', "PI": '?', 'Тип': '?', 'Крепость телосложения': '?',
                    'Рост': '?', 'Глубина туловища': '?', 'Положение зада': '?', 'Ширина зада': '?',
                    'Постановка задних конечностей (сбоку)': '?', 'Постановка задних конечностей (сзади)': '?',
                    'Выраженность скакательного сустава': '?', 'Постановка задних копыт': '?', 'Глубина вымени': '?',
                    'Прикрепление передней долей вымени': '?', 'Высота задней части вымени': '?',
                    'Ширина задней части вымени': '?', 'Центральная связка (глубина доли)': '?',
                    'Расположение передних сосков': '?', 'Расположение задних сосков': '?', 'Длина сосков (передних)': '?'
                });
            }
        }
    }, [selectedIndivNumber, selectedChoices]);

    const fetchData = async () => {
        setIsLoading(true);
        setSelectedCows([]);
        onSelectedChange([]);
        try {
            const response = await fetch(`${apiUrl}/api/v1/api/v1/pkcow-individual/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                    'Kodrn': kodrn,
                },
                body: JSON.stringify(dataCow),
            });

            if (response.ok) {
                const newData = await response.json();
                setData(newData.results);
                setCount(newData.count)
                setAvg(newData.aggregated_data)
            } else {
                console.error("Ошибка загрузки данных:", response.statusText);
            }
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRowClick = async (uniq_key, event) => {
        // Если клик был на чекбоксе, не открывать модальное окно
        if (event.target.type === 'checkbox') {
            return;  // Прерываем выполнение, если клик был по чекбоксу
        }
        setSelectedIndivNumber(uniq_key);
        try {
            const response = await axiosInstance.get(`pkcow-params/${uniq_key}`);
            setCowParams(response.data.params);
            setIsLeftModalOpen(true);
        } catch (error) {
            console.error('Ошибка загрузки параметров:', error);
        }
    };

    const handleSaveChoices = () => {
        const selectedData = Object.entries(param).map(([key, value]) => {
            const cowParamsKey = keyMapping[key];
            const cowParamsValue = cowParams[cowParamsKey] || "Не указан";
            return [key, cowParamsValue, value];
        });

        const existingChoiceIndex = selectedChoices.findIndex(choice => choice[0] === selectedIndivNumber);

        if (existingChoiceIndex !== -1) {
            const updatedChoices = [...selectedChoices];
            updatedChoices[existingChoiceIndex] = [selectedIndivNumber, selectedData];
            setSelectedChoices(updatedChoices);
        } else {
            setSelectedChoices([...selectedChoices, [selectedIndivNumber, selectedData]]);
        }

        setParam(prevParam => ({
            ...prevParam,
            ...selectedData.reduce((acc, [key, , value]) => {
                acc[key] = value;
                return acc;
            }, {})
        }));
    };

    const handleSelectBulls = () => {
        onParamChange(selectedChoices)
    };

    const handleDeleteFilters = () => {
        setSelectedChoices([])
        onParamChange([])
    };

    const handleRowContextMenu = (event, uniq_key) => {
        event.preventDefault();
        setSelectedIndivNumber(uniq_key);
        setIsRightModalOpen(true);
    };

    const handleLeftModalClose = () => {
        setIsLeftModalOpen(false);
        setSelectedIndivNumber(null);
        setParam({
            "M,kg": '?',
            "F,kg": '?',
            "F,%": '?',
            "P,kg": '?',
            "P,%": '?',
            "RM": '?',
            "CRh": '?',
            "CTF": '?',
            "DO": '?',
            "RF": '?',
            "RSCS": '?',
            "RBVT": '?',
            "RVBF": '?',
            "RBVU": '?',
            "RC": '?',
            "PI": '?',
            'Тип': '?',
            'Крепость телосложения': '?',
            'Рост': '?',
            'Глубина туловища': '?',
            'Положение зада': '?',
            'Ширина зада': '?',
            'Постановка задних конечностей (сбоку)': '?',
            'Постановка задних конечностей (сзади)': '?',
            'Выраженность скакательного сустава': '?',
            'Постановка задних копыт': '?',
            'Глубина вымени': '?',
            'Прикрепление передней долей вымени': '?',
            'Высота задней части вымени': '?',
            'Ширина задней части вымени': '?',
            'Центральная связка (глубина доли)': '?',
            'Расположение передних сосков': '?',
            'Расположение задних сосков': '?',
            'Длина сосков (передних)': '?',
        });
        setCowParams([])
    };

    const handleRightModalClose = () => {
        setIsRightModalOpen(false);
        setSelectedIndivNumber(null);
    };

    const handleSelectCow = (uniq_key) => {
        setSelectedCows((prevSelected) => {
            const newSelected = prevSelected.includes(uniq_key)
                ? prevSelected.filter(id => id !== uniq_key)
                : [...prevSelected, uniq_key];

            // Передаем обновленный список выбранных коров
            onSelectedChange(newSelected);
            return newSelected;
        });
    };

    // Функция для отметки/снятия отметок всех коров
    const handleToggleAllCows = () => {
        const selectableCows = data.filter(cow => !cow.consolidation).map(cow => cow.uniq_key);
        if (selectedCows.length === selectableCows.length) {
            // Если все коровы выбраны, то снимаем отметки
            setSelectedCows([]);
            onSelectedChange([]);
        } else {
            // Иначе отмечаем всех
            setSelectedCows(selectableCows);
            onSelectedChange(selectableCows);
        }
    };

    // Обработка изменения поля поиска
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Фильтруем данные по введенному номеру
    const filteredData = useMemo(() => {
        if (searchQuery) {
            return data.filter(cow => cow.uniq_key.toString().includes(searchQuery));
        }
        return data;
    }, [searchQuery, data]);

    const columns = useMemo(() => [
        {
            Header: '',
            id: 'select',
            Cell: ({ row }) => (
                <Checkbox
                    disabled={row.original.consolidation} // Делаем чекбокс неактивным, если consolidation true
                    checked={selectedCows.includes(row.original.uniq_key)}
                    onChange={() => handleSelectCow(row.original.uniq_key)}
                    className="first-column-cow" // Примените класс для чекбокса
                />
            ),
            className: 'first-column-cow' // Примените класс для заголовка
        },
        {
            Header: 'Закреп.',
            accessor: (row) => getCons(row.consolidation),
            className: 'consolidation'
        },
        { Header: 'Номер', accessor: 'uniq_key', className: 'indiv-number-cow' },
        { Header: 'Д.р.', accessor: 'datarojd', className: 'data' },
        { Header: 'К.О', accessor: d => d.father_info.kompleks || '', id: 'kompleks', className: 'kompleks' },
        { Header: `RM (${avg.milk ? getValue_OrDefault(avg.milk.avg_rm) : '-'})`, accessor: d => d.milkproductionindex ? getValue_OrDefault(d.milkproductionindex.rm) : '', id: 'rm', className: 'RM' },
        { Header: `RBVT (${avg.conf ? getValue_OrDefault(avg.conf.avg_rbvt) : '-'})`, accessor: d => d.conformationindex ? getValue_OrDefault(d.conformationindex.rbvt) : '', id: 'rbvt', className: 'RBVT' },
        { Header: `RBVF (${avg.conf ? getValue_OrDefault(avg.conf.avg_rbvf) : '-'})`, accessor: d => d.conformationindex ? getValue_OrDefault(d.conformationindex.rbvf) : '', id: 'rbvf', className: 'RBVF' },
        { Header: `RBVU (${avg.conf ? getValue_OrDefault(avg.conf.avg_rbvu) : '-'})`, accessor: d => d.conformationindex ? getValue_OrDefault(d.conformationindex.rbvu) : '', id: 'rbvu', className: 'RBVU' },
        { Header: `RC (${avg.conf ? getValue_OrDefault(avg.conf.avg_rc) : '-'})`, accessor: d => d.conformationindex ? getValue_OrDefault(d.conformationindex.rc) : '', id: 'rc', className: 'RC' },
        { Header: `RF (${avg.reprod ? getValue_OrDefault(avg.reprod.avg_rf) : '-'})`, accessor: d => d.reproductionindex ? getValue_OrDefault(d.reproductionindex.rf) : '', id: 'rf', className: 'RF' },
        { Header: `PI (${avg.com ? getValue_OrDefault(avg.com.avg_pi) : '-'})`, accessor: d => d.complexindex ? getValue_OrDefault(d.complexindex.pi) : '', id: 'pi', className: 'PI' },
    ], [selectedCows, avg]);

    const { getTableBodyProps, getTableProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data: filteredData }, // Используем отфильтрованные данные
        useSortBy
    );

    const tableRef = useRef(null);

    useEffect(() => {
        const table = tableRef.current;
        const headerCells = table.querySelectorAll('.table-header-cell');
        const bodyCells = table.querySelectorAll('.table-row');

        if (headerCells.length && bodyCells.length) {
            const columnCount = headerCells.length;
            headerCells.forEach((headerCell, index) => {
                const maxWidth = Array.from(bodyCells).reduce((max, row) => {
                    const cell = row.querySelector(`.table-cell:nth-child(${index + 1})`);
                    return cell ? Math.max(max, cell.scrollWidth) : max;
                }, headerCell.scrollWidth);
                headerCell.style.width = `${maxWidth}px`;
            });
        }
    }, [filteredData]);

    const Row = useCallback(({ index, style }) => {
        const row = rows[index];
        prepareRow(row);

        const rowStyle = row.original.consolidation
            ? { ...style, backgroundColor: '#f5f5f5', color: '#999' }  // Если consolidation true, изменяем фон и цвет текста
            : style;

        return (
            <div {...row.getRowProps({ style: rowStyle })} className="table-row" onClick={(e) => handleRowClick(row.original.uniq_key, e)} onContextMenu={(e) => handleRowContextMenu(e, row.original.uniq_key)}>
                {row.cells.map(cell => (
                    <div {...cell.getCellProps()} className={`table-cell ${cell.column.className}`}>
                        {cell.render('Cell')}
                    </div>
                ))}
            </div>
        );
    }, [prepareRow, rows]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setParam({
            ...param,
            [name]: value,
        });
    };

    const renderTable = (data) => {
        if (!data) return null;

        const values = Object.values(data);

        const allLabels = labels;
        const allValues = values;

        return (
            <TableContainer component={Paper} sx={{ maxHeight: 600, overflowY: 'auto', mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Показатель</TableCell>
                            <TableCell >RBV</TableCell>
                            <TableCell >Выбор</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allLabels.map((label, index) => (
                            <TableRow key={label}>
                                <TableCell>{label}</TableCell>
                                <TableCell align="right">{allValues[index]}</TableCell>
                                <TableCell align="right">
                                    <RadioGroup
                                        row
                                        name={label}  // Ensure each group has a name corresponding to the label
                                        value={param[label]}
                                        onChange={(e) => handleInputChange(e)} // Adjusted to pass event to handler
                                    >
                                        <FormControlLabel value="+" control={<Radio />} label="+" />
                                        <FormControlLabel value="=" control={<Radio />} label="=" />
                                        <FormControlLabel value="?" control={<Radio />} label="?" />
                                    </RadioGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <div className="table-container">
            <div className="table-wrapper">
                {isLoading ? (
                    <div className="loading-container">
                        <CircularProgress />
                        <p>Загрузка данных...</p>
                    </div>
                ) : (
                    <>

                        <div style={{ display: 'flex', alignItems: 'center', padding: '5px', flexDirection: 'row', gap: '10px', marginTop: '10px' }}>
                            <TextField
                                label="Поиск по номеру"
                                variant="outlined"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                style={{ width: '300px' }}
                            />

                            <Button onClick={handleToggleAllCows} variant="contained" style={{ marginBottom: '5px', width: '200px' }}>
                                {selectedCows.length === data.filter(cow => !cow.consolidation).length ? 'Снять выделение' : 'Выбрать всех'}
                            </Button>
                            <Button onClick={handleSelectBulls} variant="contained" style={{ marginBottom: '5px', width: '200px' }}>
                                Подобрать быков
                            </Button>
                            <Button onClick={handleDeleteFilters} variant="contained" style={{ marginBottom: '5px', width: '210px' }}>
                                Сбросить Фильтры
                            </Button>
                        </div>

                        <Typography variant="h6" style={{ margin: '20px 0' }}>
                            Всего коров: {count}
                        </Typography>

                        <div className="table" ref={tableRef}>
                            <div className="table-header">
                                {headerGroups.map(headerGroup => (
                                    <div {...headerGroup.getHeaderGroupProps()} className="table-header-row">
                                        {headerGroup.headers.map(column => (
                                            <div {...column.getHeaderProps(column.getSortByToggleProps())} className={`table-header-cell ${column.className} ${column.isSorted ? (column.isSortedDesc ? 'sorted-desc' : 'sorted-asc') : ''}`}>
                                                {column.render('Header')}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div {...getTableBodyProps()} className="table-body">
                                <List
                                    height={600}
                                    itemCount={rows.length}
                                    itemSize={() => 50}
                                    width="100%"
                                >
                                    {Row}
                                </List>
                            </div>
                        </div>

                        <Modal
                            open={isRightModalOpen}
                            onClose={handleRightModalClose}
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
                                    onClick={handleRightModalClose}
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <CowAnimal indivNumber={selectedIndivNumber} />
                            </Box>
                        </Modal>

                        <Modal open={isLeftModalOpen} onClose={handleLeftModalClose}>
                            <Box sx={{
                                width: '50%',
                                height: '800px',
                                margin: 'auto',
                                marginTop: '5%',
                                padding: '2rem',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                overflowY: 'auto',
                                position: 'relative',
                            }}>

                                <IconButton
                                    onClick={handleLeftModalClose}
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <Typography variant="h6">Параметры коровы: {selectedIndivNumber}</Typography>
                                {renderTable(cowParams)}
                                <Button onClick={handleSaveChoices} variant="contained" style={{ marginTop: '20px' }}>
                                    Сохранить выбор
                                </Button>
                            </Box>
                        </Modal>

                    </>
                )}
            </div>
        </div>
    );
};

export default CowTable;
