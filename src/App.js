import React, { useState, useEffect } from 'react';
import './App.css';
import UrlInput from './components/UrlInput';
import LinkTable from './components/LinkTable';
import DownloadList from './components/DownloadList';
import { Drawer, Button, Icon } from 'antd';
import _ from 'lodash';
const { dialog } = window.require('electron').remote;
const StreamDownload = require('./module/streamDownload');
const urlCatch = require('./module/urlCatch');

// http://www.txzqw.me/read-htm-tid-357213.html

const App = () => {
  const [linksData, setLinksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [downloadStack, setDownloadStack] = useState([]); // 用一个数组作为下载队列
  const [downloadingId, setDownloadingId] = useState(''); // 设置选中下载的id

  // 查询连接
  const handleSearch = url => {
    setLoading(true);
    urlCatch(url)
      .then(data => {
        setLinksData(data);
        setLoading(false);
      })
      .catch(err => {
        setLinksData([]);
        setLoading(false);
      });
  };

  // 下载视频
  const handleDownload = data => {
    dialog
      .showOpenDialog({
        properties: ['openDirectory'],
        message: '请选择下载路径'
      })
      .then(result => {
        const downloadDir = result.filePaths[0];
        console.log(data, downloadDir);

        const dlstack = _.clone(downloadStack);
        for (let downloadInfo of data) {
          dlstack.push(
            new StreamDownload({
              id: downloadInfo.key,
              patchUrl: downloadInfo.url,
              baseDir: downloadDir,
              fileName: `${downloadInfo.title}.mp4`
            })
          );
        }
        setDownloadStack(dlstack);
      });
  };

  useEffect(() => {
    handleDownloadStackChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadStack]);

  // 监听下载列表的改变
  const handleDownloadStackChange = () => {
    if (_.isEmpty(downloadStack)) return;
    let index = 0;
    while (downloadStack[index].status !== '0') {
      ++index;
    }
    downloadStack[index].downloadFile();
    setDownloadingId(downloadStack[index].id);
  };

  return (
    <div className="App">
      <Button className="App-drawer-btn" type="primary" onClick={() => setDrawerVisible(true)}>
        <Icon type="bars" />
      </Button>
      <div className="App-content">
        <span aria-label="cat" role="img">
          {'🐱'}
        </span>
        <UrlInput onSearch={handleSearch} />
        <LinkTable data={linksData} loading={loading} onDownload={handleDownload} />
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
        <DownloadList list={downloadStack} downloadingId={downloadingId} onDownloadChange={handleDownloadStackChange} />
      </Drawer>
    </div>
  );
};

export default App;
