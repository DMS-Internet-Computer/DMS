
import { Input, Typography, Form, Button, Modal, Card, Col, Row, Space } from 'antd';
import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { DMS_backend } from 'declarations/DMS_backend';
import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react"

function ProviderRequests() {
  const [modal2Open, setModal2Open] = useState(false);
  const [providerName, setProviderName] = useState(""); // State for provider name input

  const listProviderRequests = async () => {
    console.log(await DMS_backend.list_provider_requests());
  }

  const handleApplyClick = async (values) => {
    // Call create_provider_request function with the provider name input value
    console.log(await DMS_backend.create_provider_request(principal, values.provider_name));
    listProviderRequests();
    setModal2Open(false);
  };

  const {principal} = useConnect({
    onConnect: () => {
    },
    onDisconnect: () => {
    }
  });
  return (
    <>
      <Row gutter={24}>
        <Col span={10}>
          <Card title="Requests" bordered={true}>
            <Button onClick={() => setModal2Open(true)}>
              Apply
            </Button>
            <Modal
              title="Creating Provider Request"
              centered
              open={modal2Open}
              onOk={handleApplyClick}
              onCancel={() => setModal2Open(false)}
            >
              {/* <Typography.Title level={5}>Provider Location: </Typography.Title>
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
            <Input size="medium" placeholder="Web Site" prefix={<UserOutlined />} /> */}
              <Form onFinish={handleApplyClick}>
                <Form.Item
                  name="provider_name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Provider Name',
                    },
                  ]}
                >
                  <Typography.Title level={5}>Provider Name: </Typography.Title>
                  <Input placeholder="Enter your provider name." prefix={<UserOutlined />}></Input>
                </Form.Item>
                <Button type="primary" htmlType="submit">Apply</Button>
              </Form>

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