import React from 'react'
import styled from '@emotion/styled'
//step 1 : 載入svg圖檔
import { ReactComponent as DayCloudyIcon } from '../images/day-cloudy.svg'

//step 2 : 外圍先包一層div
const IconContainer = styled.div`
	flex-basis: 30%;
	//step 3 : 為svg限制高度
	svg{
		max-height: 110px;
	}
`

const WeatherIcon = () => {
	return (
		<IconContainer>
			<DayCloudyIcon />
		</IconContainer>
	)
}

export default WeatherIcon
