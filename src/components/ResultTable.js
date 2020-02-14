import React, { useState, useEffect } from 'react'
import { Table } from 'antd';

const { remote, ipcRenderer } = window.require('electron')


const ResultTable = () => {
    // 声明一个新的叫做 “count” 的 state 变量
    const [linkData, setLinkData] = useState([])

    useEffect(() => {
        ipcRenderer.on('catch-data', (event, res) => {
            const shareObject = remote.getGlobal('sharedObject')
            if (res) setLinkData(shareObject.linkData)
        })
        return () => {
            ipcRenderer.removeListener('catch-data')
        }
    }, [])

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            width:'30%'
        },
        {
            title: '地址',
            dataIndex: 'url',
            width:'30%'
        }
    ];

    return (
        <div style={{width:'80%',background:'#fff',padding:'20'}}>
            <Table
            bordered
                columns={columns}
                dataSource={linkData}
            />
        </div>
    )
}

export default ResultTable
