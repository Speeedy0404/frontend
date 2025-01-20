import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTable, useSortBy } from 'react-table';
import { VariableSizeList as List } from 'react-window';
import { Checkbox, CircularProgress, Button, Typography, TextField } from '@mui/material';

const apiUrl = process.env.REACT_APP_API_URL
const YoungTable = ({ key, kodrn, dataYoung, selectedYoungMain, onSelectedChange }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(null)

    const [selectedYoung, setSelectedYoung] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // Поле для поиска

    const getValue_OrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(0) : '');
    const getCons = (value) => (value !== false ? 'Закреп' : '');

    useEffect(() => {
        fetchData();
    }, [dataYoung, key]);

    useEffect(() => {
        if (JSON.stringify(selectedYoungMain) !== JSON.stringify(selectedYoung)) {
            setSelectedYoung(selectedYoungMain);
        }
    }, [selectedYoungMain]);

    const fetchData = async () => {
        setIsLoading(true);
        setSelectedYoung([]);
        onSelectedChange([]);
        try {
            const response = await fetch(`${apiUrl}/api/v1/api/v1/young-individual/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                    'Kodrn': kodrn,
                },
                body: JSON.stringify(dataYoung),
            });

            if (response.ok) {
                const newData = await response.json();
                setData(newData.results);
                setCount(newData.count)
            } else {
                console.error("Ошибка загрузки данных:", response.statusText);
            }
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectYoung = (uniq_key) => {
        setSelectedYoung((prevSelected) => {
            const newSelected = prevSelected.includes(uniq_key)
                ? prevSelected.filter(id => id !== uniq_key)
                : [...prevSelected, uniq_key];

            // Передаем обновленный список выбранных коров
            onSelectedChange(newSelected);
            return newSelected;
        });
    };

    // Функция для отметки/снятия отметок всех коров
    const handleToggleAllYoung = () => {
        const selectableYoung = data.filter(cow => !cow.consolidation).map(cow => cow.uniq_key);
        if (selectedYoung.length === selectableYoung.length) {
            // Если все коровы выбраны, то снимаем отметки
            setSelectedYoung([]);
            onSelectedChange([]);
        } else {
            // Иначе отмечаем всех
            setSelectedYoung(selectableYoung);
            onSelectedChange(selectableYoung);
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
                    checked={selectedYoung.includes(row.original.uniq_key)}
                    onChange={() => handleSelectYoung(row.original.uniq_key)}
                    className="first-column" // Примените класс для чекбокса
                />
            ),
            className: 'first-column' // Примените класс для заголовка
        },
        {
            Header: 'Закреп.',
            accessor: (row) => getCons(row.consolidation),
        },
        { Header: 'Номер', accessor: 'uniq_key', className: 'indiv-number' },
        { Header: 'Д.р.', accessor: 'datarojd' },
        { Header: 'К.О', accessor: d => d.father_info.kompleks || '', id: 'kompleks' },
        { Header: 'Линия', accessor: d => d.father_info.lin_name || '', id: 'lin_name' },
    ], [selectedYoung]);

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
            <div {...row.getRowProps({ style: rowStyle })} className="table-row" >
                {row.cells.map(cell => (
                    <div {...cell.getCellProps()} className={`table-cell ${cell.column.className}`}>
                        {cell.render('Cell')}
                    </div>
                ))}
            </div>
        );
    }, [prepareRow, rows]);

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

                            <Button onClick={handleToggleAllYoung} variant="contained" style={{ marginBottom: '10px', width: '200px' }}>
                                {selectedYoung.length === data.filter(cow => !cow.consolidation).length ? 'Снять выделение' : 'Выбрать всех'}
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

                    </>
                )}
            </div>
        </div>
    );
};

export default YoungTable;
