// components/AnimalCompareChart.jsx
import React from "react";
import { Paper, Box, Button } from "@mui/material";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const AnimalCompareChart = ({ compareList, setCompareList, isDarkMode }) => {
  if (compareList.length < 2) return null;

  const chartData = [
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
  ];

  const colorPalette = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <Paper sx={{ mt: 4, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2} mb={2}>
        <h3>Сравнение: {compareList.map((c) => c.klichka).join(", ")}</h3>
        <Box display="flex" gap={2}>
          {compareList.map((animal, index) => (
            <Box key={animal.uniq_key} display="flex" alignItems="center" gap={1}>
              <Box sx={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: colorPalette[index] }} />
              <span>{animal.klichka}</span>
            </Box>
          ))}
        </Box>
        <Button size="small" variant="outlined" color="error" onClick={() => setCompareList([])}>
          Очистить
        </Button>
      </Box>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius={window.innerWidth < 600 ? 90 : 170}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" stroke={isDarkMode ? "#fff" : "#333"} tick={{ fontSize: window.innerWidth < 600 ? 10 : 12 }} />
            <PolarRadiusAxis stroke={isDarkMode ? "#fff" : "#333"} tick={{ fontSize: window.innerWidth < 600 ? 10 : 12 }} />
            {compareList.map((animal, index) => (
              <Radar
                key={animal.uniq_key}
                name={animal.klichka}
                dataKey={animal.klichka}
                stroke={colorPalette[index]}
                fill={colorPalette[index]}
                fillOpacity={0.4}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default AnimalCompareChart;
