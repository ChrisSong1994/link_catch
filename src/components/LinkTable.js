import React, { useState, useEffect } from 'react'
import { Table, Button, Icon } from 'antd'
import PropTypes from 'prop-types'
import _ from 'lodash'

const { ipcRenderer, clipboard } = window.require('electron')
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

const LinkTable = ({ data, loading, onDownload }) => {
  const [scrollHight, setScrollHeight] = useState(500)
  const [selectedLinkKeys, setSelectedLinkKeys] = useState([])
  const [selectedLinks, setSelectedLinks] = useState([])


  useEffect(() => {
    setScrollHeight(document.body.offsetHeight - 350)
    ipcRenderer.on('resize', () => {
      setScrollHeight(document.body.offsetHeight - 350)
    })
    return () => {
      ipcRenderer.removeListener('resize')
    }
  }, [])

  const copyLinksToClipboard = () => {
    const selectedLinks = selectedLinkKeys.reduce((result, key) => {
      const linkData = _.find(data, { key })
      if (linkData && linkData.url) {
        result.push(linkData.url)
      }
      return result
    }, [])
    clipboard.writeText(selectedLinks.join('\n'))
  }

  const rowSelection = {
    selectedRowKeys: selectedLinkKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedLinkKeys(selectedRowKeys)
      setSelectedLinks(selectedRows)
    }
  }

  return (
    <div className="result-table-wrap">
      <div className="result-table-content">
        <div className="result-table-button">
          <Button
            type="primary"
            disabled={!selectedLinkKeys.length}
            onClick={copyLinksToClipboard}
          >
            <Icon type="copy" /> 复制
          </Button>

          <Button
            type="primary"
            disabled={!selectedLinkKeys.length}
            onClick={()=> onDownload(selectedLinks)}
          >
            <Icon type="download" /> 下载
          </Button>
        </div>
        <Table
          bordered
          loading={loading}
          scroll={{ y: scrollHight }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={{
            total: data.length,
            defaultPageSize: 20,
            showSizeChanger: true,
            showTotal: total => {
              return `共${total}条`
            }
          }}
        />
      </div>
    </div>
  )
}

LinkTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  onDownload: PropTypes.func.isRequired
}

LinkTable.defaultProps = {
  data: [],
  loading: false
}

export default LinkTable
