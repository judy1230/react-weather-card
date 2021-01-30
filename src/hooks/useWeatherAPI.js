//step 1 : 匯入react套件
import React, { useState, useEffect, useCallback } from 'react'

//step 2 : 將原本 fetchWeatherForecast ,fetchCurrentWeather 所需的元素搬進來
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

			return {
				description: weatherElements.Wx.parameterName,
				weatherCode: weatherElements.Wx.parameterValue,
				rainPossibility: weatherElements.PoP.parameterName,
				comfortability: weatherElements.CI.parameterName,
			}
		})
}

//step 7 : 變數帶入api
const useWeatherAPI = ({ baseUrl, currentWeatherUrl, forecastWeatherUrl, locationName, cityName, authorizationKey }) => {
	// step 3 : useState 中用來定義 weatherElement 的部分
	const [weatherElement, setWeatherElement] = useState({
		observationTime: new Date(),
		locationName: '',
		temperature: 0,
		windSpeed: 0,
		description: '',
		weatherCode: 0,
		rainPossibility: 0,
		comfortability: '',
		isLoading: true
	})
	//step 4 : 透過useCallback來定義 fetchData() 的部分
	const fetchData = useCallback(async () => {
		setWeatherElement((prevState) => ({
			...prevState,
			isLoading: true,
		}))
		//step 8 : 把 authorizationKey, locationName, cityName 傳到api中
		const [currentWeather, weatherForecast] = await Promise.all([
			fetchCurrentWeather({ baseUrl, currentWeatherUrl, authorizationKey, locationName}),
			fetchWeatherForecast({ baseUrl,forecastWeatherUrl, authorizationKey, cityName }),
		])

		setWeatherElement({
			...currentWeather,
			...weatherForecast,
			isLoading: false,
		})
		// step 9 : 在useCallback中把變數放入dependencies array中
	}, [authorizationKey, locationName, cityName])
	//step 5 : 透過 useEffect 用來呼叫 fetchData 的部分
	useEffect(() => {
		fetchData()
	}, [fetchData])
	//step 6 : 回傳要讓其他元件使用的資料或方法
	return [weatherElement, fetchData]
}

export default useWeatherAPI
