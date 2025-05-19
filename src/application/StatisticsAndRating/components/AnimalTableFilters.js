// components/AnimalTableFilters.jsx
import React from "react";
import { TextField, Select, MenuItem, Stack, Button } from "@mui/material";
import ViewColumn from "@mui/icons-material/ViewColumn";

const knownFarms = [
  'РСУП БРЕСТСКОЕ ПП',
  'РУП ВИТЕБСКОЕ ПП',
  'РСУП ГОМЕЛЬСКОЕ ГПП',
  'РУСП ГРОДНЕНСКОЕ ПП',
  'РУСП МИНСКОЕ ПП',
  'РУСПП МОГИЛЕВСКОЕ ПП',
];

const AnimalTableFilters = ({
  searchName,
  setSearchName,
  searchNumber,
  setSearchNumber,
  kompleksFilter,
  setKompleksFilter,
  farmFilter,
  setFarmFilter,
  setAnchorEl
}) => {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} flexWrap="wrap">
      <TextField size="small" label="Кличка" value={searchName} onChange={e => setSearchName(e.target.value)} />
      <TextField size="small" label="Номер" value={searchNumber} onChange={e => setSearchNumber(e.target.value)} />
      <Select multiple size="small" value={kompleksFilter} onChange={e => setKompleksFilter(e.target.value)} displayEmpty sx={{ maxWidth: 200 }}>
        {[0, 1, 2, 3, 4, 5, 6].map(k => (
          <MenuItem key={k} value={String(k)}>{`Комплекс ${k}`}</MenuItem>
        ))}
      </Select>
      <Select multiple size="small" value={farmFilter} onChange={e => setFarmFilter(e.target.value)} displayEmpty sx={{ maxWidth: 220 }}>
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
  );
};

export default AnimalTableFilters;
