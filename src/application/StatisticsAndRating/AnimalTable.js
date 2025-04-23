import React, { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, TableSortLabel, Pagination, Stack, createTheme,
  ThemeProvider, FormGroup, FormControlLabel, Checkbox, Button,
  Menu, MenuItem, Box, IconButton, Select, Tooltip, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { SaveAlt, ViewColumn, Close as CloseIcon } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AnimalDetails from "../Animals/AnimalDetails";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const allColumns = [
  { label: "Раб.Номер", key: "nomer" },
  { label: "Кличка", key: "klichka" },
  { label: "Номер", key: "uniq_key" },
  { label: "Комплекс", key: "kompleks" },
  { label: "Г.р", key: "datarojd" },
  { label: "PI", key: "pi" },
  { label: "EBV MILK", key: "ebv_milk" },
  { label: "EBV FKG", key: "ebv_fkg" },
  { label: "EBV FPRC", key: "ebv_fprc" },
  { label: "EBV PKG", key: "ebv_pkg" },
  { label: "EBV PPRC", key: "ebv_pprc" },
  { label: "RBV MILK", key: "rbv_milk" },
  { label: "RBV FKG", key: "rbv_fkg" },
  { label: "RBV PKG", key: "rbv_pkg" },
  { label: "RM", key: "rm" },
  { label: "RBVT", key: "rbvt" },
  { label: "RBVF", key: "rbvf" },
  { label: "RBVU", key: "rbvu" },
  { label: "RC", key: "rc" },
  { label: "RBV CRH", key: "rbv_crh" },
  { label: "RBV CTFI", key: "rbv_ctfi" },
  { label: "RBV DO", key: "rbv_do" },
  { label: "RF", key: "rf" },
  { label: "RSCS", key: "rscs" },
  { label: "Мать", key: "mother" },
  { label: "Отец", key: "father" },
  { label: "Хозяйство", key: "farm" },
];

const knownFarms = [
  'РСУП БРЕСТСКОЕ ПП',
  'РУП ВИТЕБСКОЕ ПП',
  'РСУП ГОМЕЛЬСКОЕ ГПП',
  'РУСП ГРОДНЕНСКОЕ ПП',
  'РУСП МИНСКОЕ ПП',
  'РУСПП МОГИЛЕВСКОЕ ПП',
];

const AnimalTable = ({ data = [], isDarkMode }) => {
  const [searchName, setSearchName] = useState("");
  const [searchNumber, setSearchNumber] = useState("");
  const [kompleksFilter, setKompleksFilter] = useState([]);
  const [farmFilter, setFarmFilter] = useState([]);
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("nomer");
  const [sortOrder, setSortOrder] = useState("asc");
  const [visibleColumns, setVisibleColumns] = useState(allColumns.map(col => col.key));
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [compareList, setCompareList] = useState([]);

  const filteredData = useMemo(() => {
    return data
      .filter(item =>
        item.klichka?.toLowerCase().includes(searchName.toLowerCase()) &&
        item.nomer?.toString().includes(searchNumber) &&
        (kompleksFilter.length === 0 || kompleksFilter.includes(String(item.kompleks))) &&
        (farmFilter.length === 0 ||
          (farmFilter.includes("ПОКУПНЫЕ") && !knownFarms.includes(item.farm)) ||
          farmFilter.includes(item.farm))
      )
      .sort((a, b) => {
        const aVal = a[sortKey] ?? "";
        const bVal = b[sortKey] ?? "";
        return sortOrder === "asc" ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
      });
  }, [data, searchName, searchNumber, kompleksFilter, farmFilter, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const columnsToRender = allColumns.filter(col => visibleColumns.includes(col.key));

  const handleRowClick = (animal) => {
    setSelectedAnimal(animal);
    setModalOpen(true);
  };

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleToggleColumn = (key) => {
    setVisibleColumns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleExportCSV = () => {
    const rows = filteredData.map(row =>
      Object.fromEntries(allColumns
        .filter(col => visibleColumns.includes(col.key))
        .map(col => [col.label, row[col.key] ?? ""])
      )
    );
    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map(r => Object.values(r).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "export.csv");
  };

  const handleExportXLSX = () => {
    const rows = filteredData.map(row =>
      Object.fromEntries(allColumns
        .filter(col => visibleColumns.includes(col.key))
        .map(col => [col.label, row[col.key] ?? ""])
      )
    );
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Export");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "export.xlsx");
  };

  const theme = useMemo(() => createTheme({ palette: { mode: isDarkMode ? "dark" : "light" } }), [isDarkMode]);

  const chartData = selectedAnimal ? [
    { subject: 'PI', value: selectedAnimal.pi },
    { subject: 'RM', value: selectedAnimal.rm },
    { subject: 'RBVT', value: selectedAnimal.rbvt },
    { subject: 'RBVF', value: selectedAnimal.rbvf },
    { subject: 'RBVU', value: selectedAnimal.rbvu },
    { subject: 'RC', value: selectedAnimal.rc },
    { subject: 'RBV CRH', value: selectedAnimal.rbv_crh },
    { subject: 'RBV CTFI', value: selectedAnimal.rbv_ctfi },
    { subject: 'RBV DO', value: selectedAnimal.rbv_do },
    { subject: 'RF', value: selectedAnimal.rf },
    { subject: 'RSCS', value: selectedAnimal.rscs },
  ] : [];

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ p: 2, m: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} flexWrap="wrap">
          <TextField size="small" label="Кличка" value={searchName} onChange={e => setSearchName(e.target.value)} />
          <TextField size="small" label="Номер" value={searchNumber} onChange={e => setSearchNumber(e.target.value)} />
          <Select multiple size="small" value={kompleksFilter} onChange={e => setKompleksFilter(e.target.value)} displayEmpty sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {[0, 1, 2, 3, 4, 5, 6].map(k => (
              <MenuItem key={k} value={String(k)}>{`Комплекс ${k}`}</MenuItem>
            ))}
          </Select>
          <Select multiple size="small" value={farmFilter} onChange={e => setFarmFilter(e.target.value)} displayEmpty sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {knownFarms.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            <MenuItem value="ПОКУПНЫЕ">ПОКУПНЫЕ</MenuItem>
          </Select>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button size="small" variant="outlined" sx={{ minWidth: 90 }} onClick={() => {
              setSearchName(""); setSearchNumber(""); setKompleksFilter([]); setFarmFilter([]);
            }}>Сбросить</Button>
            <Button size="small" variant="outlined" startIcon={<ViewColumn />} sx={{ minWidth: 90 }} onClick={e => setAnchorEl(e.currentTarget)}>Колонки</Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} mb={2}>
          <Button size="small" variant="contained" color="success" startIcon={<SaveAlt />} onClick={handleExportCSV}>CSV</Button>
          <Button size="small" variant="contained" color="success" startIcon={<SaveAlt />} onClick={handleExportXLSX}>Excel</Button>
          <Select size="small" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
            {[10, 15, 25, 50, 100].map(size => <MenuItem key={size} value={size}>{size} строк</MenuItem>)}
          </Select>
        </Stack>

        <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                {columnsToRender.map(col => (
                  <TableCell key={col.key} sx={{ whiteSpace: 'nowrap' }}>
                    <TableSortLabel active={sortKey === col.key} direction={sortOrder} onClick={() => handleSort(col.key)}>
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, idx) => (
                <TableRow key={row.id || idx} hover onClick={() => handleRowClick(row)}>
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={compareList.includes(row)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (compareList.length < 3)
                            setCompareList((prev) => [...prev, row]);
                        } else {
                          setCompareList((prev) =>
                            prev.filter((item) => item !== row)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  {columnsToRender.map(col => (
                    <TableCell key={col.key} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{row[col.key] ?? ""}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" justifyContent="space-between" mt={2}>
          <span>Страница {currentPage} из {totalPages}</span>
          <Pagination count={totalPages} page={currentPage} onChange={(_, page) => setCurrentPage(page)} />
        </Stack>

        <Menu open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
          {allColumns.map(col => (
            <MenuItem key={col.key}>
              <FormControlLabel
                control={<Checkbox checked={visibleColumns.includes(col.key)} onChange={() => handleToggleColumn(col.key)} />}
                label={col.label}
              />
            </MenuItem>
          ))}
        </Menu>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullScreen sx={{ p: 2, '& .MuiDialog-paper': { m: { xs: 1, sm: 2 }, width: '100%', maxWidth: 'md', borderRadius: 2, p: { xs: 1, sm: 3 }, bgcolor: isDarkMode ? '#424242' : '#fff', overflowY: 'auto' } }}>
          <Box className={isDarkMode ? 'dark-mode' : ''} sx={{ position: 'relative' }}>
            <IconButton onClick={() => setModalOpen(false)} sx={{ position: 'absolute', top: 10, right: 10, color: isDarkMode ? '#fff' : 'inherit' }}>
              <CloseIcon />
            </IconButton>
            {selectedAnimal && <AnimalDetails animalType="bull" animaluniq_key={selectedAnimal.uniq_key} pin={true} chartData={chartData} />}

          </Box>
        </Dialog>

        {compareList.length >= 2 && (
          <Paper sx={{ mt: 4, p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              flexWrap="wrap"
              gap={2}
              mb={2}
            >

              <h3>
                Сравнение: {compareList.map((c) => c.klichka).join(", ")}
              </h3>
              <Box display="flex" gap={2} mb={2}>
                {compareList.map((animal, index) => {
                  const colorPalette = ["#8884d8", "#82ca9d", "#ffc658"];
                  return (
                    <Box key={animal.uniq_key} display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          backgroundColor: colorPalette[index],
                        }}
                      />
                      <span>{animal.klichka}</span>
                    </Box>
                  );
                })}
              </Box>

              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => setCompareList([])}
              >
                Очистить
              </Button>
            </Box>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart  data={[
                  { subject: "PI", ...Object.fromEntries(compareList.map(a => [a.klichka, a.pi])) },
                  { subject: "RM", ...Object.fromEntries(compareList.map(a => [a.klichka, a.rm])) },
                  { subject: "RBVT", ...Object.fromEntries(compareList.map(a => [a.klichka, a.rbvt])) },
                  { subject: "RBVF", ...Object.fromEntries(compareList.map(a => [a.klichka, a.rbvf])) },
                  { subject: "RBVU", ...Object.fromEntries(compareList.map(a => [a.klichka, a.rbvu])) },
                  { subject: "RBV CTFI", ...Object.fromEntries(compareList.map(a => [a.klichka, a.rbv_ctfi])) },
                  { subject: "RBV DO", ...Object.fromEntries(compareList.map(a => [a.klichka, a.rbv_do])) },
                  { subject: "RBV CRH", ...Object.fromEntries(compareList.map(a => [a.klichka, a.rbv_crh])) },
                  { subject: "RC", ...Object.fromEntries(compareList.map(a => [a.klichka, a.rc])) },
                  { subject: "RF", ...Object.fromEntries(compareList.map(a => [a.klichka, a.rf])) },
                  { subject: "RSCS", ...Object.fromEntries(compareList.map(a => [a.klichka, a.rscs])) },
                ]}  outerRadius={window.innerWidth < 600 ? 90 : 170} >
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="subject"
                    stroke={isDarkMode ? "#fff" : "#333"}
                    tick={{ fontSize: window.innerWidth < 600 ? 10 : 12 }}
                  />
                  <PolarRadiusAxis
                    stroke={isDarkMode ? "#fff" : "#333"}
                    tick={{ fontSize: window.innerWidth < 600 ? 10 : 12 }}
                  />
                  {compareList.map((animal, index) => {
                    const colorPalette = ["#8884d8", "#82ca9d", "#ffc658"];
                    return (
                      <Radar
                        key={animal.uniq_key}
                        name={animal.klichka}
                        dataKey={animal.klichka}
                        stroke={colorPalette[index]}
                        fill={colorPalette[index]}
                        fillOpacity={0.4}
                      />
                    );
                  })}
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        )}

      </Paper>
    </ThemeProvider>
  );
};

export default AnimalTable;
