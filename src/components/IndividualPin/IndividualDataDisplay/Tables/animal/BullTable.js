import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTable, useSortBy } from 'react-table';
import { VariableSizeList as List } from 'react-window';
import { Modal, Box, IconButton, Checkbox, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Animal from '../../../../Animal/Animal';
import './BullTable.css';

const apiUrl = process.env.REACT_APP_API_URL
const BullTable = ({ key, gpp, dataBull, additionalParam, onSelectedChange }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(null)
    const [avg, setAvg] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndivNumber, setSelectedIndivNumber] = useState(null);
    const [selectedBulls, setSelectedBulls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getValue_OrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(0) : '');

    useEffect(() => {
        fetchData();
    }, [dataBull, key, gpp, additionalParam]);

    const fetchData = async () => {
        setIsLoading(true);
        setSelectedBulls([]);
        onSelectedChange([])
        const gppListParam = encodeURIComponent(gpp.join(','));
        const requestBody = { ...dataBull, ...additionalParam };
        try {
            const response = await fetch(`${apiUrl}/api/v1/api/v1/pkbull-individual/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                    'Kodrn': gppListParam,
                },
                body: JSON.stringify(requestBody),
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

    const handleRowContextMenu = (event, uniq_key) => {
        event.preventDefault();
        setSelectedIndivNumber(uniq_key);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedIndivNumber(null);
    };

    const handleSelectBull = (uniq_key) => {
        setSelectedBulls((prevSelected) => {
            let newSelected;
            if (prevSelected.includes(uniq_key)) {
                newSelected = prevSelected.filter(id => id !== uniq_key);
            } else {
                newSelected = [...prevSelected, uniq_key];
            }

            if (newSelected.length > 5) {
                alert('Вы не можете выбрать больше 5 быков.');
                return prevSelected;
            }

            onSelectedChange(newSelected);
            return newSelected;
        });
    };

    const columns = useMemo(() => [
        {
            Header: '',
            id: 'select',
            Cell: ({ row }) => (
                <Checkbox
                    checked={selectedBulls.includes(row.original.uniq_key)}
                    onChange={() => handleSelectBull(row.original.uniq_key)}
                    className="first-column" // Примените класс для чекбокса
                />
            ),
            className: 'first-column' // Примените класс для заголовка
        },
        { Header: 'Раб №', accessor: 'nomer', className: 'nomer' },
        { Header: 'Номер', accessor: 'uniq_key', className: 'indiv-number' },
        { Header: 'Д.р.', accessor: 'datarojd' , className: 'datarojd' },
        { Header: 'Компл.', accessor: 'kompleks', className: 'kompleks-bull' },
        { Header: 'Семя', accessor: 'sperma', className: 'sperma'  },
        { Header: `RM (${avg.milk ? getValue_OrDefault(avg.milk.avg_rm) : '-'})`, accessor: d => d.milkproductionindexbull ? getValue_OrDefault(d.milkproductionindexbull.rm) : '', id: 'rm', className: 'RM' },
        { Header: `RBVT (${avg.conf ? getValue_OrDefault(avg.conf.avg_rbvt) : '-'})`, accessor: d => d.conformationindexbull ? getValue_OrDefault(d.conformationindexbull.rbvt) : '', id: 'rbvt', className: 'RBVT'  },
        { Header: `RBVF (${avg.conf ? getValue_OrDefault(avg.conf.avg_rbvf) : '-'})`, accessor: d => d.conformationindexbull ? getValue_OrDefault(d.conformationindexbull.rbvf) : '', id: 'rbvf', className: 'RBVF'  },
        { Header: `RBVU (${avg.conf ? getValue_OrDefault(avg.conf.avg_rbvu) : '-'})`, accessor: d => d.conformationindexbull ? getValue_OrDefault(d.conformationindexbull.rbvu) : '', id: 'rbvu' , className: 'RBVU'  },
        { Header: `RC (${avg.conf ? getValue_OrDefault(avg.conf.avg_rc) : '-'})`, accessor: d => d.conformationindexbull ? getValue_OrDefault(d.conformationindexbull.rc) : '', id: 'rc', className: 'RC'  },
        { Header: `RF (${avg.reprod ? getValue_OrDefault(avg.reprod.avg_rf) : '-'})`, accessor: d => d.reproductionindexbull ? getValue_OrDefault(d.reproductionindexbull.rf) : '', id: 'rf' , className: 'RF' },
        { Header: `PI (${avg.com ? getValue_OrDefault(avg.com.avg_pi) : '-'})`, accessor: d => d.complexindexbull ? getValue_OrDefault(d.complexindexbull.pi) : '', id: 'pi', className: 'PI'  },
    ], [selectedBulls, avg]);

    const { getTableBodyProps, getTableProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data },
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
    }, [data]);

    const Row = useCallback(({ index, style }) => {
        const row = rows[index];
        prepareRow(row);
        return (
            <div {...row.getRowProps({ style })} className="table-row" onContextMenu={(event) => handleRowContextMenu(event, row.original.uniq_key)}>
                {row.cells.map(cell => (
                    <div {...cell.getCellProps()} className={`table-cell ${cell.column.className}`}>
                        {cell.render('Cell')}
                    </div>
                ))}
            </div>
        );
    }, [prepareRow, rows]);

    return (
        <div style={{ height: '845px' }} className="table-container">
            <div className="table-wrapper">
                {isLoading ? (
                    <div className="loading-container">
                        <CircularProgress />
                        <p>Загрузка данных...</p>
                    </div>
                ) : (
                    <>
                        <Typography variant="h6" style={{ margin: '20px 0' }}>
                            Всего быков: {count}
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
                                    height={670}
                                    itemCount={rows.length}
                                    itemSize={() => 50}
                                    width={"100%"}
                                >
                                    {Row}
                                </List>
                            </div>
                        </div>
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
                                <Animal indivNumber={selectedIndivNumber} />
                            </Box>
                        </Modal>
                    </>
                )}


            </div>
        </div>
    );
};

export default BullTable;




