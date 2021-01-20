//step 1: 載入useEffect
import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { ReactComponent as AirFlowIcon } from '../images/airFlow.svg'
import { ReactComponent as DayCloudy } from '../images/day-cloudy.svg'
import { ReactComponent as RainIcon } from '../images/rain.svg'
import { ReactComponent as RefreshIcon } from '../images/refresh.svg'
import { ThemeProvider } from '@emotion/react'
import dayjs from 'dayjs'

const AUTHORIZATION_KEY = 'CWB-6B0FF102-FDE8-40C3-B2CA-CECA1E4E67E5'
const LOCATION_NAME = '臺北'
const base_url = 'opendata.cwb.gov.tw/api'

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
  }
`

function App() {
  console.log('invoke function component')
  const [currentTheme, setCurrentTheme] = useState('light')
  const [currentWeather, setCurrentWeather] = useState({
    locationName: '台北市',
    description: '晴時多雲',
    windSpeed: 1.1,
    temperature: 14,
    rainPossibility: 48.3,
    observationTime: '2020-12-12 22:10:00'
  })
  //step2: 使用useEffect, 加入useEffect的方法, 參數是需要放入函式
  useEffect(() => {
    //step 3: 加入console.log看看useEffect觸發的時間點
    console.log('execute function in useEffect')
    //step 5: 把handleClick改成fetchCurrentWeather放入useEffect當中
    fetchCurrentWeather()
    //step 6: 加入[]陣列阻止useEffect不停render
  }, [currentWeather.observationTime])

  const fetchCurrentWeather = () => {
    //console.log('handleClick')
    fetch(
      `https://${base_url}/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
    ).then((response) => response.json())
      .then((data) => {
        //console.log('data', data)
        //step1: 定義'locationData'把回傳的資料會用到的部分取出
        const locationData = data.records.location[0]
        //console.log('locationData', locationData)
        //step2: 將風速(WDSD)和氣溫(TEMP)的資料取出
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['WDSD', 'TEMP', 'Weather', 'HUMD'].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue
            }
            return neededElements
          }
        )
        //console.log('weatherElements', weatherElements)
        //step3:  更新react元件中的資料狀態
        setCurrentWeather({
          locationName: locationData.locationName,
          description: weatherElements.Weather,
          windSpeed: weatherElements.WDSD,
          temperature: weatherElements.TEMP,
          rainPossibility: weatherElements.HUMD*100,
          observationTime: locationData.time.obsTime
        })

      })

  }


  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* step 4: 加入console.log看看useEffect觸發的時間點 */}
        { console.log('render')}
        <WeatherCard>
          <Location>{ currentWeather.locationName }</Location>
          <Description>{currentWeather.description}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(currentWeather.temperature)} <Celsius>°C</Celsius>
            </Temperature>
            <DayCloudy />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon /> {currentWeather.windSpeed} m/h
        </AirFlow>
          <Rain>
            <RainIcon /> {currentWeather.rainPossibility}%
        </Rain>

          <Refresh>
            最後觀測時間：{new Intl.DateTimeFormat('zh-TW', {
              hour: 'numeric',
              minute: 'numeric',
            }).format(dayjs(currentWeather.observationTime))} {' '}<RefreshIcon onClick={ fetchCurrentWeather }/>
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  )
}

export default App
