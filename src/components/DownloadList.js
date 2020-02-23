import React, { useState, useEffect } from 'react'
import { Drawer, Tabs, Button, Icon } from 'antd'
import PropTypes from 'prop-types'
import DownloadCard from './DownloadCard'

const { TabPane } = Tabs

const DownloadList = ({list, downloadingId}) => {
  debugger
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <Icon type="thunderbolt" /> 正在下载{' '}
            </span>
          }
          key="1"
        >
          正在下载列表
          <ul>
            {list.length &&
              list.map(item => {
                return (
                  <DownloadCard
                    key={item.id}
                    downloadInstance={item}
                    downloadingId={downloadingId}
                  />
                )
              })}
          </ul>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="check-circle" /> 已完成{' '}
            </span>
          }
          key="2"
        >
          已完成列表
        </TabPane>
        {/* <TabPane
          tab={<span><Icon type="database" /> 历史记录 </span>}
          key="3"
        >
       历史记录列表
        </TabPane> */}
      </Tabs>
    </div>
  )
}

DownloadList.propTypes = {
  list: PropTypes.array.isRequired,
  downloadingId: PropTypes.string.isRequired
}

export default DownloadList
