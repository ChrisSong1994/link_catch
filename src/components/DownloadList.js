import React, { useState, useEffect } from 'react'
import { Drawer, Tabs, Button, Icon } from 'antd'
import PropTypes from 'prop-types'

const { TabPane } = Tabs

const DownloadList = () => {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane 
         tab={<span><Icon type="thunderbolt" /> 正在下载 </span>}
         key="1"
        >
         正在下载列表
        </TabPane>
        <TabPane
          tab={<span><Icon type="check-circle" /> 已完成 </span>}
          key="2"
        >
       已完成列表
        </TabPane>
        <TabPane
          tab={<span><Icon type="database" /> 历史记录 </span>}
          key="3"
        >
       历史记录列表
        </TabPane>
      </Tabs>
    </div>
  )
}

export default DownloadList
