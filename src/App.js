import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'
import { getMoment } from './utils/helpers'
import WeatherCard from './views/WeatherCard'

const AUTHORIZATION_KEY = 'CWB-6B0FF102-FDE8-40C3-B2CA-CECA1E4E67E5'
const LOCATION_NAME = '宜蘭'
const base_url = 'opendata.cwb.gov.tw/api'
const current_weather_url ='/v1/rest/datastore/O-A0003-001?'
const forecast_weather_url = 'v1/rest/datastore/F-D0047-003?'
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

const fetchWeatherForecast = () => {
  return fetch(
    `https://${base_url}/${forecast_weather_url}Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log('data',data)
      const locationData = data.records.locations[0].location[0]
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['Wx', 'PoP12h', 'MaxCI'].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].elementValue
          }
          return neededElements
        },
        {}
      )
      return {
        description: weatherElements.Wx[0].value,
        weatherCode: weatherElements.Wx[1].value,
        rainPossibility: weatherElements.PoP12h[0].value,
        comfortability: weatherElements.MaxCI[0].value,
      }
    })
}


const fetchCurrentWeather = () => {
  return fetch(
    `https://${base_url}/${current_weather_url}Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
  ).then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0]
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['WDSD', 'TEMP', 'Weather', 'HUMD'].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue
          }
          return neededElements
        },
        {}
      )
      return {
        locationName: locationData.locationName,
        windSpeed: weatherElements.WDSD,
        temperature: weatherElements.TEMP,
        observationTime: locationData.time.obsTime,
      }
    })

}
function App() {
  const [currentTheme, setCurrentTheme] = useState('light')
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    temperature: 0,
    windSpeed: 0,
    description: '',
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: '',
    isLoading: true
  })

  const moment = getMoment('宜蘭縣')
  //根據 moment 決定要使用亮色或暗色主題
  useEffect(() => {
    console.log('moment', moment)
    setCurrentTheme(moment === 'day' ? 'light' : 'dark')
  }, [moment])

  const fetchData = useCallback(async () => {
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }))

    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather(),
      fetchWeatherForecast(),
    ])

    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard weatherElement={weatherElement} moment={moment} fetchData={ fetchData }/>
      </Container>
    </ThemeProvider>
  )
}

export default App
