// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Tabs, Tab, Box } from '@mui/material';
// import { useTheme } from '../../application/ThemeContext';
// import TabPanel from './TabPanel';
// import InfoTab from './InfoTab';
// import ForecastTab from './ForecastTab';
// import BindingTab from './BindingTab';
// import './Pin.css';

// const Pin = () => {
//   const location = useLocation();
//   const { farmName, farmCode,
//     density_data,
//     lactation_data,
//     breeding_value_of_milk_productivity,
//     relative_breeding_value_of_milk_productivity,
//     forecasting_1, forecasting_2, forecasting_3, forecasting_4 } = location.state || {};
//   const { isDarkMode } = useTheme();
//   const [activeTab, setActiveTab] = useState(0);

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   return (
//     <div className={`pin-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
//       <Tabs
//         value={activeTab}
//         onChange={handleTabChange}
//         variant="fullWidth"
//         textColor="inherit"
//         indicatorColor="primary"
//       >
//         <Tab label="Информация о хозяйстве" />
//         <Tab label="Прогноз" />
//         <Tab label="Закрепление" />
//       </Tabs>
//       <TabPanel value={activeTab} index={0}>
//         <InfoTab breeding_value_of_milk_productivity={breeding_value_of_milk_productivity}
//           relative_breeding_value_of_milk_productivity={relative_breeding_value_of_milk_productivity} lac={lactation_data} density_data={density_data} />
//       </TabPanel>
//       <TabPanel value={activeTab} index={1}>
//         <ForecastTab farmCode={farmCode} forecasting_1={forecasting_1} forecasting_2={forecasting_2} forecasting_3={forecasting_3} forecasting_4={forecasting_4} />
//       </TabPanel>
//       <TabPanel value={activeTab} index={2}>
//         <BindingTab farmName={farmName} farmCode={farmCode} />
//       </TabPanel>
//     </div>
//   );
// };

// export default Pin;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import { useTheme } from '../../application/ThemeContext';
import TabPanel from './TabPanel';
import InfoTab from './InfoTab';
import ForecastTab from './ForecastTab';
import BindingTab from './BindingTab';
import './Pin.css';

const Pin = () => {
  const location = useLocation();
  const {
    farmName, farmCode,
    density_data, lactation_data,
    breeding_value_of_milk_productivity,
    relative_breeding_value_of_milk_productivity,
    forecasting_1, forecasting_2, forecasting_3, forecasting_4
  } = location.state || {};

  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    localStorage.removeItem("filterValues");
    localStorage.removeItem("selectedComplexes");
    localStorage.removeItem("selectedLine");
  }, [farmName]);

  return (
    <div className={`pin-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="inherit"
        indicatorColor="primary"
      >
        <Tab label="Информация о хозяйстве" />
        <Tab label="Прогноз" />
        <Tab label="Закрепление" />
      </Tabs>

      {/* Все вкладки рендерятся, но неактивные скрываются */}
      <div className="tab-content">
        <div className={`tab-panel ${activeTab === 0 ? 'active' : 'hidden'}`}>
          <InfoTab
            breeding_value_of_milk_productivity={breeding_value_of_milk_productivity}
            relative_breeding_value_of_milk_productivity={relative_breeding_value_of_milk_productivity}
            lac={lactation_data}
            density_data={density_data}
          />
        </div>
        <div className={`tab-panel ${activeTab === 1 ? 'active' : 'hidden'}`}>
          <ForecastTab
            farmCode={farmCode}
            forecasting_1={forecasting_1}
            forecasting_2={forecasting_2}
            forecasting_3={forecasting_3}
            forecasting_4={forecasting_4}
          />
        </div>
        <div className={`tab-panel ${activeTab === 2 ? 'active' : 'hidden'}`}>
          <BindingTab farmName={farmName} farmCode={farmCode} />
        </div>
      </div>
    </div>
  );
};

export default Pin;