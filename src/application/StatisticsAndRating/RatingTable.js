import React, { useState, useEffect, useMemo } from 'react';
import {
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    Typography,
    Button,
    TablePagination,
    Pagination,
    InputAdornment,
    Tooltip
} from '@mui/material';
import { styled, GlobalStyles } from '@mui/system';
import { Search } from 'lucide-react';
import _ from 'lodash';

const StyledContainer = styled('div')(({ isDarkMode }) => ({
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
});

const StyledPagination = styled(Pagination)(({ isDarkMode }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    '& .MuiPaginationItem-root': {
        color: isDarkMode ? '#fff' : 'inherit',
    },
}));

const StyledTableCell = styled(TableCell)(({ isDarkMode }) => ({
    color: isDarkMode ? '#fff' : '#000',
    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
    fontWeight: 'bold',
}));

const RatingTable = ({ ratingData, isDarkMode }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const headers = ["№", "Название", "rm", "rbvt", "rbvf", "rbvu", "rc", "rf", "pi", "удой 1", "удой 2", "удой 3"];

    const sortedData = useMemo(() => {
        return [...ratingData]
            .filter(item => item[1] !== 0)
            .sort((a, b) => {
                const aVal = a[orderBy];
                const bVal = b[orderBy];
                if (bVal < aVal) return order === 'asc' ? -1 : 1;
                if (bVal > aVal) return order === 'asc' ? 1 : -1;
                return 0;
            });
    }, [ratingData, order, orderBy]);

    const filteredData = useMemo(() => {
        return sortedData.filter(item =>
            item[0].toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [sortedData, searchValue]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const roundToWholeNumber = (value) => {
        return typeof value === 'number' ? Math.round(value) : value;
    };

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <StyledContainer isDarkMode={isDarkMode}>
            <GlobalStyles styles={{
                '.MuiTableSortLabel-root': { color: 'inherit' },
                '.MuiTableSortLabel-root.Mui-active': { color: 'inherit' },
                '.MuiTableSortLabel-root .MuiTableSortLabel-icon': {
                    color: isDarkMode ? '#fff' : '#000' + ' !important',
                },
            }} />

            <StyledSearchContainer>
                <TextField
                    label="Поиск по названию"
                    variant="outlined"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={18} />
                            </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{
                        style: { color: isDarkMode ? '#90caf9' : '#000' },
                    }}
                />
                <Button
                    variant="outlined"
                    onClick={() => setSearchValue('')}
                >
                    Очистить
                </Button>
                <Button variant="contained" onClick={() => setPage(0)}>
                    На первую страницу
                </Button>
            </StyledSearchContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Строк на странице:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
            />

            {ratingData.length === 0 ? (
                <Typography variant="h6" align="center">Нет данных для отображения</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {headers.map((header, index) => (
                                    <StyledTableCell
                                        key={header}
                                        sortDirection={header !== "№" && orderBy === index - 1 ? order : false}
                                        isDarkMode={isDarkMode}
                                    >
                                        <Tooltip title={`Сортировка по ${header}`} arrow>
                                            <TableSortLabel
                                                sx={{
                                                    color: isDarkMode ? '#90caf9' : 'inherit',
                                                    '&.Mui-active': { color: isDarkMode ? '#64b5f6' : 'inherit' },
                                                }}
                                                active={header !== "№" && orderBy === index - 1}
                                                direction={header !== "№" && orderBy === index - 1 ? order : 'asc'}
                                                onClick={header !== "№" ? () => handleRequestSort(index - 1) : undefined}
                                            >
                                                {header}
                                            </TableSortLabel>
                                        </Tooltip>
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                                    <TableRow
                                        key={rowIndex}
                                        hover
                                        sx={{
                                            backgroundColor: rowIndex % 2 === 0
                                                ? (isDarkMode ? '#2a2a2a' : '#fafafa')
                                                : (isDarkMode ? '#1e1e1e' : '#ffffff'),
                                            transition: 'background-color 0.2s ease',
                                        }}
                                    >
                                        <TableCell>{sortedData.indexOf(row) + 1}</TableCell>
                                        {row.map((cell, cellIndex) => (
                                            <TableCell key={cellIndex} align="left">
                                                {roundToWholeNumber(cell)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={headers.length} align="center">
                                        <Typography sx={{ mt: 3, opacity: 0.6, fontStyle: 'italic' }}>
                                            Ничего не найдено по вашему запросу
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <StyledPagination
                count={Math.ceil(filteredData.length / rowsPerPage)}
                page={page + 1}
                onChange={(event, value) => setPage(value - 1)}
                color="primary"
                isDarkMode={isDarkMode}
            />
        </StyledContainer>
    );
};

export default RatingTable;
