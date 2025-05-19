// components/AnimalTableColumnsMenu.jsx
import React from "react";
import { Menu, MenuItem, FormControlLabel, Checkbox } from "@mui/material";

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

const AnimalTableColumnsMenu = ({ anchorEl, setAnchorEl, visibleColumns, setVisibleColumns }) => {
  const handleToggleColumn = (key) => {
    setVisibleColumns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <Menu open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
      {allColumns.map(col => (
        <MenuItem key={col.key}>
          <FormControlLabel
            control={
              <Checkbox
                checked={visibleColumns.includes(col.key)}
                onChange={() => handleToggleColumn(col.key)}
              />
            }
            label={col.label}
          />
        </MenuItem>
      ))}
    </Menu>
  );
};

export default AnimalTableColumnsMenu;
