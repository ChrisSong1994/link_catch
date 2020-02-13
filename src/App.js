import React, { useState } from 'react'
import './App.css'
import UrlInput from './components/UrlInput'

function App() {
  const [inputUrl, setInputUrl] = useState('')
  // const [dataList,setDataList]=useState([])

  const handleSearch = url => {
    setInputUrl(url)
    
  }
  return (
    <div className="App">
      <header className="App-header">
        <span aria-label="cat" role="img">
          🐱
        </span>
        <UrlInput value={inputUrl} onSearch={handleSearch} />
      </header>
    </div>
  )
}

export default App
