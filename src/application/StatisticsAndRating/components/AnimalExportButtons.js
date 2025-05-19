import React from "react";
import { Button, Stack } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
  

const AnimalExportButtons = ({ filteredData, visibleColumns }) => {
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

  return (
    <Stack direction="row" spacing={2} mb={2}>
      <Button size="small" variant="contained" color="success" startIcon={<SaveAlt />} onClick={handleExportCSV}>
        CSV
      </Button>
      <Button size="small" variant="contained" color="success" startIcon={<SaveAlt />} onClick={handleExportXLSX}>
        Excel
      </Button>
    </Stack>
  );
};

export default AnimalExportButtons;
