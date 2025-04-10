import React, { useState, useEffect, useMemo } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Typography, Button, TablePagination, Pagination } from '@mui/material';
import { styled } from '@mui/system';
import { GlobalStyles } from '@mui/system';
import _ from 'lodash';

const globalStyles = (
    <GlobalStyles
        styles={{
            '.MuiTableSortLabel-root': {
                color: 'inherit',
            },
            '.MuiTableSortLabel-root.Mui-active': {
                color: 'inherit',
            },
            '.MuiTableSortLabel-root .MuiTableSortLabel-icon': {
                color: '#fff !important',
            },
        }}
    />
);

const globalStyle = (
    <GlobalStyles
        styles={{
            '.MuiTableSortLabel-root': {
                color: 'inherit',
            },
            '.MuiTableSortLabel-root.Mui-active': {
                color: 'inherit',
            },
            '.MuiTableSortLabel-root .MuiTableSortLabel-icon': {
                color: '#000 !important',
            },
        }}
    />
);

const StyledContainer = styled('div')(({ theme, isDarkMode }) => ({
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
    color: isDarkMode ? '#e0e0e0' : '#000000',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

const StyledSearchContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
});

const StyledPagination = styled(Pagination)(({ isDarkMode }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    '& .MuiPaginationItem-root': {
        color: isDarkMode ? '#fff' : 'inherit', // Белые стрелки в темной теме
    },
   
    '& .MuiPaginationItem-ellipsis, & .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast': {
        color: isDarkMode ? '#fff' : 'inherit', // Белые стрелки в темной теме
    },
}));

const StyledTableCell = styled(TableCell)(({ isDarkMode }) => ({
    color: isDarkMode ? '#fff' : '#000', // Белый текст в заголовках
    backgroundColor: isDarkMode ? '#fff' : 'inherit', // Контрастный фон
}));

const RatingTable = ({ ratingData, isDarkMode }) => {

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        setFilteredData(ratingData.filter((item) => item[1] !== 0));
    }, [ratingData]);

    const handleSearch = _.debounce((query) => {
        setFilteredData(
            ratingData.filter(
                (item) => item[1] !== 0 && item[0].toLowerCase().includes(query.toLowerCase())
            )
        );
        setPage(0);
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

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <StyledContainer isDarkMode={isDarkMode}>
            {isDarkMode ? globalStyles : globalStyle}
            <StyledSearchContainer>
                <TextField
                    label="Поиск по названию"
                    variant="outlined"
                    onChange={(event) => handleSearch(event.target.value)}
                    InputLabelProps={{
                        style: { color: isDarkMode ? '#90caf9' : '#000' },
                    }}
                    fullWidth
                />
                <Button variant="contained" onClick={() => setPage(0)}>
                    На первую страницу
                </Button>
            </StyledSearchContainer>

            <TablePagination
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

            {ratingData.length === 0 === 0 ? (
                <Typography variant="h6" align="center">Нет данных для отображения</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['Название', 'rm', 'rbvt', 'rbvf', 'rbvu', 'rc', 'rf', 'pi', 'удой 1', 'удой 2', 'удой 3'].map((header, index) => (
                                    <StyledTableCell
                                        key={header}
                                        sortDirection={orderBy === index ? order : false}
                                    >
                                        <TableSortLabel
                                            sx={{
                                                color: isDarkMode ? '#90caf9' : 'inherit',
                                                '&.Mui-active': { color: isDarkMode ? '#64b5f6' : 'inherit' },
                                            }}
                                            active={orderBy === index}
                                            direction={orderBy === index ? order : 'asc'}
                                            onClick={() => handleRequestSort(index)}
                                        >
                                            {header}
                                        </TableSortLabel>
                                    </StyledTableCell>
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
            />
        </StyledContainer>
    );
};

export default RatingTable;