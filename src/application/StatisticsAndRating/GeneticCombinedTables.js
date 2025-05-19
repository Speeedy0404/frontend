import React from 'react';
import { useTheme as useCustomTheme } from '../ThemeContext';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Typography, useMediaQuery, Paper, TableContainer
} from '@mui/material';

const thresholdsWithoutDaug = [
  { percent: 5, rm: 140, rc: 117, rf: 145, rscs: 127, pi: 135 },
  { percent: 10, rm: 132, rc: 112, rf: 130, rscs: 120, pi: 128 },
  { percent: 15, rm: 127, rc: 109, rf: 119, rscs: 117, pi: 124 },
  { percent: 20, rm: 122, rc: 107, rf: 112, rscs: 113, pi: 119 },
  { percent: 25, rm: 119, rc: 105, rf: 108, rscs: 111, pi: 116 },
  { percent: 30, rm: 116, rc: 104, rf: 106, rscs: 108, pi: 114 },
  { percent: 35, rm: 113, rc: 103, rf: 105, rscs: 106, pi: 110 },
  { percent: 40, rm: 110, rc: 101, rf: 103, rscs: 104, pi: 108 },
  { percent: 45, rm: 107, rc: 100, rf: 101, rscs: 102, pi: 105 },
  { percent: 50, rm: 104, rc: 98, rf: 99, rscs: 101, pi: 102 },
];


const thresholdsWithDaug = [
  { percent: 5, rm: 144, rc: 121, rf: 137, rscs: 131, pi: 135 },
  { percent: 10, rm: 135, rc: 115, rf: 119, rscs: 124, pi: 128 },
  { percent: 15, rm: 129, rc: 111, rf: 111, rscs: 120, pi: 124 },
  { percent: 20, rm: 124, rc: 109, rf: 107, rscs: 117, pi: 119 },
  { percent: 25, rm: 121, rc: 106, rf: 103, rscs: 114, pi: 116 },
  { percent: 30, rm: 117, rc: 104, rf: 101, rscs: 111, pi: 114 },
  { percent: 35, rm: 114, rc: 102, rf: 99, rscs: 109, pi: 110 },
  { percent: 40, rm: 111, rc: 100, rf: 97, rscs: 106, pi: 108 },
  { percent: 45, rm: 109, rc: 98, rf: 95, rscs: 104, pi: 105 },
  { percent: 50, rm: 106, rc: 96, rf: 93, rscs: 102, pi: 102 }
];



const tableStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  minWidth: 600,
};

const cellStyle = (isDarkMode) => ({
  borderBottom: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
  padding: '6px 12px',
  fontSize: 13,
  color: isDarkMode ? '#eee' : '#111',
});

const rowStyle = (index, isDarkMode) => ({
  backgroundColor: isDarkMode
    ? index % 2 === 0 ? '#1e1e1e' : '#2a2a2a'
    : index % 2 === 0 ? '#fff' : '#f9f9f9'
});

const GeneticThresholdTable = () => {
  const { isDarkMode } = useCustomTheme();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  return (
    <div style={{ padding: 8, overflowX: 'auto' }}>
      <Typography variant="subtitle1" gutterBottom>
        Все оцененные племенные быки
      </Typography>
      <TableContainer component={Paper} elevation={1} sx={tableStyle}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: isDarkMode ? '#333' : '#f5f5f5' }}>
              {['%', 'RM', 'RC', 'RF', 'RSCS', 'PI'].map((label, idx) => (
                <TableCell key={idx} sx={cellStyle(isDarkMode)}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {thresholdsWithoutDaug.map((row, index) => (
              <TableRow key={row.percent} sx={rowStyle(index, isDarkMode)}>
                <TableCell sx={cellStyle(isDarkMode)}>{row.percent}</TableCell>
                <TableCell sx={cellStyle(isDarkMode)}>{row.rm}</TableCell>
                <TableCell sx={cellStyle(isDarkMode)}>{row.rc}</TableCell>
                <TableCell sx={cellStyle(isDarkMode)}>{row.rf}</TableCell>
                <TableCell sx={cellStyle(isDarkMode)}>{row.rscs}</TableCell>
                <TableCell sx={cellStyle(isDarkMode)}>{row.pi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const GeneticBullTable = () => {
  const { isDarkMode } = useCustomTheme();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  return (
    <div style={{ padding: 8, overflowX: 'auto' }}>
      <Typography variant="subtitle1" gutterBottom>
        Племенные быки, оценённые по качеству потомства
      </Typography>
      <TableContainer component={Paper} elevation={1} sx={tableStyle}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: isDarkMode ? '#333' : '#f5f5f5' }}>
              {['%', 'RM', 'RC', 'RF', 'RSCS', 'PI'].map((label, idx) => (
                <TableCell key={idx} sx={cellStyle(isDarkMode)}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {thresholdsWithDaug.map((row, index) => (
              <TableRow key={`bull-${row.percent}`} sx={rowStyle(index, isDarkMode)}>
                <TableCell sx={cellStyle(isDarkMode)}>{row.percent}</TableCell>
                <TableCell sx={cellStyle(isDarkMode)}>{row.rm}</TableCell>
                <TableCell sx={cellStyle(isDarkMode)}>{row.rc}</TableCell>
                <TableCell sx={cellStyle(isDarkMode)}>{row.rf}</TableCell>
                <TableCell sx={cellStyle(isDarkMode)}>{row.rscs}</TableCell>
                <TableCell sx={cellStyle(isDarkMode)}>{row.pi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const GeneticCombinedTables = () => {
  const { isDarkMode } = useCustomTheme();

  return (
    <div style={{ padding: 8 }}>
      <Typography
        variant="body2"
        gutterBottom
        style={{
          maxWidth: 800,
          padding: '12px 16px',
          borderRadius: 8,
          background: isDarkMode ? '#2a2a2a' : '#f7f7f7',
          color: isDarkMode ? '#eee' : '#333',
          fontSize: 14,
          lineHeight: 1.6,
          boxShadow: isDarkMode ? '0 0 0 1px #444' : '0 0 0 1px #ddd',
        }}
      >
        В таблицах представлены минимальные баллы племенной ценности быков в зависимости от рейтинга (в процентах).
        Например, <strong>5%</strong> лучших животных по комплексному <strong>RM</strong> имеют минимум <strong>140</strong> баллов
        в рейтинге оценённых быков, и <strong>142</strong> баллов в рейтинге быков, оценённых по качеству потомства.
      </Typography>
      <GeneticThresholdTable />
      <GeneticBullTable />
    </div>
  );
};


export default GeneticCombinedTables;