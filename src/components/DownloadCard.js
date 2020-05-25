import React, { useState, useEffect } from 'react';
import { Card, Icon } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const Meta = Card.Meta;

const DownloadCard = ({ downloadInstance, downloadingId, onDownloadChange }) => {
  const [process, setProcess] = useState(0);

  useEffect(() => {
    downloadInstance.registerCallback((type, data) => {
      console.log(type, data);
      if (type === 'process') {
        setProcess(data.process);
      }
      if (['finished', 'pause', 'restart', 'resume'].includes(type)) {
        onDownloadChange();
      }
    });
    return () => {};
  }, [downloadInstance, onDownloadChange]);

  return (
    <Card className="download-card" style={{ margin: '10px 0' }}>
      <Meta
        avatar={<Icon type="play-square" />}
        title={downloadInstance.fileName}
        description={
          <div>
            <p>{`已经下载：${process}%`}</p>
            <p>{`时间：${dayjs(downloadInstance.fileName.date).format('YYYY-MM-DD HH:mm:ss')}`}</p>
            <div className="download-card-btns">
              {downloadInstance.status === '0' ? <Icon type="caret-right" onClick={downloadInstance.resumeDownloadFile} />
              :<Icon type="pause" onClick={downloadInstance.pauseDownloadFile} /> 
            } 
              <Icon type="redo" onClick={downloadInstance.restartDownloadFile} />
              <Icon type="delete" />
            </div>
          </div>
        }
      />
    </Card>
  );
};

DownloadCard.propTypes = {
  downloadInstance: PropTypes.object.isRequired,
  downloadingId: PropTypes.string.isRequired
};

export default DownloadCard;
