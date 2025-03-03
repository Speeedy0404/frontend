import React, { useState, useEffect, useMemo } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Typography, Button, TablePagination, Pagination } from '@mui/material';
import { styled } from '@mui/system';
import _ from 'lodash';

const StyledPagination = styled(Pagination)({
    '& .MuiPaginationItem-root': {
        backgroundColor: 'transparent', // прозрачный фон
        color: 'inherit',
    },
});

const StyledTablePagination = styled(TablePagination)({
    '& .MuiTablePagination-toolbar': {
        '& .MuiTablePagination-caption': {
            transform: 'translateY(-4px)', // поднимаем текст на 4 пикселя вверх
        },
    },
});

const RatingTable = ({ ratingData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(0); // Index of the column for sorting
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        setFilteredData(ratingData.filter((item) => item[1] !== 0));
    }, [ratingData]);

    const handleSearch = _.debounce((query) => {
        const lowerQuery = query.toLowerCase();
        setSearchQuery(lowerQuery);
        setFilteredData(
            ratingData
                .filter((item) => item[1] !== 0)
                .filter((item) => item[0].toLowerCase().includes(lowerQuery))
        );
        setPage(0)
    }, 300);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const roundToWholeNumber = (value) => {
        if (typeof value === 'number') {
            return Math.round(value);
        }
        return value;
    };

    const sortedData = useMemo(() => {
        return filteredData.sort((a, b) => {
            if (b[orderBy] < a[orderBy]) {
                return order === 'asc' ? -1 : 1;
            }
            if (b[orderBy] > a[orderBy]) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, order, orderBy]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleGoToFirstPage = () => {
        setPage(0);
    };

    return (
        <div>
            <TextField
                label="Поиск по названию"
                variant="outlined"
                onChange={(event) => handleSearch(event.target.value)}
                style={{ marginBottom: '20px' }}
            />
            <Button variant="contained" onClick={handleGoToFirstPage} style={{ marginBottom: '20px', marginLeft: '10px', marginTop: '8px' }}>
                Вернуться на первую страницу
            </Button>
            <StyledTablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={sortedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Строк на странице:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
            />
            {ratingData.length === 0 ? (
                <div style={{ textAlign: 'center' }}>
                    <Typography variant="h6">Нет данных для отображения</Typography>
                </div>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['Название', 'rm', 'rbvt', 'rbvf', 'rbvu', 'rc', 'rf', 'pi', 'удой 1', 'удой 2', 'удой 3'].map((header, index) => (
                                    <TableCell
                                        key={header}
                                        sortDirection={orderBy === index ? order : false}
                                    >
                                        <TableSortLabel
                                            active={orderBy === index}
                                            direction={orderBy === index ? order : 'asc'}
                                            onClick={() => handleRequestSort(index)}
                                        >
                                            {header}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow key={index}>
                                    {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex}>{roundToWholeNumber(cell)}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <StyledPagination
                count={Math.ceil(filteredData.length / rowsPerPage)}
                page={page + 1}
                onChange={(event, value) => setPage(value - 1)}
                color="primary"
                style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
            />
        </div>
    );
};

export default RatingTable;
