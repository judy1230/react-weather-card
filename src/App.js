import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'
import { getMoment } from './utils/helpers'
import WeatherCard from './views/WeatherCard'
// step 1 : 匯入useWeatherAPI匯入useWeatherAPI
import useWeatherAPI from './hooks/useWeatherAPI'
const AUTHORIZATION_KEY = 'CWB-6B0FF102-FDE8-40C3-B2CA-CECA1E4E67E5'
const LOCATION_NAME = '宜蘭'
const BASE_URL = 'opendata.cwb.gov.tw/api'
const CURRENT_WEATHER_URL ='v1/rest/datastore/O-A0003-001?'
const FORECAST_WEATHER_URL = 'v1/rest/datastore/F-D0047-003?'
const LOCATION_NAME_FORECAST = '羅東鎮'



const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color:${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`


function App() {
  const [currentTheme, setCurrentTheme] = useState('light')
  //step 2 : 使用 useWeatherAPI使用 useWeatherAPI
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName: LOCATION_NAME,
    cityName: LOCATION_NAME_FORECAST,
    authorizationKey: AUTHORIZATION_KEY,
    forecastWeatherUrl: FORECAST_WEATHER_URL ,
    currentWeatherUrl: CURRENT_WEATHER_URL,
    baseUrl: BASE_URL
  })
  
  const moment = getMoment('宜蘭縣')
  //根據 moment 決定要使用亮色或暗色主題
  useEffect(() => {
    //console.log('moment', moment)
    setCurrentTheme(moment === 'day' ? 'light' : 'dark')
  }, [moment])

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard weatherElement={weatherElement} moment={moment} fetchData={ fetchData }/>
      </Container>
    </ThemeProvider>
  )
}

export default App
