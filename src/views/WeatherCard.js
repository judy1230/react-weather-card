import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as AQIIcon } from '../images/AQI.svg'
import { ReactComponent as RainIcon } from '../images/rainability1.svg'
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
  background:${({ theme }) => theme.background};
  box-sizing: border-box;
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
    bottom: 120px;
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
  background-color: #e7e6e1;
  border-radius: 0px 0px 5px 5px;
  display: flex;
  justify-content: center;
	transition-duration: 1s;
  .box{
    .dayWeather h3{
      color: ${({ theme }) => theme.titleColor};
    }
  }
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

`
const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const AQI = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  @keyframes twinkling {
    0% {
      opacity: 1;
      transform: scale(1.1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1);
    }
    100% {
      opacity: 1;
      transform: scale(1.1);
    }
  }
  .aqiIcon{
    width: 30px;
    margin-right: 30px;
    ${AQIData => console.log(AQIData)}
    fill: ${({ AQIData }) => (AQIData === "良好" ? "#75cfb8" : AQIData === "普通" ? "#f4d160" : AQIData === "對敏感族群不健康" ? "#d68060" : AQIData === "對所有族群不健康" ? "#e40017" : AQIData === "非常不健康" ? "#822659" : AQIData === "危害" ? "black" : "transparent")};
    animation: twinkling 2s  infinite ease;
    svg{
      fill: currentColor;

    }
  }
`

const Rain = styled.div`
  @keyframes rain {
    0% {
      transform: translateY(0px);
      opacity: 1;
    }
    70% {
      opacity: 0.4;
    }
    100% {
      transform: translateY(15px);
      opacity: 0;
    }
  }
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 30px;
    height: auto;
    margin-right: 30px;
    animation: rain 2s infinite linear;
    fill:${({ theme }) => theme.textColor}
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
  z-index: 11;
`


const WeatherCard = ({ weatherElement, moment, fetchData, handleCurrentPageChange }) => {
	const {
		observationTime,
    locationName,
		description,
		temperature,
		rainPossibility,
		isLoading,
    comfortability,
    weatherCode,
    predicationTemps,
    weatherCodes,
    weeklyPoP12h,
    weeklyT,
    AQIData
  } = weatherElement

	return (
    <WeatherCardWrapper>
      <Top>
        <Cog onClick={() => handleCurrentPageChange('WeatherSetting')} />
        <TemperaturePrediction predicationTemps={predicationTemps} moment={moment} observationTime={observationTime} />
        <Location>{locationName}</Location>
        <Description>{description} {comfortability}</Description>
        <CurrentWeather>
          <Temperature >
            {Math.round(temperature)} <Celsius>°C</Celsius>
          </Temperature>
          <WeatherIcon weatherCode={weatherCode} moment={moment} />
        </CurrentWeather>
        <AQI AQIData={AQIData}>
          <AQIIcon className="aqiIcon" /> 空氣品質: {AQIData}
          </AQI>
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
