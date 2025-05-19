// AnimalTable.jsx — финальная версия с поддержкой графика
import React, { useState, useMemo } from "react";
import { Paper, ThemeProvider, createTheme, Dialog, Box, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import AnimalTableFilters from "./components/AnimalTableFilters";
import AnimalTablePagination from "./components/AnimalTablePagination";
import AnimalTableColumnsMenu from "./components/AnimalTableColumnsMenu";
import AnimalTableDialog from "./components/AnimalTableDialog";
import AnimalCompareChart from "./components/AnimalCompareChart";
import AnimalTableRow from "./components/AnimalTableRow";
import useDebounce from "./hooks/useDebounce";
import AnimalExportButtons from "./components/AnimalExportButtons";
import { useMediaQuery } from "@mui/material";

import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel, Tooltip
} from "@mui/material";

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

const AnimalTable = ({ data = [], isDarkMode }) => {
  const [searchName, setSearchName] = useState("");
  const [searchNumber, setSearchNumber] = useState("");
  const [kompleksFilter, setKompleksFilter] = useState([]);
  const [farmFilter, setFarmFilter] = useState([]);
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("nomer");
  const [sortOrder, setSortOrder] = useState("asc");
  const [visibleColumns, setVisibleColumns] = useState(["nomer", "klichka", "kompleks", "pi", "rc", "rm", "rf", "rscs", "farm"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [chartAnimal, setChartAnimal] = useState(null);
  const [chartOpen, setChartOpen] = useState(false);

  const debouncedName = useDebounce(searchName, 300);
  const debouncedNumber = useDebounce(searchNumber, 300);

  const filteredData = useMemo(() => {
    return data
      .filter(item =>
        item.klichka?.toLowerCase().includes(debouncedName.toLowerCase()) &&
        item.nomer?.toString().includes(debouncedNumber) &&
        (kompleksFilter.length === 0 || kompleksFilter.includes(String(item.kompleks))) &&
        (farmFilter.length === 0 ||
          (farmFilter.includes("ПОКУПНЫЕ") && !["РСУП БРЕСТСКОЕ ПП", "РУП ВИТЕБСКОЕ ПП", "РСУП ГОМЕЛЬСКОЕ ГПП", "РУСП ГРОДНЕНСКОЕ ПП", "РУСП МИНСКОЕ ПП", "РУСПП МОГИЛЕВСКОЕ ПП"].includes(item.farm)) ||
          farmFilter.includes(item.farm))
      )
      .sort((a, b) => {
        const aVal = a[sortKey] ?? "";
        const bVal = b[sortKey] ?? "";
        return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
      });
  }, [data, debouncedName, debouncedNumber, kompleksFilter, farmFilter, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const theme = useMemo(() => createTheme({ palette: { mode: isDarkMode ? "dark" : "light" } }), [isDarkMode]);

  const chartData = chartAnimal ? [
    { subject: 'PI', value: chartAnimal.pi },
    { subject: 'RM', value: chartAnimal.rm },
    { subject: 'RBVT', value: chartAnimal.rbvt },
    { subject: 'RBVF', value: chartAnimal.rbvf },
    { subject: 'RBVU', value: chartAnimal.rbvu },
    { subject: 'RC', value: chartAnimal.rc },
    { subject: 'RBV CRH', value: chartAnimal.rbv_crh },
    { subject: 'RBV CTFI', value: chartAnimal.rbv_ctfi },
    { subject: 'RBV DO', value: chartAnimal.rbv_do },
    { subject: 'RF', value: chartAnimal.rf },
    { subject: 'RSCS', value: chartAnimal.rscs },
  ] : [];

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ p: 2, m: 2 }}>
        <AnimalTableFilters
          searchName={searchName} setSearchName={setSearchName}
          searchNumber={searchNumber} setSearchNumber={setSearchNumber}
          kompleksFilter={kompleksFilter} setKompleksFilter={setKompleksFilter}
          farmFilter={farmFilter} setFarmFilter={setFarmFilter}
          setAnchorEl={setAnchorEl}
        />

        <AnimalExportButtons
          filteredData={filteredData}
          visibleColumns={visibleColumns}
        />

        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                {visibleColumns.map(colKey => {
                  const col = allColumns.find(c => c.key === colKey);
                  return (
                    <TableCell key={col.key} sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title={col.label} arrow>
                        <TableSortLabel
                          active={sortKey === col.key}
                          direction={sortOrder}
                          onClick={() => {
                            if (sortKey === col.key) {
                              setSortOrder(prev => prev === "asc" ? "desc" : "asc");
                            } else {
                              setSortKey(col.key);
                              setSortOrder("asc");
                            }
                          }}
                        >
                          {col.label}
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  );
                })}
                <TableCell /> {/* для иконки графика */}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((row, idx) => (
                <AnimalTableRow
                  key={row.uniq_key || idx}
                  row={row}
                  visibleColumns={visibleColumns}
                  onClick={() => { setSelectedAnimal(row); setModalOpen(true); }}
                  onChartClick={(animal) => { setChartAnimal(animal); setChartOpen(true); }}
                  compareList={compareList}
                  setCompareList={setCompareList}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>


        <AnimalTablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <AnimalTableColumnsMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />

        <AnimalTableDialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedAnimal={selectedAnimal}
          isDarkMode={isDarkMode}
        />

        <AnimalCompareChart
          compareList={compareList}
          setCompareList={setCompareList}
          isDarkMode={isDarkMode}
        />

        <Dialog open={chartOpen} onClose={() => setChartOpen(false)} maxWidth="md" fullWidth>
          <Box p={2} sx={{ position: 'relative' }}>
            <IconButton onClick={() => setChartOpen(false)} sx={{ position: 'absolute', top: 10, right: 10 }}>
              <CloseIcon />
            </IconButton>
            {chartAnimal && (
              <>
                <h3 style={{ marginTop: 0 }}>{chartAnimal.klichka} — Диаграмма</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={chartData} outerRadius={130}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" stroke={isDarkMode ? "#fff" : "#333"} />
                    <PolarRadiusAxis stroke={isDarkMode ? "#fff" : "#333"} />
                    <Radar
                      name="Показатели"
                      dataKey="value"
                      stroke={isDarkMode ? "#90caf9" : "#1976d2"}
                      fill={isDarkMode ? "#90caf9" : "#1976d2"}
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </>
            )}
          </Box>
        </Dialog>
      </Paper>
    </ThemeProvider>
  );
};

export default AnimalTable;