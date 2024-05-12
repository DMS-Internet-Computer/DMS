
import { Input, Typography, Button, Modal, Card, Col, Row, Space } from 'antd';
import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
function ProviderRequests(){
  const [modal2Open, setModal2Open] = useState(false);
    return(
      <>
  <Row gutter={24}>
    <Col span={10}>
      <Card title="Requests" bordered={true}>
          <Button onClick={() => setModal2Open(true)}>
            Apply
          </Button>
          <Modal
            title="Provider Request Application"
            centered
            open={modal2Open}
            onOk={() => setModal2Open(false)}
            onCancel={() => setModal2Open(false)}
          >      
            <Typography.Title level={5}>Provider Name: </Typography.Title>
            <Input size="medium" placeholder="Enter your provider name." prefix={<UserOutlined />} />
            <Typography.Title level={5}>Provider Location: </Typography.Title>
            <Input size="medium" placeholder="Country" prefix={<UserOutlined />} />
            <Input size="medium" placeholder="Adress Line 1" prefix={<UserOutlined />} />
            <Input size="medium" placeholder="Adress Line 2" prefix={<UserOutlined />} />
            <Input size="medium" placeholder="City / Town" prefix={<UserOutlined />} />
            <Input size="medium" placeholder="State" prefix={<UserOutlined />} />
            <Input size="medium" placeholder="Zip Code" prefix={<UserOutlined />} />
            <Typography.Title level={5}>Provider Information: </Typography.Title>
            <Input size="medium" placeholder="Official Mail" prefix={<UserOutlined />} />
            <Input size="medium" placeholder="Telephone Number" prefix={<UserOutlined />} />
            <Input size="medium" placeholder="Socials" prefix={<UserOutlined />} />
            <Input size="medium" placeholder="Web Site" prefix={<UserOutlined />} />
          </Modal>
      </Card>
    </Col>
    <Col span={14}>
      <Card title="Waiting Approvals" bordered={true}>
        Card content
      </Card>
    </Col>
  </Row>
      </>
    )
  }

  export default ProviderRequests;