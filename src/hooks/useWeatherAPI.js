import React, { useState, useEffect, useCallback } from 'react'

const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
	return fetch(
		`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
	)
		.then((response) => response.json())
		.then((data) => {
			const locationData = data.records.location[0]
			const weatherElements = locationData.weatherElement.reduce(
				(neededElements, item) => {
					if (['WDSD', 'TEMP'].includes(item.elementName)) {
						neededElements[item.elementName] = item.elementValue
					}
					return neededElements
				},
				{}
			);

			return {
				observationTime: locationData.time.obsTime,
				locationName: locationData.locationName,
				temperature: weatherElements.TEMP,
				windSpeed: weatherElements.WDSD,
			}
		})
}

const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
	return fetch(
		`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
	)
		.then((response) => response.json())
		.then((data) => {
			const locationData = data.records.location[0]
			const weatherElements = locationData.weatherElement.reduce(
				(neededElements, item) => {
					if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
						neededElements[item.elementName] = item.time[0].parameter;
					}
					return neededElements
				},
				{}
			)
			const predicationData = locationData.weatherElement.reduce(
				(neededElements, item) => {
					if (['MaxT'].includes(item.elementName)) {
						neededElements[item.elementName] = item.time
					}
					return neededElements
				},
				{}
			)
			const predicationTemps = predicationData.MaxT.flatMap(item => item.parameter.parameterName)

			return {
				description: weatherElements.Wx.parameterName,
				weatherCode: weatherElements.Wx.parameterValue,
				rainPossibility: weatherElements.PoP.parameterName,
				comfortability: weatherElements.CI.parameterName,
				predicationTemps: predicationTemps
			}
		})
}

const fetchWeeklyWeather = ({ authorizationKey, cityName }) => {
	return fetch(
		`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-003?Authorization=${authorizationKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			let cityName = '宜蘭市'
			const locationData = data.records.locations[0].location.filter(city => city.locationName == cityName)
			const weeklyWeather = locationData[0].weatherElement.reduce(
				(neededElements, item) => {
					if (['Wx', 'PoP12h', 'T'].includes(item.elementName)) {
						neededElements[item.elementName] = item.time;
					}
					return neededElements
				},
				{}
			)
			console.log('weeklyWeather', weeklyWeather)
			const WeatherCodes = weeklyWeather.Wx.flatMap(item => item.elementValue[1].value)
			const weeklyPoP12h = weeklyWeather.PoP12h.flatMap(item => item.elementValue[0].value)
			const weeklyT = weeklyWeather.T.flatMap(item => item.elementValue[0].value)



			return {
				weatherCodes: WeatherCodes,
				weeklyPoP12h: weeklyPoP12h,
				weeklyT: weeklyT,
			}
		})
}

const useWeatherAPI = ({ baseUrl, currentWeatherUrl, forecastWeatherUrl, locationName, cityName, authorizationKey }) => {
	const [weatherElement, setWeatherElement] = useState({
		observationTime: new Date(),
		locationName: '',
		temperature: 0,
		windSpeed: 0,
		description: '',
		// weatherCode: 0,
		rainPossibility: 0,
		comfortability: '',
		isLoading: true,
		predicationTemps: [],
		weatherCodes: [],
		weeklyPoP12h: [],
		weeklyT:[]
	})
	const fetchData = useCallback(async () => {
		setWeatherElement((prevState) => ({
			...prevState,
			isLoading: true,
		}))
		const [currentWeather, weatherForecast, weeklyWeather ] = await Promise.all([
			fetchCurrentWeather({ baseUrl, currentWeatherUrl, authorizationKey, locationName}),
			fetchWeatherForecast({ baseUrl, forecastWeatherUrl, authorizationKey, cityName }),
			fetchWeeklyWeather({  authorizationKey, cityName }),
		])

		setWeatherElement({
			...currentWeather,
			...weatherForecast,
			...weeklyWeather,
			isLoading: false,
		})
	}, [authorizationKey, locationName, cityName])

	useEffect(() => {
		fetchData()
	}, [fetchData])
	return [weatherElement, fetchData]
}

export default useWeatherAPI
