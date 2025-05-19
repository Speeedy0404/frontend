// components/AnimalTableRow.jsx
import React from "react";
import { TableRow, TableCell, Checkbox, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import { BarChart as BarChartIcon } from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";

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

const AnimalTableRow = ({ row, visibleColumns, onClick, onChartClick, compareList, setCompareList, isGrouped, showGroupHeader }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (e.target.checked) {
      if (compareList.length < 3) {
        setCompareList([...compareList, row]);
      }
    } else {
      setCompareList(compareList.filter(item => item !== row));
    }
  };

  if (isMobile) {
    return (
      <>
        {showGroupHeader && (
          <div style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', padding: '8px' }}>
            {isGrouped === 'kompleks' ? `Комплекс ${row.kompleks}` : `Хозяйство: ${row.farm}`}
          </div>
        )}
        <div onClick={onClick} style={{ border: '1px solid #ccc', margin: '8px 0', borderRadius: '8px', padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Checkbox checked={compareList.includes(row)} onClick={e => e.stopPropagation()} onChange={handleCheckboxChange} />
            <Tooltip title="Посмотреть график">
              <IconButton onClick={(e) => { e.stopPropagation(); onChartClick(row); }}>
                <BarChartIcon />
              </IconButton>
            </Tooltip>
          </div>
          {visibleColumns.map(col => {
            const columnMeta = allColumns.find(c => c.key === col);
            return (
              <div key={col} style={{ marginBottom: '4px' }}>
                <strong>{columnMeta?.label ?? col}:</strong> {row[col] ?? ""}
              </div>
            );
          })}

        </div>
      </>
    );
  }

  return (
    <>
      {showGroupHeader && (
        <TableRow>
          <TableCell colSpan={visibleColumns.length + 2} sx={{ bgcolor: '#f5f5f5', fontWeight: 'bold' }}>
            {isGrouped === 'kompleks' ? `Комплекс ${row.kompleks}` : `Хозяйство: ${row.farm}`}
          </TableCell>
        </TableRow>
      )}

      <TableRow hover onClick={onClick}>
        <TableCell padding="checkbox" onClick={e => e.stopPropagation()}>
          <Checkbox checked={compareList.includes(row)} onChange={handleCheckboxChange} />
        </TableCell>
        {visibleColumns.map(col => (
          <TableCell key={col} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
            {row[col] ?? ""}
          </TableCell>
        ))}
        <TableCell padding="checkbox">
          <Tooltip title="Посмотреть график">
            <IconButton onClick={(e) => { e.stopPropagation(); onChartClick(row); }}>
              <BarChartIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </>
  );
};

export default AnimalTableRow;
