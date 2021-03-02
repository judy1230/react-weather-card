import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'
import dayjs from 'dayjs'



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


const TemperaturePredictionWrapper = styled.div`
  position: relative;
	width: 100%;
  background-color: transparent;
	box-sizing: border-box;
  transition-duration: 0.5s
`


const TemperaturePrediction = ({ predicationTemps, moment, observationTime }) => {
	const [currentTheme, setCurrentTheme] = useState('dark')
 	useEffect(() => {
 	setCurrentTheme(moment === 'day' ? 'light' : 'dark')
		}, [moment])

	let unity = 25
	let by = "60"
	let byt0 = `${(parseInt(by)- unity)}`
	let dy1 = `${(parseInt(by) + 2 * (predicationTemps[0] - predicationTemps[1]))}`
	let byt1 = `${(parseInt(dy1) - unity)}`
	let dy2 = `${(parseInt(by) + 2 * (predicationTemps[0] - predicationTemps[2]))}`
	let byt2 = `${(parseInt(dy2) - unity)}`
	let bx = "60"
	let dx1 = `${2 * parseInt(bx)}`
	let dx2 = `${3 * parseInt(bx)}`
	let points = `${bx},${by} ${dx1},${dy1} ${dx2},${dy2}`

	let after6hour = new Date();
	after6hour.setHours(after6hour.getHours() + 6)
	let after12hour = new Date();
	after12hour.setHours(after12hour.getHours() + 12)


	return (
		<ThemeProvider theme={theme[currentTheme]}>
			<TemperaturePredictionWrapper>
				<svg className="temsvg" fill={theme[currentTheme].titleColor}>
					<text x={bx} y={byt0}> {new Intl.DateTimeFormat('zh-TW', {
						hour: 'numeric',
						minute: 'numeric',
					}).format(dayjs(observationTime))} {' '} </text>
					<text x={bx} y={by}> {predicationTemps[0]}°C</text>
					<circle cx={bx} cy={by} r="3"></circle>
					<text x={dx1} y={byt1}>{new Intl.DateTimeFormat('zh-TW', {
						hour: 'numeric',
						minute: 'numeric',
					}).format(dayjs(after6hour))} {' '} </text>
					<text x={dx1} y={dy1}>{predicationTemps[1]}°C</text>
					<circle cx={dx1} cy={dy1} r="3"></circle>
					<text x={dx2} y={byt2}>{new Intl.DateTimeFormat('zh-TW', {
						hour: 'numeric',
						minute: 'numeric',
					}).format(dayjs(after12hour))} {' '} </text>
					<text x={dx2} y={dy2}>{predicationTemps[2]}°C</text>
					<circle cx={dx2} cy={dy2} r="3"></circle>
					<polyline points={points} stroke={theme[currentTheme].titleColor}></polyline>
				</svg>
			</TemperaturePredictionWrapper>
		</ThemeProvider>
	)
}

export default TemperaturePrediction
