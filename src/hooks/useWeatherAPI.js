import React, { useState, useEffect, useCallback } from 'react'

const fetchCurrentWeather = ({ authorizationKey, currentWeatherUrl, locationName }) => {
	return fetch(
		`https://opendata.cwb.gov.tw/api/${currentWeatherUrl}?Authorization=${authorizationKey}&locationName=${locationName}`
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

const fetchWeatherForecast = ({ authorizationKey, forecastWeatherUrl, cityName }) => {
	return fetch(
		`https://opendata.cwb.gov.tw/api/${forecastWeatherUrl}Authorization=${authorizationKey}&locationName=${cityName}`
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

const fetchWeeklyWeather = ({ authorizationKey, cityName, weeklyWeatherUrl }) => {
	console.log('weeklyWeatherUrl', weeklyWeatherUrl)
	return fetch(
		`https://opendata.cwb.gov.tw/api${weeklyWeatherUrl}?Authorization=${authorizationKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			const locationData = data.records.locations[0].location.filter(city => city.locationName.indexOf(cityName))
			console.log('locationData',locationData)
			const weeklyWeather = locationData[0].weatherElement.reduce(
				(neededElements, item) => {
					if (['Wx', 'PoP12h', 'T'].includes(item.elementName)) {
						neededElements[item.elementName] = item.time;
					}
					return neededElements
				},
				{}
			)

			const WeatherCodes = weeklyWeather.Wx.flatMap(item => {
				const needElements = {
					time: item.startTime,
					elementValue: item.elementValue[1].value
				}
				return needElements
			})
			const weeklyPoP12h = weeklyWeather.PoP12h.flatMap(item => item.elementValue[0].value)
			const weeklyT = weeklyWeather.T.flatMap(item => item.elementValue[0].value)

			return {
				weatherCodes: WeatherCodes,
				weatherCode: WeatherCodes[0].elementValue,
				weeklyPoP12h: weeklyPoP12h,
				weeklyT: weeklyT,
			}
		})
}
const fetchAQI = ({ AQIKEY, cityName }) => {
	return fetch(`https://data.epa.gov.tw/api/v1/aqx_p_432?limit=1000&api_key=${AQIKEY}&format=json`)
		.then((response) => response.json())
		.then((data) => {
			const locationData = data.records.filter(item => item.County == cityName)
			const AQIData = locationData[0]['Status']
			return AQIData
		})
}


const useWeatherAPI = ({ baseUrl, currentWeatherUrl, forecastWeatherUrl, weeklyWeatherUrl, locationName, cityName, authorizationKey, AQIKEY }) => {
	console.log('currentWeatherUrl', currentWeatherUrl)
	console.log('forecastWeatherUrl',forecastWeatherUrl)
	const [weatherElement, setWeatherElement] = useState({
		observationTime: new Date(),
		locationName: '',
		temperature: 0,
		windSpeed: 0,
		description: '',
		rainPossibility: 0,
		comfortability: '',
		isLoading: true,
		weatherCode:'',
		predicationTemps: [],
		weatherCodes: [],
		weeklyPoP12h: [],
		weeklyT: [],
		AQIData:''
	})
	const fetchData = useCallback(async () => {
		setWeatherElement((prevState) => ({
			...prevState,
			isLoading: true,
		}))
		const [currentWeather, weatherForecast, weeklyWeather, AQIData ] = await Promise.all([
			fetchCurrentWeather({ baseUrl, currentWeatherUrl, authorizationKey, locationName}),
			fetchWeatherForecast({ baseUrl, forecastWeatherUrl, authorizationKey, cityName }),
			fetchWeeklyWeather({ authorizationKey, cityName, weeklyWeatherUrl }),
			fetchAQI({ AQIKEY, cityName})
		])

		setWeatherElement({
			...currentWeather,
			...weatherForecast,
			...weeklyWeather,
			AQIData,
			isLoading: false,
		})
	}, [authorizationKey, locationName, cityName])

	useEffect(() => {
		fetchData()
	}, [fetchData])
	return [weatherElement, fetchData]
}

export default useWeatherAPI
