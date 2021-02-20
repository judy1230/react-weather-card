import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { ReactComponent as AirFlowIcon } from '../images/airFlow.svg'
import { ReactComponent as RainIcon } from '../images/rain.svg'
import { ReactComponent as RefreshIcon } from '../images/refresh.svg'
import { ReactComponent as LoadingIcon } from '../images/loading.svg'
import { ReactComponent as CogIcon } from '../images/cog.svg'
import dayjs from 'dayjs'
import WeatherIcon from '../components/WeatherIcon'
import TemperaturePrediction from '../components/TemperaturePrediction'
import WeeklyTemperaturePrediction from '../components/WeeklyTemperaturePrediction'

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.backgroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
  border-radius: 5px;
  &:hover .bottom {
    height: 100px;
    opacity: 1;
    .box{
      opacity: 1;
      .dayWeather{
        opacity: 1;
        top: 0px
      }
    }
  }
  &:hover .refresh {
    opacity: 0;
  }
`
const Top = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.background};
  background-size: 100% 300%;
  border-radius: 5px;
`
const Bottom = styled.div`
  height: 10px;
  transition-duration: 1s;
  background: ${({ theme }) => theme.background};
  border-radius: 0px 0px 5px 5px;
  display: flex;
  justify-content: center;
	opacity: 0;
	transition-duration: 1s;
`

const Location = styled.div`
  ${props => console.log(props)}
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
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
  color: ${({ theme }) => theme.textColor};
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
  bottom: 50px;
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
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')}
  }
`

const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
  padding: 20px;
`


const WeatherCard = ({ weatherElement, moment, fetchData, handleCurrentPageChange }) => {
	const {
		observationTime,
    locationName,
		description,
		windSpeed,
		temperature,
		rainPossibility,
		isLoading,
		comfortability,
    weatherCode,
    predicationTemps,
    weatherCodes,
    weeklyPoP12h,
    weeklyT,
	} = weatherElement
  console.log('weatherCodes', weatherCodes)
	return (
    <WeatherCardWrapper>
      <Top>
        <Cog onClick={() => handleCurrentPageChange('WeatherSetting')} />
        <TemperaturePrediction predicationTemps={predicationTemps} moment={moment} />
        <Location>{locationName}</Location>
        <Description>{description} {comfortability}</Description>
        <CurrentWeather>
          <Temperature>
            {Math.round(temperature)} <Celsius>°C</Celsius>
          </Temperature>
          <WeatherIcon weatherCode={weatherCodes[0]} moment={moment} />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon /> {windSpeed} m/h
          </AirFlow>
        <Rain>
          <RainIcon /> {rainPossibility}%
          </Rain>
        <Refresh className="refresh" onClick={fetchData}
          isLoading={isLoading}>
          最後觀測時間：{new Intl.DateTimeFormat('zh-TW', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(dayjs(observationTime))} {' '}
          {isLoading ? <LoadingIcon /> : <RefreshIcon />}
        </Refresh>
      </Top>
      <Bottom className="bottom">
        <WeeklyTemperaturePrediction weatherCodes={weatherCodes} weeklyPoP12h={weeklyPoP12h} weeklyT={weeklyT} moment={moment} />
      </Bottom>


		</WeatherCardWrapper>
	)
}

export default WeatherCard
