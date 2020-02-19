import React from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'

const { Search } = Input

const UrlInput = ({onSearch}) => {
  const handleSearch = url => {
    onSearch(url)
  }

  return (
    <div style={{ width: '50%', marginBottom: 20 }}>
      <Search
        placeholder="请输入地址"
        enterButton="查询"
        size="large"
        onSearch={value => handleSearch(value)}
      />
    </div>
  )
}

UrlInput.propTypes = {
  onSearch: PropTypes.func.isRequired
}

export default UrlInput
