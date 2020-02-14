import React from 'react'
import UrlInput from './components/UrlInput'
import ReastTable from './components/ResultTable'
import './App.css'


function App() {
  return (
    <div className="App">
      <header className="App-content">
        <span aria-label="cat" role="img"> 🐱 </span>
        <UrlInput  />
        <ReastTable />
      </header>
    </div>
  )
}

export default App
