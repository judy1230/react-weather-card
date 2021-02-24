import React, { useState, useEffect, useMemo } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'
import { getMoment, findLocation } from './utils/helpers'
import WeatherCard from './views/WeatherCard'
import useWeatherAPI from './hooks/useWeatherAPI'
import WeatherSetting from './views/WeatherSetting'
import weatherUrl from './data/API-URL.json'


const AUTHORIZATION_KEY = 'CWB-6B0FF102-FDE8-40C3-B2CA-CECA1E4E67E5'
const AQI_KEY = '9be7b239-557b-4c10-9775-78cadfc555e9'
const BASE_URL = 'opendata.cwb.gov.tw/api'
const CURRENT_WEATHER_URL ='v1/rest/datastore/O-A0003-001'
const FORECAST_WEATHER_URL = 'v1/rest/datastore/F-C0032-001?'


const theme = {
  light: {
    backgroundColor: '#ededed',
    background: ' linear-gradient(20deg,#eff7e1 0%, #fdffbc 95%)',
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
    background: 'linear-gradient(20deg,#19283D 0%, #1D678F 95%)'
  },
};

const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`



function App() {
  const storageCity = localStorage.getItem('cityName') || '臺北市'
  const [currentTheme, setCurrentTheme] = useState('dark')
  const [currentPage, setCurrentPage] = useState('WeatherCard')
  const [currentCity, setCurrentCity] = useState(storageCity)

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage)
  }
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity)
  }

  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity])
  const { cityName, locationName, sunriseCityName } = currentLocation
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName])

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark')
  }, [moment])

  const Weekly_WEATHER_URL = weatherUrl.filter(item => item.locationName === cityName)[0].url
  
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
    forecastWeatherUrl: FORECAST_WEATHER_URL,
    currentWeatherUrl: CURRENT_WEATHER_URL,
    weeklyWeatherUrl: Weekly_WEATHER_URL,
    baseUrl: BASE_URL,
    AQIKEY:AQI_KEY
  })

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            cityName={cityName}
            handleCurrentPageChange={handleCurrentPageChange} />

        )}
        {currentPage === 'WeatherSetting' && <WeatherSetting
          cityName={cityName}
          handleCurrentCityChange={handleCurrentCityChange}
          handleCurrentPageChange={handleCurrentPageChange} />}



      </Container>
    </ThemeProvider>
  )
}

export default App
