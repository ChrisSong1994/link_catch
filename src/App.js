import React, { useState } from 'react'
import './App.css'
import UrlInput from './components/UrlInput'
import LinkTable from './components/LinkTable'
import DownloadList from './components/DownloadList'
import { Drawer, Button, Icon } from 'antd'
const { dialog } = window.require('electron').remote
// const StreamDownload = require('./module/streamDownload')
const urlCatch = require('./module/urlCatch')

// new StreamDownload({
//   patchUrl:
// 'http://ssl.cdn.turner.com/nba/big/nba/wsc/2020/02/13/34B2D2AED5A3701EDAC035BB15F6B4E72233CBDE.nba_3075160_1920x1080_5904.mp4',
//   baseDir: '/Users/songjun/学习/github/link_catch',
//   fileName: '1.mp4'
// }).downloadFile((type) => {
//   console.log(type)
// })

const App = () => {
  const [linksData, setLinksData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDrawerVisible, setDrawerVisible] = useState(false)

  // 查询连接
  const handleSearch = url => {
    setLoading(true)
    urlCatch(url)
      .then(data => {
        setLinksData(data)
        setLoading(false)
      })
      .catch(err => {
        setLinksData([])
        setLoading(false)
      })
  }

  // 下载视频
  const handleDownload = data => {
    console.log(data,dialog)
    dialog.showOpenDialog({
      properties:['openDirectory'],
      message:'请选择下载路径'
    }).then(result=>{
      console.log(result)
    })
   
  }

  return (
    <div className="App">
      <Button
        className="App-drawer-btn"
        type="primary"
        onClick={() => setDrawerVisible(true)}
      >
        <Icon type="bars" />
      </Button>
      <div className="App-content">
        <span aria-label="cat" role="img">
          {'🐱'}
        </span>
        <UrlInput onSearch={handleSearch} />
        <LinkTable
          data={linksData}
          loading={loading}
          onDownload={handleDownload}
        />
      </div>
      <Drawer
        placement="right"
        width={500}
        closable
        maskClosable
        visible={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
        getContainer={false}
      >
       <DownloadList/>
      </Drawer>
    </div>
  )
}

export default App
