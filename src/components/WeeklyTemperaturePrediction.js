import React, { useRef, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import WeeklyWeatherIcons from './WeatherIcon'
import dayjs from 'dayjs'


const Container= styled.div`
	height: 100%;
  display: flex;
  justify-content: center;
	transition-duration: 1s;
	opacity: 0;
	.dayWeather:nth-child(1) {
    transition-delay: 0.2s;
  }
	.dayWeather:nth-child(2) {
		transition-delay: 0.3s;
	}

	.dayWeather:nth-child(3) {
		transition-delay: 0.4s;
	}

	.dayWeather:nth-child(4) {
		transition-delay: 0.5s;
	}

	.dayWeather:nth-child(5) {
		transition-delay: 0.6s;
	}

	.dayWeather:nth-child(6) {
		transition-delay: 0.7s;
	}

	.dayWeather:nth-child(7) {
		transition-delay: 0.8s;
	}
`

const DayWeather = styled.div`
	padding: 2px;
	margin: 10px 5px 0 10px;
  width: calc(100% / 7 - 5px);
  box-sizing: border-box;
  text-align: center;
  top: 20px;
  transition: 0.5s;
	border-radius: 5px;
	opacity: 0;
	svg {
		width: 100%;
  	max-width: 30px;
	}
	svg .sun {
		fill: #FFD633;
		stroke-width: 30px;
		stroke: rgba(255, 214, 51, 0.5);
		stroke-dasharray: 5px;
	}
  svg .rain {
		stroke: #4DACFF;
		stroke-width: 5px;
	}
 svg .cloud {
		fill: #ccc;
	}
	h3 {
		text-align: center;
		font-size: 8px;
		font-weight: 400;
		color: #212121;
		letter-spacing: 1px;
		margin: 0px;
		padding: 0px;
	}




`


const WeeklyTemperaturePrediction = ({ weatherCodes, weeklyPoP12h,
	weeklyT, moment }) => {
	let indexs = [0, 1, 2, 3, 4, 5, 6]
	const weeks = ["MON", "TUE", "WED", "THR", "FRI", "SAT", "SUN"]

	let date = (weatherCodes.map(item => dayjs(item.time).day())).filter((item, index) => index % 2 == 0)
	weatherCodes = (weatherCodes.map(item => item.elementValue)).filter((item, index) => index % 2 == 0)

	weeklyT = weeklyT.filter((item,index) => index % 2 == 0)

	const dayWeather = indexs.map((index) =>
		<DayWeather className="dayWeather">
			<h3>{weeks[date[index]]}</h3>
			<WeeklyWeatherIcons weatherCode={weatherCodes[index]} moment={moment} />
			<h3>{weeklyT[index]}°C</h3>
			{/* <h3>{weeklyPoP12h[index]}%</h3> */}
		</DayWeather>
	);

	return (
		<Container className="box">
			{dayWeather}
		</Container>

	)
}

export default WeeklyTemperaturePrediction
