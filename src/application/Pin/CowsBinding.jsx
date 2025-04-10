import React, { useState, useEffect } from 'react';
import { Button, Checkbox, FormControlLabel, FormControl, InputLabel, CircularProgress, Select, MenuItem, Grid, TextField, Paper, Typography } from '@mui/material';
import { useTheme } from '../ThemeContext'; // Используем твой контекст
import PaginatedSortableTable from './PaginatedSortableTable';
import './CowsBinding.css'; // Тут можно добавить доп. кастомизацию
const apiUrl = process.env.REACT_APP_API_URL;

const CowsBinding = ({ select, farmCode, functionChoices, functionCow, key, first }) => {
  const { isDarkMode } = useTheme();

  const parameters = ["EBVUdoi", "EBVZhirKg", "EBVZhirPprc", "EBVBelokKg", "EBVBelokPprc", "RBVT", "RBVF", "RBVU", "RC", "RF", "Rscs", "RBVZhirKg", "RBVBelokKg", "RM", "PI"];

  const [filterValues, setFilterValues] = useState(() => {
    if (first) {
      const savedfilterValues = localStorage.getItem("filterValues");
      return savedfilterValues ? JSON.parse(savedfilterValues) : parameters.reduce((acc, param) => ({ ...acc, [param]: { min: "", max: "" } }), {});
    }
    return parameters.reduce((acc, param) => ({ ...acc, [param]: { min: "", max: "" } }), {});
  });

  const [selectedComplexes, setSelectedComplexes] = useState(() => {
    if (first) {
      const savedComplexes = localStorage.getItem("selectedComplexes");
      return savedComplexes ? JSON.parse(savedComplexes) : [];
    }
    return [];
  });

  const [selectedLine, setSelectedLine] = useState(() => {
    if (first) {
      const savedLine = localStorage.getItem("selectedLine");
      return savedLine ? JSON.parse(savedLine) : "";
    }
    return "";
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const lineOptions = [
    'АННАС АДЕМА 30587', 'ФРИЗО ВОУТЕРА 44116', 'ВИС АЙДИАЛА 933122', 'РЕФЛЕКШН СОВЕРИНГА 198998',
    'ПОНИ ФАРМ АРЛИНДА ЧИФА 1427381', 'МОНТВИК ЧИФТЕЙНА 95679', 'ЛИНИИ ДАТСКОЙ ПОРОДЫ', 'ЛИНИИ БРИТАНОФРИЗСКОЙ ПОРОДЫ',
    'ЛИНИИ ШВЕДСКОЙ ПОРОДЫ', 'ЛИНИИ СИММЕНТАЛЬСКОЙ ПОРОДЫ', 'ЛИНИИ ДЖЕРСЕЙСКОЙ ПОРОДЫ', 'ЛИНИИ ЛИМУЗИНСКОЙ ПОРОДЫ', 'ЛИНИИ ПОРОДЫ ШАРОЛЕ',
    'ЛИНИИ ГЕРЕФОРДСКОЙ ПОРОДЫ', 'ЛИНИИ АБЕРДИН-АНГУССКОЙ ПОРОДЫ', 'ЛИНИИ СВЕТЛО-АКВИТАНСКОЙ', 'ЛИНИИ ПОРОДЫ МЕН-АНЖУ', 'ЛИНИИ ПОРОДЫ БЕЛЬГИЙСКАЯ ГОЛУБАЯ',
    'ЛИНИИ ПОРОДЫ ВАГЮ', 'БЕЗ ЛИНИИ', 'ВИСТУРТА АННАС АДЕМА 36079', 'БЛИТСАЕРД ЕТ АДЕМА 44850,63349', 'ХАУБОЙС АННАС АДЕМА 44162', 'АННАС АДЕМА 2,33209', 'ВИСТОРЕЛА 35949',
    'ХАУБОЙС АДЕМА 40849', 'ФРИЗО ГРЕГОРА 43215', 'ДИАМАНТА 33251', 'БЕРНАРДА 29100', 'ХИЛЬТЬЕС АДЕМА 37910', 'АДЕМА 441', 'АДЕМА 443', 'РЕЙНТЬЕС ХИЛЬТЬЕС АДЕМА 45379', 'НЕТТЕ 82',
    'РУТЬЕС ЭДУАРДА 31646', 'БАНГА РЕЙНДЕРА 47221', 'АЛЕКСА 66644', 'НИКО 31652,31831', 'СТЕФФЕНА 40126', 'АДЕМА 25437', 'БЕРТУСА 77804', 'КОЛДХОСТЕР ЯНКЕ КАТС 2233/137,90936', 'РОТЕРДА ПАУЛЯ 36498',
    'ЛИНДБЕРГА 2363', 'КЛЯЙНЕ АДЕМА 21047', 'РИКУСА 25415', 'ТАЙДИ БЕК ЭЛЕВЕЙШН 1271810,50218', 'ПАКЛАМАР АСТРОНАВТ 1258744,50202', 'ПАКЛАМАР БООТМАРКЕРА 1450228,502', 'РОЗЕЙФ СИТЕЙШН 267150,1492073,50',
    'РОМАНДЕЙЛ РЕФЛЕКШН МАРКИЗ 260008', 'ОСБОРНДЭЙЛ ИВАНХОЕ 1189870', 'ЛИНМАК 303731', 'РОЙБРУК ТЕЛСТЕР 1626041,288790', 'ФОНД МЭТТ 1392858,502096', 'СИЛИНГ ТРАЙДЖУН РОКИТ 252803', 'ГОВЕРНОР КОРНЕЙШН 629472',
    'ПАБСТ ГОВЕРНЕРА 882933', 'ИНКА СУПРИМ РЕФЛЕКШН 121004', 'ИРВИНГТОН ПРАЙТ АДМИРАЛ', 'ФРАНСА ГРОЕНХОВЕНА 247,18553', 'ОЛЬДАМСТЕР АДЕМА 19056', 'Р.ГР.СКОКИЕ.ДИЗАЙН 1298378', 'БОНТЬЕС АДЕМА 24674', 'Р.РГ.Ф.ГРЕЙЛИТ 205943/203949',
    'Р.РГ.ЛАВЕНХАМ ГАНДОЛЕ 179,387022', 'Р.РГ.ТЕРЛИНГ МАРТЬЕС 21533', 'Р.РГ.ЛАВЕНХАМ ГРЕНАДЕРА 58373', 'Р.РГ.ЛАВЕНХАМ ГАЛОРЕ 178795', 'Р.РГ.ЛАВЕНХАМ ТАРГЕ 145643', 'ЦИРРУС 16497', 'РУДОЛЬФА ЯНА 34558', 'СКОКИ СЕНСЕЙШЕН 1267271'
  ];

  useEffect(() => {
    fetchData();
  }, [key]);

  const updateData = () => {
    fetchData()
  }

  const fetchData = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem("filterValues", JSON.stringify(filterValues));
      localStorage.setItem("selectedComplexes", JSON.stringify(selectedComplexes));
      localStorage.setItem("selectedLine", JSON.stringify(selectedLine));

      const requestData = {
        filterValues,
        selectedComplexes,
        selectedLine
      };

      const response = await fetch(`${apiUrl}/api/v1/api/v1/pkcow-individual/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
          'Kodrn': farmCode,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const newData = await response.json();
        setTableData(newData.results);
      } else {
        console.error("Ошибка загрузки данных:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplexChange = (num) => {
    setSelectedComplexes(prev =>
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  return (
    <>
      <Paper className={`cows-binding ${isDarkMode ? 'dark' : 'light'}`} elevation={3}>
        <Grid container spacing={2}>
          {/* Кнопка для сворачивания фильтра */}
          <Grid item xs={12}>
            <Button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              variant="outlined"
              size="small"
            >
              {isFilterVisible ? 'Свернуть фильтр' : 'Развернуть фильтр'}
            </Button>
          </Grid>

          {/* Параметры фильтра */}
          {isFilterVisible && parameters.map(param => (
            <Grid item xs={12} sm={6} md={4} key={param}>
              <Typography variant="subtitle2">{param}</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    label="От"
                    type="number"
                    size="small"
                    fullWidth
                    value={filterValues[param].min}
                    onChange={(e) =>
                      setFilterValues(prev => ({ ...prev, [param]: { ...prev[param], min: e.target.value } }))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="До"
                    type="number"
                    size="small"
                    fullWidth
                    value={filterValues[param].max}
                    onChange={(e) =>
                      setFilterValues(prev => ({ ...prev, [param]: { ...prev[param], max: e.target.value } }))
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}

          {isFilterVisible && (
            <Grid item xs={12}>
              <Typography variant="h6">Комплекс</Typography>
              <Grid container spacing={1}>
                {[0, 1, 2, 3, 4, 5, 6].map(num => (
                  <Grid item key={num}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedComplexes.includes(num)}
                          onChange={() => handleComplexChange(num)}
                        />
                      }
                      label={num}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}


          {isFilterVisible && (
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{
                  color: isDarkMode ? '#fff' : '#000', // Цвет лейбла в зависимости от темы
                  '&.Mui-focused': {
                    color: isDarkMode ? '#fff' : '#000', // При фокусе сохраняем цвет
                  },
                }} id="line-select-label">Выбор линии</InputLabel>
                <Select
                  labelId="line-select-label"
                  value={selectedLine}
                  label="Выбор линии"
                  onChange={(e) => setSelectedLine(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: isDarkMode ? '#333' : '#fff', // Фон меню
                        color: isDarkMode ? '#fff' : '#000', // Цвет текста в меню
                      },
                    },
                  }}
                  sx={{
                    backgroundColor: isDarkMode ? '#333' : '#fff', // Цвет фона для Select
                    color: isDarkMode ? '#fff' : '#000', // Цвет текста для Select
                    '& .MuiSelect-icon': {
                      color: isDarkMode ? '#fff' : '#000', // Цвет стрелки
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? '#fff' : '#000', // Обводка
                    },
                  }}
                >
                  <MenuItem value=""><em>Нет</em></MenuItem>
                  {lineOptions.map((opt, idx) => (
                    <MenuItem key={idx} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {isFilterVisible && (
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <Button onClick={fetchData} variant="contained" color="primary" size="large">Применить</Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Таблица */}
      <PaginatedSortableTable
        data={tableData}
        select={select}
        columns={[
          { label: "Номер", key: "uniq_key" },
          { label: "Д.р", key: "datarojd" },
          { label: "К.О", key: "kompleks" },
          { label: "RM", key: "rm" },
          { label: "RBVT", key: "rbvt" },
          { label: "RBVF", key: "rbvf" },
          { label: "RBVU", key: "rbvu" },
          { label: "RC", key: "rc" },
          { label: "RF", key: "rf" },
          { label: "PI", key: "pi" },
        ]}
        mode="cow"
        onBindChoices={functionChoices}
        functionSelect={functionCow}
        updateFunction={updateData}
      />
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <CircularProgress size={60} color={"primary"} />
            <Typography variant="h6" color={'white'} sx={{ mt: 2 }}>Загрузка данных...</Typography>
          </div>
        </div>
      )}
    </>
  );
};

export default CowsBinding;