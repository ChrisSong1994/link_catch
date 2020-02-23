import React, { useState, useEffect } from 'react'
import { Drawer, Tabs, Button, Icon } from 'antd'
import PropTypes from 'prop-types'

const DownloadCard = ({ downloadInstance, downloadingId }) => {
  const [process, setProcess] = useState(0)

  useEffect(() => {
    debugger
    downloadInstance.registerCallback((type, data) => {
      console.log(type, data)
      if(type==='process'){
        setProcess(data.process)
      }
    })
    return () => {}
  }, [downloadInstance])

  return (
    <li>
      <p>{downloadInstance.fileName}</p>
      <p>{`已经下载：${process}`}</p>
    </li>
  )
}
DownloadCard.propTypes = {
  downloadInstance: PropTypes.object.isRequired,
  downloadingId: PropTypes.string.isRequired
}

export default DownloadCard
