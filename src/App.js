import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'
import { getMoment, findLocation } from './utils/helpers'
import WeatherCard from './views/WeatherCard'
import useWeatherAPI from './hooks/useWeatherAPI'
import WeatherSetting from './views/WeatherSetting'

const AUTHORIZATION_KEY = 'CWB-6B0FF102-FDE8-40C3-B2CA-CECA1E4E67E5'
//const LOCATION_NAME = '宜蘭'
const BASE_URL = 'opendata.cwb.gov.tw/api'
const CURRENT_WEATHER_URL ='v1/rest/datastore/O-A0003-001?'
const FORECAST_WEATHER_URL = 'v1/rest/datastore/F-C0032-001?'
//const LOCATION_NAME_FORECAST = '羅東鎮'



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
  const [currentPage, setCurrentPage] = useState('WeatherCard')
  //step 1 : 定義 currentCity
  const [currentCity, setCurrentCity] = useState('臺北市')

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage)
  }
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity)
  }

  //step 2 : 找出每支 API 需要帶入的 cityName
  // const currentLocation = findLocation(currentCity)
  //step 3 : 也使用 useMemo 把取得的資料保存下來
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity])
  //step 4 : 再透過解構賦值取出 currentLocation 的資料
  const { cityName, locationName, sunriseCityName } = currentLocation

  //step 5 : 在 getMoment 的參數中換成 sunriseCityName
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName])

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark')
  }, [moment])

  //step 6 : 在 useWeatherAPI 中參數改成 locationName 和 cityName和 cityName
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
    forecastWeatherUrl: FORECAST_WEATHER_URL,
    currentWeatherUrl: CURRENT_WEATHER_URL,
    baseUrl: BASE_URL
  })

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          // step 7 : 將 cityName 傳入weatherCard 元件中
          <WeatherCard
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            cityName={cityName}
            handleCurrentPageChange={handleCurrentPageChange} />
        )}
        {currentPage === 'WeatherSetting' && <WeatherSetting
          // step 9: 將 cityName 跟 handleCurrentCityChange 放入 WeatherSetting 元件中
          cityName={cityName}
          handleCurrentCityChange={handleCurrentCityChange}
          handleCurrentPageChange={handleCurrentPageChange} />}

      </Container>
    </ThemeProvider>
  )
}

export default App
