import React from 'react';
import { Row, Tabs, Col, Icon } from 'antd';
import PropTypes from 'prop-types';
import DownloadCard from './DownloadCard';

const { TabPane } = Tabs;

const DownloadList = ({ list = [], downloadingId ,onDownloadChange}) => {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <Icon type="thunderbolt" /> {'正在下载 '}
            </span>
          }
          key="1"
        >
          <Row>
            {list
              .filter(item => item.status !== 4)
              .map(item => {
                return (
                  <Col>
                    <DownloadCard key={item.id} downloadInstance={item} downloadingId={downloadingId} onDownloadChange={onDownloadChange} />
                  </Col>
                );
              })}
          </Row>
          <ul></ul>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="check-circle" /> {' 已完成'}
            </span>
          }
          key="2"
        >
          <Row>
            {list
              .filter(item => item.status === 4)
              .map(item => {
                return (
                  <Col>
                    <DownloadCard key={item.id} downloadInstance={item} downloadingId={downloadingId}  onDownloadChange={onDownloadChange} />
                  </Col>
                );
              })}
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

DownloadList.propTypes = {
  list: PropTypes.array.isRequired,
  downloadingId: PropTypes.string.isRequired
};

export default DownloadList;
