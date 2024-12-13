import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Resizable } from "react-resizable";
import 'react-resizable/css/styles.css';
import './Table.css';
const apiUrl = process.env.REACT_APP_API_URL
const ResizableCowTable = ({ kodrn, selectedComplex }) => {
    const [data, setData] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(`${apiUrl}/api/v1/pkcow/`);
    const [hasMore, setHasMore] = useState(true);
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(false); // Состояние для отслеживания загрузки

    const [isUrlUpdated, setIsUrlUpdated] = useState(false); // Состояние для отслеживания обновления URL

    const getValueOrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(2) : '');
    const getValue_OrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(0) : '');

    const fetchData = async (url) => {
        if (url) {
            setLoading(true); // Устанавливаем состояние загрузки в true перед началом загрузки данных
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                        'Kodrn': kodrn,
                        'selectedComplex': selectedComplex,
                    }
                });

                if (response.ok) {
                    const newData = await response.json();
                    if (newData.results && newData.results.length > 0) {
                        setData(prevData => [...prevData, ...newData.results]);
                    }
                    setNextPageUrl(newData.next);
                    if (!newData.next) setHasMore(false);
                } else {
                    console.error("Ошибка загрузки данных:", response.statusText);
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
                setHasMore(false);
            } finally {
                setLoading(false); // Сбрасываем состояние загрузки после завершения запроса
            }
        } else {
            setHasMore(false);
        }
    };

    useEffect(() => {
        setData([]);
        setNextPageUrl(`${apiUrl}/api/v1/pkcow/`);
        setHasMore(true);
        setIsUrlUpdated(true); // Устанавливаем флаг обновления URL
    }, [selectedComplex]);

    useEffect(() => {
        if (isUrlUpdated) {
            fetchData(nextPageUrl);
            setIsUrlUpdated(false); // Сброс флага после выполнения
        }
    }, [isUrlUpdated]);

    const handleLoadMore = async () => {
        if (nextPageUrl && hasMore) {
            fetchData(nextPageUrl);
        }
    };

    // Минимальные ширины столбцов
    const minColumnWidths = {
        nomer: 10,
        uniq_key: 10,
        datarojd: 10,
        lin_name: 10,
        kompleks: 10,
        ebv_milk: 10,
        rel_milk: 10,
        ebv_fprc: 10,
        rel_fprc: 10,
        ebv_pprc: 10,
        rel_pprc: 10,
        rm: 10,
        rc: 10,
        rf: 10,
        rscs: 10,
        pi: 10,
    };

    const columns = useMemo(() => [
        { Header: 'Рабоч номер', accessor: 'nomer', id: 'nomer' },
        { Header: 'Индив номер', accessor: 'uniq_key', id: 'uniq_key' },
        { Header: 'Дата рожд', accessor: 'datarojd', id: 'datarojd' },
        { Header: 'Линия', accessor: d => d.father_info.lin_name || '', id: 'lin_name' },
        { Header: 'К.О', accessor: d => d.father_info.kompleks || '', id: 'kompleks' },
        { Header: 'Удой', accessor: d => d.milkproductionindex ? getValueOrDefault(d.milkproductionindex.ebv_milk) : '', id: 'ebv_milk' },
        { Header: 'rel у', accessor: d => d.milkproductionindex ? getValue_OrDefault(d.milkproductionindex.rel_milk) : '', id: 'rel_milk' },
        { Header: 'Жир %', accessor: d => d.milkproductionindex ? getValueOrDefault(d.milkproductionindex.ebv_fprc) : '', id: 'ebv_fprc' },
        { Header: 'rel ж', accessor: d => d.milkproductionindex ? getValue_OrDefault(d.milkproductionindex.rel_fprc) : '', id: 'rel_fprc' },
        { Header: 'Белок %', accessor: d => d.milkproductionindex ? getValueOrDefault(d.milkproductionindex.ebv_pprc) : '', id: 'ebv_pprc' },
        { Header: 'rel б', accessor: d => d.milkproductionindex ? getValue_OrDefault(d.milkproductionindex.rel_pprc) : '', id: 'rel_pprc' },
        { Header: 'rm', accessor: d => d.milkproductionindex ? getValue_OrDefault(d.milkproductionindex.rm) : '', id: 'rm' },
        { Header: 'rc', accessor: d => d.conformationindex ? getValue_OrDefault(d.conformationindex.rc) : '', id: 'rc' },
        { Header: 'rf', accessor: d => d.reproductionindex ? getValue_OrDefault(d.reproductionindex.rf) : '', id: 'rf' },
        { Header: 'rscs', accessor: d => d.somaticcellindex ? getValue_OrDefault(d.somaticcellindex.rscs) : '', id: 'rscs' },
        { Header: 'pi', accessor: d => d.complexindex ? getValue_OrDefault(d.complexindex.pi) : '', id: 'pi' },
    ], []);

    const [columnWidths, setColumnWidths] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.id] = minColumnWidths[column.id] || 80; // Используем минимальную ширину или 80 как значение по умолчанию
            return acc;
        }, {})
    );

    const handleResize = (columnId) => (event, { size }) => {
        setColumnWidths((old) => ({
            ...old,
            [columnId]: Math.max(size.width, minColumnWidths[columnId] || 10), // Устанавливаем минимальную ширину
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
                            <tr {...row.getRowProps()}>
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
            {loading && <h4><div style={{ textAlign: 'center'}} className="loading-text">Загрузка данных</div></h4>}
            {/* Кнопка "Показать еще" */}
            {hasMore && !loading && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button onClick={handleLoadMore}>Показать еще</button>
                </div>
            )}
        </div>
    );
};

export default ResizableCowTable;
