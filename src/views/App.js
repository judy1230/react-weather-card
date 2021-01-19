import React from 'react'
//step1 套入 emotion styled套件套入
import styled from '@emotion/styled'

//step 2 定義帶有styled的component
const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`

function App() {

  return (
    //step3 把定義好的styled-component當成元件使用
    <Container>
      <WeatherCard>
        <h1>weather</h1>
      </WeatherCard>
    </Container>
  )
}

export default App
