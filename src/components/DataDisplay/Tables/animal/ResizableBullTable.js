import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Resizable } from 'react-resizable';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import 'react-resizable/css/styles.css';
import Animal from '../../../Animal/Animal'; 
import './Table.css';
const apiUrl = process.env.REACT_APP_API_URL
const ResizableBullTable = ({ kodrn }) => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // состояние для управления модальным окном
    const [selectedIndivNumber, setSelectedIndivNumber] = useState(null); // состояние для хранения выбранного uniq_key
    const tableRef = useRef(null);

    const getValueOrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(2) : '');
    const getValue_OrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(0) : '');

    useEffect(() => {
        fetchData(); // Загрузка данных сразу при монтировании компонента
    }, [kodrn]);

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/pkbull/`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                    'Kodrn': kodrn,
                }
            });

            if (response.ok) {
                const newData = await response.json();
                setData(newData); // Получаем все данные сразу
            } else {
                console.error("Ошибка загрузки данных:", response.statusText);
            }
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        }
    };

    const handleDelete = (uniq_key) => {
        setData((prevData) => prevData.filter((row) => row.uniq_key !== uniq_key));
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
        { Header: 'Рабочий номер', accessor: 'nomer', id: 'nomer' },
        { Header: 'Индив номер', accessor: 'uniq_key', id: 'uniq_key' },
        { Header: 'Дата рождения', accessor: 'datarojd', id: 'datarojd' },
        { Header: 'Линия', accessor: d => d.lin_name || '', id: 'lin_name' },
        { Header: 'Комплекс', accessor: 'kompleks', id: 'kompleks' },
        { Header: 'Семя', accessor: 'sperma', id: 'sperma' },
        { Header: 'EBV удой', accessor: d => d.milkproductionindexbull ? getValueOrDefault(d.milkproductionindexbull.ebv_milk) : '', id: 'ebv_milk' },
        { Header: 'REL удой', accessor: d => d.milkproductionindexbull ? getValue_OrDefault(d.milkproductionindexbull.rel_milk) : '', id: 'rel_milk' },
        { Header: 'RM', accessor: d => d.milkproductionindexbull ? getValue_OrDefault(d.milkproductionindexbull.rm) : '', id: 'rm' },
        { Header: 'RC', accessor: d => d.conformationindexbull ? getValue_OrDefault(d.conformationindexbull.rc) : '', id: 'rc' },
        { Header: 'RF', accessor: d => d.reproductionindexbull ? getValue_OrDefault(d.reproductionindexbull.rf) : '', id: 'rf' },
        { Header: 'Rscs', accessor: d => d.somaticcellindexbull ? getValue_OrDefault(d.somaticcellindexbull.rscs) : '', id: 'rscs' },
        { Header: 'PI', accessor: d => d.complexindexbull ? getValue_OrDefault(d.complexindexbull.pi) : '', id: 'pi' },
        {
            Header: '',
            id: 'delete',
            Cell: ({ row }) => (
                <button className="delete-button" onClick={() => handleDelete(row.original.uniq_key)}>
                    <i className="fas fa-trash"></i> {/* Иконка корзины */}
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

            {/* Модальное окно для отображения компонента Animal */}
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

export default ResizableBullTable;
