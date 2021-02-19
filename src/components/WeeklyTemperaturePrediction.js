import React, { useRef, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import WeeklyWeatherIcons from './WeeklyWeatherIcons'

const Container= styled.div`
	height: 100%;
  background-color: #f3f3f3;
  border-radius: 0px 0px 5px 5px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
	opacity: 0;
	transition-duration: 1s;

`

const DayWeather = styled.div`
	padding: 2px;
	margin: 10px 5px 0 10px;
  width: calc(100% / 7 - 5px);
  box-sizing: border-box;
  text-align: center;
  top: 20px;
  transition: 0.5s;
	box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2), 0px 5px 5px -5px rgba(0, 0, 0, 0.3);
	border-radius: 5px;
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
		color: #333;
		letter-spacing: 1px;
		margin: 0px;
		padding: 0px;
	}


`


const WeeklyTemperaturePrediction = ({ weatherCodes, weeklyPoP12h,
	weeklyT, moment }) => {
	console.log('weatherCodes', weatherCodes)
	weatherCodes = weatherCodes.filter((item, index) => index % 2 == 0)
	weeklyPoP12h = weeklyPoP12h.filter((item, index) => index % 2 == 0)
	weeklyT = weeklyT.filter((item, index) => index % 2 == 0)
	console.log('weatherCodes', weatherCodes)

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
		<Container className="box">
			{dayWeather}
		</Container>

	)
}

export default WeeklyTemperaturePrediction
