// __tests__/fetch.test.js
import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils';
import { unmountComponentAtNode } from "react-dom";
import { getMoment, findLocation } from '../utils/helpers'
import '@testing-library/jest-dom/extend-expect';
import WeatherCard from '../views/WeatherCard';
const moment = 'day'

const weatherElement = {
	AQIData: "普通",
	comfortability: "舒適",
	description: "陰天",
	isLoading: false,
	locationName: "宜蘭",
	observationTime: "2021-02-26 15:10:00",
	predicationTemps: ["26", "22", "22"],
	rainPossibility: "20",
	temperature: "23.20",
	weatherCode: "07",
	weatherCodes: [
		{ time: "2021-02-26 12:00:00", elementValue: "07" },
		{ time: "2021-02-26 18:00:00", elementValue: "06" },
		{ time: "2021-02-27 06:00:00", elementValue: "06" },
		{ time: "2021-02-27 18:00:00", elementValue: "04" },
		{ time: "2021-02-28 06:00:00", elementValue: "02" },
		{ time: "2021-02-28 18:00:00", elementValue: "03" },
		{ time: "2021-03-01 06:00:00", elementValue: "02" },
		{ time: "2021-03-01 18:00:00", elementValue: "02" },
		{ time: "2021-03-02 06:00:00", elementValue: "11" },
		{ time: "2021-03-02 18:00:00", elementValue: "11" },
		{ time: "2021-03-03 06:00:00", elementValue: "09" },
		{ time: "2021-03-03 18:00:00", elementValue: "04" },
		{ time: "2021-03-04 06:00:00", elementValue: "04" },
		{ time: "2021-03-04 18:00:00", elementValue: "04" }],
	weeklyPoP12h: ["20", "20", "20", "10", "10", "0", " ", " ", " ", " ", " ", " ", " ", " "],
	weeklyT: ["26", "20", "20", "17", "21", "18", "23", "20", "21", "17", "19", "17", "22", "20"],
	windSpeed: "2.10"
}

describe('can render waterCard', () => {
	test("should render right location", () => {
		render(<WeatherCard weatherElement={weatherElement} moment={moment} />)

		expect(screen.getByRole('location')).toHaveTextContent(`${weatherElement.locationName}`)
	})

	test("should render correct temperature", () => {
		render(<WeatherCard weatherElement={weatherElement} moment={moment} />)
		expect(screen.getByRole('temperature')).toHaveTextContent(`${Math.round(weatherElement.temperature)}`)
	})

	test("should render correct Description", () => {
		render(<WeatherCard weatherElement={weatherElement} moment={moment} />)
		expect(screen.getByRole('description')).toHaveTextContent(`${weatherElement.description} ${weatherElement.comfortability}`)
	})

	test("should render correct AQI", () => {
		render(<WeatherCard weatherElement={weatherElement} moment={moment} />)
		expect(screen.getByRole('aqi')).toHaveTextContent(`${weatherElement.AQIData}`)
		// expect(screen.getByRole('aqiicon')).toHaveStyle('fill: #f4d160')
	})

	test("should render correct Rain Possibility", () => {
		render(<WeatherCard weatherElement={weatherElement} moment={moment} />)
		expect(screen.getByRole('rainPossibility')).toHaveTextContent(`rainability1.svg ${weatherElement.rainPossibility}%`)
	})

	test("should render correct weatherIcon", () => {
		render(<WeatherCard weatherElement={weatherElement} moment={moment} />)
		expect(screen.getByRole('weatherIcon')).toHaveTextContent(`23 °Cday-cloudy.svg`)
	})

})



