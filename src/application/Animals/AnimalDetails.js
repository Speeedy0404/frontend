import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal';
import axiosInstance from '../../axiosConfig';
import './AnimalDetails.css';
import ParameterChart from './ParameterChart';
import ConformationList from './ConformationList'
import Pedigree from './Pedigree'

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

import {
  Typography,
  CircularProgress
} from '@mui/material';

import { useTheme as useCustomTheme } from "../ThemeContext"; // Импортируем хук useTheme

const AnimalDetails = ({ animalType, animaluniq_key, onBack, pin, chartData }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndivNumber, setSelectedIndivNumber] = useState('');
  const [selectedAnimalType, setSelectedAnimalType] = useState(animalType);
  const [animalData, setAnimalData] = useState(null);
  const [activeTab, setActiveTab] = useState("main");
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useCustomTheme();
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {

    const fetchAnimalData = async () => {
      try {
        setLoading(true);
        const endpoint =
          animalType === 'cow'
            ? `get-info-cow-animal/?uniq_key=${animaluniq_key}`
            : `get-info-animal/?uniq_key=${animaluniq_key}`;
        const response = await axiosInstance.post(endpoint);
        // Если фото есть, установим его URL
        if (response.data.photo) {
          setImageSrc(`${process.env.REACT_APP_API_URL}${response.data.photo}/`);
        }
        setAnimalData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении данных животного', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalData()

  }, [animalType, animaluniq_key]);

  const indices = () => {
    if (!animalData || !animalData.indices) return null;
    return (
      <table className="indices-table">
        <thead>
          <tr>
            <th>Показатель</th>
            <th>EVB</th>
            <th>REL</th>
            <th>RBV</th>
          </tr>
        </thead>
        <tbody>
          {animalType === "bull" && (
            <tr>
              <th colSpan="4"> Количество дочерей: {animalData.livestock[1]} || Количество стад {animalData.herd[1]}</th>
            </tr>
          )}
          {animalData.indices.map((row, index) => {
            if (animalType === 'bull' && (index === 4 || index === 7)) {
              return (
                <React.Fragment key={`fragment-${index}`}>
                  <tr>
                    <td>{row.name}</td>
                    <td>{row.evb}</td>
                    <td>{row.rel}</td>
                    <td>{row.rbv}</td>
                  </tr>
                  <tr key={`separator-${index}`}>
                    <th colSpan="4">
                      Количество дочерей: {animalData.livestock[index]} || Количество стад: {animalData.herd[index]}
                    </th>
                  </tr>
                </React.Fragment>
              );
            } else if (animalType === 'cow' && (index === 5 || index === 9 || index === 10 || index === 14)) {
              return (
                <React.Fragment key={`fragment-${index}`}>
                  <tr>
                    <td>{row.name}</td>
                    <td>{row.evb}</td>
                    <td>{row.rel}</td>
                    <td>{row.rbv}</td>
                  </tr>
                  <tr className="table-separator">
                    <td colSpan="4"></td>
                  </tr>
                </React.Fragment>
              );
            } else {
              return (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.evb}</td>
                  <td>{row.rel}</td>
                  <td>{row.rbv}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    );
  };

  if (loading) return <div className="loading-overlay">
    <div className="loading-content">
      <CircularProgress size={60} color={"primary"} />
      <Typography variant="h6" color={'white'} sx={{ mt: 2 }}>Загрузка</Typography>
    </div>
  </div>;


  const handleParentClick = (relativeAnimalType, relativeIndivNumber) => {
    setSelectedAnimalType(relativeAnimalType);
    setSelectedIndivNumber(relativeIndivNumber);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIndivNumber('');
  };

  return (
    <div className="animal-details-container">
      {onBack && (
        <button className="back-button" onClick={onBack}>
          &#8592; Назад
        </button>
      )}
      {animalData && !animalData.Answer ? (
        <div className="animal-details-card">
          {!pin && (
            <img
              src={imageSrc}
              alt={animalData?.klichka || 'Фотография'}
              className="animal-thumbnail"
              onClick={() => setIsImageModalOpen(true)}
            />
          )}
          {/* Вкладки */}
          <div className="tabs-container">
            <div className="tabs-header">
              <div
                className={`tab ${activeTab === "main" ? "active" : ""}`}
                onClick={() => setActiveTab("main")}
              >
                Основная информация
              </div>
              <div
                className={`tab ${activeTab === "extra" ? "active" : ""}`}
                onClick={() => setActiveTab("extra")}
              >
                {animalType === "bull" ? "Линейный профиль" : "Оценка экстерьера"}
              </div>
            </div>
            <div className="tabs-content">
              {activeTab === "main" ? (
                <div className="details-content">
                  <h2>{animalData.info.klichka || 'Без клички'}</h2>
                  <p>
                    <strong>Индивидуальный номер:</strong> {animalData.info.uniq_key}
                  </p>
                  <p>
                    <strong>Рабочий номер:</strong> {animalData.info.nomer}
                  </p>
                  {animalType === 'bull' && (
                    <p>
                      <strong>Кличка:</strong> {animalData.info.klichka}
                    </p>
                  )}
                  <p>
                    <strong>Дата рождения:</strong> {animalData.info.datarojd || 'Не указана'}
                  </p>
                  <p>
                    <strong>Место рождения:</strong> {animalData.info.mestorojd || 'Не указано'}
                  </p>
                  {animalType === 'bull' && (
                    <p>
                      <strong>Принадлежность:</strong> {animalData.info.ovner}
                    </p>
                  )}
                  <p>
                    <strong>Комплекс:</strong> {animalData.info.kompleks || 'Не указана'}
                  </p>
                  {animalType === 'bull' && (
                    <p>
                      <strong>Семя:</strong> {animalData.info.sperma}
                    </p>
                  )}
                  <p>
                    <strong>Ветка:</strong> {animalData.info.branch || 'Не указана'}
                  </p>
                  <p>
                    <strong>Линия:</strong> {animalData.info.lin || 'Не указана'}
                  </p>
                  <p>
                    <strong>Порода:</strong> {animalData.info.por || 'Не указана'}
                  </p>

                  {/* Родословная */}
                  <Pedigree parentData={animalData.parent} onParentClick={handleParentClick} />

                  {/* Индексы */}
                  {indices()}

                  {animalData.additional_info && animalType === "bull" && (
                    <div className="additional-info">
                      <h3>Дополнительная информация</h3>
                      <div className="additional-info-grid">
                        {animalData.additional_info.map((info, index) => (
                          <div className="info-item" key={index}>
                            <span className="info-name">{info.name}</span>
                            <span className="info-value">{info.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {chartData && (
                    <div className="additional-info">
                      <h3>Паучья диаграмма</h3>
                      <Box sx={{ mt: 4, height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={chartData} outerRadius={window.innerWidth < 600 ? 90 : 130}>
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
                            <Radar
                              name="Показатели"
                              dataKey="value"
                              stroke={isDarkMode ? "#90caf9" : "#1976d2"}
                              fill={isDarkMode ? "#90caf9" : "#1976d2"}
                              fillOpacity={0.6}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </Box>
                    </div>
                  )}

                </div>
              ) : (
                <div className="extra-content">
                  {animalData.linear_profile && animalType === "bull" && (
                    <ParameterChart data={animalData.linear_profile} klichka={animalData.info.klichka} />
                  )}
                  {animalData.exterior_assessment && animalType === "cow" && (
                    <ConformationList data={animalData.exterior_assessment} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Нет данных для отображения.</p>
      )}
      {isImageModalOpen && (
        <ImageModal
          imageSrc={imageSrc}
          onClose={() => setIsImageModalOpen(false)}
        />

      )}
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="animal-modal-title"
        aria-describedby="animal-modal-description"
      >
        <Box
          className={isDarkMode ? 'dark-mode' : ''}
          sx={{
            width: { xs: '95%', sm: '80%' },
            maxHeight: '90vh',
            margin: 'auto',
            marginTop: { xs: '2%', sm: '5%' },
            padding: { xs: '1rem', sm: '2rem' },
            backgroundColor: isDarkMode ? '#424242' : '#fff',
            borderRadius: '8px',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleModalClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: isDarkMode ? '#fff' : 'inherit',
            }}
          >
            <CloseIcon />
          </IconButton>
          <AnimalDetails
            animalType={selectedAnimalType}
            animaluniq_key={selectedIndivNumber}
            pin={pin}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default AnimalDetails;
