import React, { useState, useEffect } from 'react'
import { Table } from 'antd'

const { remote, ipcRenderer } = window.require('electron')
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
  const [linkData, setLinkData] = useState([])
  const [loading, setLoading] = useState(false)
  const [scrollHight, setScrollHeight] = useState(500)

  useEffect(() => {
    setScrollHeight(document.body.offsetHeight - 300)

    ipcRenderer.on('catch-data', (event, res) => {
      const shareObject = remote.getGlobal('sharedObject')
      if (res) setLinkData(shareObject.linkData)
    })

    ipcRenderer.on('catch-state', (even, bool) => {
      setLoading(bool)
    })

    ipcRenderer.on('resize', () => {
      setScrollHeight(document.body.offsetHeight - 300)
    })

    return () => {
      ipcRenderer.removeListener('catch-data')
    }
  }, [])

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      )
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name
    })
  }

  return (
    <div style={{ width: '80%' }}>
      {/* <Button type="primary"> 复制 </Button> */}
      <div style={{ background: '#fff' }}>
        <Table
          bordered
          loading={loading}
          scroll={{ y: scrollHight }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={linkData}
          pagination={{
            total:linkData.length,
            defaultPageSize:20,
            showSizeChanger:true,
            showTotal:(total)=>{
              return `共${total}条`
            }
          }}
        />
      </div>
    </div>
  )
}

export default ResultTable
