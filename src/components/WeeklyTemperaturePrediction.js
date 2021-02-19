import React, { useRef, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import WeeklyWeatherIcons from './WeeklyWeatherIcons'

const Container= styled.div`
	display: flex;
	align-content:center;
	justify-content: center;
	padding: 20px 0;
`

const DayWeather = styled.div`
	padding: 2px;
	margin: 20px 5px 0 10px;
  width: calc(100% / 7 - 5px);
  box-sizing: border-box;
  text-align: center;
  /* opacity: 0; */
  top: 20px;
  transition: 0.5s;
	box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2), 0px 5px 5px -5px rgba(0, 0, 0, 0.3);
	border-radius: 5px;
	svg {
		width: 100%;
  	max-width: 30px;
	}
	h3 {
		text-align: center;
		font-size: 8px;
		font-weight: 400;
		color: #333;
		letter-spacing: 1px;
		margin: 0px;
		padding: 0px;
}

`


const WeeklyTemperaturePrediction = ({ weatherCodes, weeklyPoP12h,
	weeklyT, moment }) => {

	weatherCodes = weatherCodes.filter((item, index) => index % 2 !== 0)
	weeklyPoP12h = weeklyPoP12h.filter((item, index) => index % 2 !== 0)
	weeklyT = weeklyT.filter((item, index) => index % 2 !== 0)
	
	let indexs = [0, 1, 2, 3, 4, 5, 6]
	let weeks = ["MON", "TUE", "WED", "THR", "FRI", "SAT", "SUN"]

	const dayWeather = indexs.map((index) =>
		<DayWeather>
			<h3>{ weeks[index]}</h3>
			<WeeklyWeatherIcons weatherCode={weatherCodes[index]} moment={moment} />
			<h3>{weeklyT[index]}°C</h3>
			<h3>{weeklyPoP12h[index]}%</h3>
		</DayWeather>
	);

	return (
		<Container>
			{dayWeather}
		</Container>

	)
}

export default WeeklyTemperaturePrediction
