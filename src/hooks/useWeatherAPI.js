//step 1 : 匯入react套件
import React, { useState, useEffect, useCallback } from 'react'

//step 2 : 將原本 fetchWeatherForecast ,fetchCurrentWeather 所需的元素搬進來
const fetchWeatherForecast = ({ baseUrl, forecastWeatherUrl, authorizationKey, cityName }) => {
	return fetch(
		`https://${baseUrl}/${forecastWeatherUrl}Authorization=${authorizationKey}&locationName=${cityName}`
	)
		.then((response) => response.json())
		.then((data) => {
			console.log('data', data)
			const locationData = data.records.locations[0].location[0]
			const weatherElements = locationData.weatherElement.reduce(
				(neededElements, item) => {
					if (['Wx', 'PoP12h', 'MaxCI'].includes(item.elementName)) {
						neededElements[item.elementName] = item.time[0].elementValue
					}
					return neededElements
				},
				{}
			)
			return {
				description: weatherElements.Wx[0].value,
				weatherCode: weatherElements.Wx[1].value,
				rainPossibility: weatherElements.PoP12h[0].value,
				comfortability: weatherElements.MaxCI[0].value,
			}
		})
}


const fetchCurrentWeather = ({ baseUrl, currentWeatherUrl, authorizationKey, locationName }) => {
	console.log('locationName39', locationName)
	console.log('baseUrl', baseUrl)
	console.log(' currentWeatherUrl', currentWeatherUrl)
	return fetch(
		`https://${baseUrl}/${currentWeatherUrl}Authorization=${authorizationKey}&locationName=${locationName}`
	).then((response) => response.json())
		.then((data) => {
			const locationData = data.records.location[0]
			const weatherElements = locationData.weatherElement.reduce(
				(neededElements, item) => {
					if (['WDSD', 'TEMP', 'Weather', 'HUMD'].includes(item.elementName)) {
						neededElements[item.elementName] = item.elementValue
					}
					return neededElements
				},
				{}
			)
			return {
				locationName: locationData.locationName,
				windSpeed: weatherElements.WDSD,
				temperature: weatherElements.TEMP,
				observationTime: locationData.time.obsTime,
			}
		})

}

//step 7 : 變數帶入api
const useWeatherAPI = ({ baseUrl, currentWeatherUrl, forecastWeatherUrl, locationName, cityName, authorizationKey }) => {
	console.log('forecastWeatherUrl', forecastWeatherUrl)
	console.log('locationName66', locationName)
	console.log('baseUrl', baseUrl)
	console.log(' currentWeatherUrl', currentWeatherUrl)
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
			fetchCurrentWeather({ baseUrl,currentWeatherUrl,authorizationKey, locationName}),
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
