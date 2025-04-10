import React, { useState, useEffect } from 'react';
import { Button, Checkbox, FormControlLabel, FormControl, CircularProgress, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import PaginatedSortableTable from './PaginatedSortableTable';
import { useTheme } from '../ThemeContext'; // Подключаем тему!
import './Pin.css';
const apiUrl = process.env.REACT_APP_API_URL
const CalvesBinding = ({ select, farmName, farmCode, functionCalves, key }) => {
  const { isDarkMode } = useTheme(); // Проверяем тему
  const [selectedComplexes, setSelectedComplexes] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [tableData, setTableData] = useState([]); // Placeholder для данных
  const [isLoading, setIsLoading] = useState(false);
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
  }, [farmName, farmCode]);

  const updateData = () => {
    fetchData()
  }

  const fetchData = async () => {
    setIsLoading(true);
    const requestData = {
      selectedComplexes,
      selectedLine
    };
    try {
      const response = await fetch(`${apiUrl}/api/v1/api/v1/young-individual/`, {
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


  return (
    <>
      <div className={`cows-binding ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="filter-section">

          {/* Комплекс */}
          <Typography variant="subtitle2" gutterBottom>Комплекс:</Typography>
          <div className="flex gap-2 flex-wrap mb-4">
            {[0, 1, 2, 3, 4, 5, 6].map(num => (
              <FormControlLabel
                key={num}
                control={
                  <Checkbox
                    checked={selectedComplexes.includes(num)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedComplexes([...selectedComplexes, num]);
                      } else {
                        setSelectedComplexes(selectedComplexes.filter(n => n !== num));
                      }
                    }}
                  />
                }
                label={num}
              />
            ))}
          </div>

          {/* Линия */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="line-select-label">Выбор линии</InputLabel>
            <Select
              labelId="line-select-label"
              value={selectedLine}
              label="Выбор линии"
              onChange={(e) => setSelectedLine(e.target.value)}
            >
              <MenuItem value=""><em>Нет</em></MenuItem>
              {lineOptions.map((opt, idx) => (
                <MenuItem key={idx} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Кнопка */}
          <Button
            variant="contained"
            color="primary"
            onClick={fetchData}
            fullWidth
            sx={{ mt: 2, borderRadius: 2 }}
            className="action-button"
          >
            Применить
          </Button>
        </div>
      </div>
      {/* Таблица */}
      <div className="table-section">
        <PaginatedSortableTable
          data={tableData}
          columns={[
            { label: "Номер", key: "uniq_key" },
            { label: "Д.р", key: "datarojd" },
            { label: "К.О", key: "father_kompleks" },
            { label: "Линия", key: "father_lin_name" },
          ]}
          maxSelectable={Infinity}
          mode={'young'}
          select={select}
          functionSelect={functionCalves}
          updateFunction={updateData}
        />
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>Загрузка данных...</Typography>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CalvesBinding;