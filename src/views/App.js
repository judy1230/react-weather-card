import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { ReactComponent as AirFlowIcon } from '../images/airFlow.svg'
import { ReactComponent as DayCloudy } from '../images/day-cloudy.svg'
import { ReactComponent as RainIcon } from '../images/rain.svg'
import { ReactComponent as RefreshIcon } from '../images/refresh.svg'
import { ReactComponent as LoadingIcon } from '../images/loading.svg'
import { ThemeProvider } from '@emotion/react'
import dayjs from 'dayjs'
//step 4 : 載入 WeatherIcon元件
import WeatherIcon from '../components/WeatherIcon'

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
const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.backgroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`
const Location = styled.div`
  ${props => console.log(props)}
  font-size: 28px;
  color: ${props => props.theme === 'dark' ? '#dadada' : '#212121'};
  margin-bottom: 20px;
`
const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`
const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`
const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`
const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`
const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({theme}) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`
const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`
const Refresh = styled.div`
  @keyframes rotate{
    from {
      transform: rotate(360deg)
    }
    to {
      transform: rotate(0deg)
    }
  }
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => ( isLoading ? '1.5s' : '0s' )}
  }
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
      //step1: 不使用setWeatherElement來更新畫面, 先 return 資料回去
      return {
        description: weatherElements.Wx[0].value,
        weatherCode: weatherElements.Wx[1].value,
        rainPossibility: weatherElements.PoP12h[0].value,
        comfortability: weatherElements.MaxCI[0].value,
      }
      // setWeatherElement((prevState) => ({
      //   ...prevState,
      //   description: weatherElements.Wx.parameterName,
      //   weatherCode: weatherElements.Wx.parameterValue,
      //   rainPossibility: weatherElements.PoP12h[0].value,
      //   comfortability: weatherElements.MaxCI.parameterName,
      // }))
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
      //step1: 不使用setWeatherElement來更新畫面, 先 return 資料回去
      return {
        locationName: locationData.locationName,
        windSpeed: weatherElements.WDSD,
        temperature: weatherElements.TEMP,
        observationTime: locationData.time.obsTime,
      }
      // setWeatherElement((prevState) => ({
      //   ...prevState,
      //
      //   isLoading: false
      // }))

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


  const {
    observationTime,
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    isLoading,
    comfortability,
    //step 5 : 加入weatherCode
    weatherCode
  } = weatherElement


  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard>
          <Location>{locationName }</Location>
          <Description>{description} {comfortability}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)} <Celsius>°C</Celsius>
            </Temperature>
            {/* step 6 : 從app.js中帶入weathercode,menet參數*/}
            <WeatherIcon weatherCode={weatherCode} moment="night"/>
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon /> {windSpeed} m/h
          </AirFlow>
          <Rain>
            <RainIcon /> {rainPossibility}%
          </Rain>
          <Refresh onClick={fetchData}
            isLoading={ isLoading }>
            最後觀測時間：{new Intl.DateTimeFormat('zh-TW', {
              hour: 'numeric',
              minute: 'numeric',
            }).format(dayjs(observationTime))} {' '}
            {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  )
}

export default App
