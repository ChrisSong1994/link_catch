import React from 'react'
import { Input } from 'antd';

const {  ipcRenderer } = window.require('electron')
const { Search } = Input;

const UrlInput = () => {

  const handleSearch = url => {
    ipcRenderer.send('catch-url',url)
  }

  return (
    <div style={{width:'50%',marginBottom:20}}>
     <Search
      placeholder="请输入地址"
      enterButton="查询"
      size="large"
      onSearch={value => handleSearch(value)}
    />
    </div>
  )
}

export default UrlInput
