import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Resizable } from "react-resizable";
import 'react-resizable/css/styles.css';
import './Table.css';
import Animal from '../../../Animal/Animal';

import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';

import {
    Modal,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    CircularProgress
} from '@mui/material';

const apiUrl = process.env.REACT_APP_API_URL
const FilterBullTable = ({ datas, selectedComplexYoung, selectedComplex, kodrn, isCow }) => {
    const [data, setData] = useState(datas);
    const tableRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // состояние для управления модальным окном
    const [selectedIndivNumber, setSelectedIndivNumber] = useState(null); // состояние для хранения выбранного uniq_key

    const [pdfname, setPdfName] = useState('')
    const [loading, setLoading] = useState(false);
    const [pdfLink, setPdfLink] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [inbreedingStatus, setInbreedingStatus] = useState(null);
    const [inbredAnimals, setInbredAnimals] = useState([]);

    const getValueOrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(2) : '');
    const getValue_OrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(0) : '');

    useEffect(() => {
        setData(datas);
    }, [datas]);

    const handleDelete = (uniq_key) => {
        setData((prevData) => prevData.filter((row) => row.uniq_key !== uniq_key));
    };

    // Функция для отправки данных на сервер для проверки инбридинга
    const handleCheckInbreeding = async () => {
        const uniqKeys = data.map(row => row.uniq_key);
        setLoading(true); // Включаем анимацию загрузки
        setModalOpen(true); // Открываем модальное окно при начале проверки
        try {

            if (isCow) {

                const response = await fetch(`${apiUrl}/api/v1/inbreeding/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                        'selectedComplex': selectedComplex,
                        'Kodrn': kodrn,
                        'Mode': 'Cow'
                    },
                    body: JSON.stringify({ uniq_keys: uniqKeys }),
                });

                const result = await response.json();

                if (response.ok) {
                    if (result.inbreeding_check) {
                        setInbreedingStatus('success');
                    } else {
                        setInbreedingStatus('error');
                        setInbredAnimals(result.inbred_animals);
                        setLoading(false);
                        return;
                    }

                    setPdfName(result.pdf_filename)

                    const pdfResponse = await fetch(`${apiUrl}/api/v1/get-pdf-report/${result.pdf_filename}`, {
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

                }
            }
            else {

                const response = await fetch(`${apiUrl}/api/v1/inbreeding/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                        'selectedComplex': selectedComplexYoung,
                        'Kodrn': kodrn,
                        'Mode': 'Young'
                    },
                    body: JSON.stringify({ uniq_keys: uniqKeys }),
                });

                const result = await response.json();

                if (response.ok) {
                    if (result.inbreeding_check) {
                        setInbreedingStatus('success');
                    } else {
                        setInbreedingStatus('error');
                        setInbredAnimals(result.inbred_animals);
                        setLoading(false);
                        return;
                    }

                    setPdfName(result.pdf_filename)

                    const pdfResponse = await fetch(`${apiUrl}/api/v1/get-pdf-report/${result.pdf_filename}`, {
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
                }
            }
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
        }
    };

    const handleRowContextMenu = (event, uniq_key) => {
        event.preventDefault(); // Отключаем стандартное контекстное меню
        setSelectedIndivNumber(uniq_key); // Сохраняем выбранный uniq_key
        setIsModalOpen(true); // Открываем модальное окно
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Закрываем модальное окно
        setSelectedIndivNumber(null); // Сбрасываем выбранный uniq_key
    };

    const minColumnWidths = {
        uniq_key: 10,
        nomer: 10,
        datarojd: 10,
        lin_name: 10,
        kompleks: 10,
        sperma: 10,
        ebv_milk: 10,
        rel_milk: 10,
        rm: 10,
        rc: 10,
        rf: 10,
        rscs: 10,
        pi: 10,
        delete: 10,
    };
    const columns = useMemo(() => [
        { Header: 'Индив номер', accessor: 'uniq_key', id: 'uniq_key' },
        { Header: 'Рабочий номер', accessor: 'nomer', id: 'nomer' },
        { Header: 'Дата рождения', accessor: 'datarojd', id: 'datarojd' },
        { Header: 'Линия', accessor: d => d.lin_name || '-', id: 'lin_name' },
        { Header: 'Комплекс', accessor: 'kompleks', id: 'kompleks' },
        { Header: 'Семя', accessor: 'sperma', id: 'sperma' },
        { Header: 'EBV удой', accessor: d => d.milkproductionindexbull ? getValueOrDefault(d.milkproductionindexbull.ebv_milk) : '', id: 'ebv_milk' },
        { Header: 'REL удой', accessor: d => d.milkproductionindexbull ? getValue_OrDefault(d.milkproductionindexbull.rel_milk) : '', id: 'rel_milk' },
        { Header: 'RM', accessor: d => d.milkproductionindexbull ? getValueOrDefault(d.milkproductionindexbull.rm) : '', id: 'rm' },
        { Header: 'RC', accessor: d => d.conformationindexbull ? getValueOrDefault(d.conformationindexbull.rc) : '', id: 'rc' },
        { Header: 'RF', accessor: d => d.reproductionindexbull ? getValueOrDefault(d.reproductionindexbull.rf) : '', id: 'rf' },
        { Header: 'Rscs', accessor: d => d.somaticcellindexbull ? getValueOrDefault(d.somaticcellindexbull.rscs) : '', id: 'rscs' },
        { Header: 'PI', accessor: d => d.complexindexbull ? getValueOrDefault(d.complexindexbull.pi) : '', id: 'pi' },
        {
            Header: '', // Заголовок для удаления
            id: 'delete',
            Cell: ({ row }) => (
                <button className="delete-button" onClick={() => handleDelete(row.original.uniq_key)}>
                    <i className="fas fa-trash"></i>
                </button>
            ),
        },
    ], []);

    const [columnWidths, setColumnWidths] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.id] = minColumnWidths[column.id] || 80;
            return acc;
        }, {})
    );

    const handleResize = (columnId) => (event, { size }) => {
        setColumnWidths((old) => ({
            ...old,
            [columnId]: Math.max(size.width, minColumnWidths[columnId] || 10),
        }));
    };

    const defaultColumn = useMemo(
        () => ({
            minWidth: 50,
            width: 80,
        }),
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
            defaultColumn,
        },
        useSortBy
    );

    return (
        <div className="table-container">

            <div style={{ marginBottom: '10px' }}>
                <button onClick={handleCheckInbreeding} className="check-inbreeding-button">
                    {loading ? "Проверка..." : "Закрепить"}
                </button>
            </div>

            <table {...getTableProps()} className="table" ref={tableRef}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className="resizable"
                                >
                                    <Resizable
                                        width={columnWidths[column.id]}
                                        height={0}
                                        onResize={handleResize(column.id)}
                                        draggableOpts={{ enableUserSelectHack: false }}
                                    >
                                        <div
                                            style={{
                                                width: columnWidths[column.id],
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? ' 🔽'
                                                        : ' 🔼'
                                                    : ''}
                                            </span>
                                        </div>
                                    </Resizable>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} onContextMenu={(e) => handleRowContextMenu(e, row.original.uniq_key)}>
                                {row.cells.map(cell => (
                                    <td
                                        {...cell.getCellProps()}
                                        style={{ width: columnWidths[cell.column.id] }}
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            
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
                                    <Typography variant="h6">Результа проверки инбридинга:</Typography>
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
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Modal
                open={isModalOpen}
                onClose={handleModalClose}
                aria-labelledby="animal-modal-title"
                aria-describedby="animal-modal-description"
            >
                <Box
                    sx={{
                        width: '80%',
                        maxHeight: '80vh', // Ограничиваем высоту модального окна
                        margin: 'auto',
                        marginTop: '5%',
                        padding: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        overflowY: 'auto', // Добавляем прокрутку по вертикали
                        position: 'relative', // Для позиционирования кнопки закрытия
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
                    <Animal indivNumber={selectedIndivNumber} />
                </Box>
            </Modal>
        </div>
    );
};

export default FilterBullTable;
