import React, { useState, useEffect } from 'react'
import { Table, Button } from 'antd'
import _ from  'lodash' 

const { remote, ipcRenderer ,clipboard} = window.require('electron')
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: '40%'
  },
  {
    title: '地址',
    dataIndex: 'url',
    key: 'url',
    width: '60%'
  }
]

const ResultTable = () => {
  // 声明一个新的叫做 “count” 的 state 变量
  const [linksData, setLinksData] = useState([])
  const [loading, setLoading] = useState(false)
  const [scrollHight, setScrollHeight] = useState(500)
  const [selectedLinkKeys, setSelectedLinkKeys] = useState([])

  useEffect(() => {
    setScrollHeight(document.body.offsetHeight - 350)

    ipcRenderer.on('catch-data', (event, res) => {
      const shareObject = remote.getGlobal('sharedObject')
      if (res) setLinksData(shareObject.linkData)
    })

    ipcRenderer.on('catch-state', (even, bool) => {
      setLoading(bool)
    })

    ipcRenderer.on('resize', () => {
      setScrollHeight(document.body.offsetHeight - 350)
    })

    return () => {
      ipcRenderer.removeListener('catch-data')
    }
  }, [])

  const copyLinksToClipboard=()=>{
    const selectedLinks= selectedLinkKeys.reduce((result,key)=>{
      const linkData=_.find(linksData,{key})
     if(linkData&&linkData.url){
       result.push(linkData.url)
     }
     return result
    },[])
    clipboard.writeText(selectedLinks.join('\n'))
    console.log(selectedLinks)
  }

  const rowSelection = {
    selectedRowKeys: selectedLinkKeys,
    onChange: (selectedRowKeys) => {
      setSelectedLinkKeys(selectedRowKeys)
    }
  }

  return (
    <div className="result-table-wrap" >
      <div className="result-table-content" >
        <div className="result-table-button">
          <Button 
          type="primary"  
          disabled={!selectedLinkKeys.length}
          onClick={copyLinksToClipboard}>复制连接</Button>
          <Button 
          type="primary" 
          disabled={!selectedLinkKeys.length}>导出Excel</Button>
        </div>

        <Table
          bordered
          loading={loading}
          scroll={{ y: scrollHight }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={linksData}
          pagination={{
            total: linksData.length,
            defaultPageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => {
              return `共${total}条`
            }
          }}
        />

      </div>
    </div>
  )
}

export default ResultTable
