// Editing option for Provider Requests.
// More Information on Provider Requests (Details) - Provider Location - Uploading Certain Documents etc.
// Provider Requests will be send some amount of users and will wait their acceptance. And status will be showed on the status bar like 
// Waitin for Approval 2/11. This improvement will be done.
// Approved and Declined Requests need to inform users. If an request approved user will have a notification, same for the decline status.

import { Input, Typography, Form, Button, Table, Modal, Card, Col, Row, Space, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { UserOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { DMS_backend } from 'declarations/DMS_backend';
import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react";

function ProviderRequests() {
  const [modal2Open, setModal2Open] = useState(false);
  const [providerName, setProviderName] = useState("");
  const [requests, setRequests] = useState([]); 
  const [selfProviderRequets, setSelfProviderRequests] = useState([]);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    listProviderRequests();
  }, []);

  const listProviderRequests = async () => {
    setLoading(true); 
    try {
      const requestsData = await DMS_backend.list_provider_requests();
      const otherRequestData = requestsData.filter(request => request.provider_id !== principal);
      const selfRequestData = requestsData.filter(request => request.provider_id === principal);
      console.log(otherRequestData);
      console.log(selfRequestData);
      setSelfProviderRequests(selfRequestData);
      setRequests(otherRequestData);
    } catch (error) {
      console.error("Error fetching provider requests:", error);
    } finally {
      setLoading(false); 
    }
  }

  const updateRequestStatus = async (record, status) => {
    try {
      await DMS_backend.update_provider_request(record.provider_id, status);
      listProviderRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const handleApplyClick = async (values) => {
        console.log(await DMS_backend.create_provider_request(principal, values.provider_name));
    listProviderRequests();
    setModal2Open(false);
  };

  const { principal } = useConnect({
    onConnect: () => { },
    onDisconnect: () => { }
  });

  const self_request_columns = [
    {
      title: 'Provider ID',
      dataIndex: 'provider_id',
      key: 'provider_id',
      render: (text) => <span>{text.slice(0, 10)}</span>,
    },
    {
      title: 'Provider Name',
      dataIndex: 'provider_name',
      key: 'provider_name',
    },
    {
      title: 'Request Status',
      dataIndex: 'request_status',
      key: 'request_status',
      render: (text, record) => (
        <Space size="middle">
          {text === 0 ? <span>Waiting Approval</span> : text === 1 ? <span><CheckCircleTwoTone twoToneColor="#52c41a" /> Accepted</span> : <span> <CloseCircleTwoTone twoToneColor="#ff3d00" /> Rejected</span>}
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: () => <>
        <Space size="middle">
          <Button icon={<CloseCircleTwoTone twoToneColor="#ff3d00" />}>Cancel</Button>
        </Space>
      </>,
    },
  ];

  const columns = [
    {
      title: 'Provider ID',
      dataIndex: 'provider_id',
      key: 'provider_id',
      render: (text) => <span>{text.slice(0, 11)}</span>,
    },
    {
      title: 'Provider Name',
      dataIndex: 'provider_name',
      key: 'provider_name',
    },
    {
      title: 'Approval',
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} onClick={() => { updateRequestStatus(record, 1) }}>Approve</Button>
          <Button icon={<CloseCircleTwoTone twoToneColor="#ff3d00" />} onClick={() => { updateRequestStatus(record, 2) }}>Decline</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={24}>
        <Col span={10}>
          <Card title="My Requests" bordered={true}>
            {loading ? ( 
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                <Table
                  columns={self_request_columns}
                  pagination={false}
                  expandable={{
                    expandedRowRender: (record) => (
                      <p
                        style={{
                          margin: 0,
                        }}
                      >
                        {/* {record.description} */}
                        Request details will be added.
                      </p>
                    ),
                    rowExpandable: (record) => record.name !== 'Not Expandable',
                  }}
                  dataSource={selfProviderRequets}
                />
                <Button style={{marginTop: '10px'}}onClick={() => setModal2Open(true)}>
                  Apply
                </Button>
                <Modal
                  title="Creating Provider Request"
                  centered
                  open={modal2Open}
                  onOk={handleApplyClick}
                  footer={null}
                  onCancel={() => setModal2Open(false)}
                >
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
                      <Input placeholder="Enter your provider name." prefix={<UserOutlined />} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Apply</Button>
                  </Form>
                </Modal>
              </>
            )}
          </Card>
        </Col>
        <Col span={14}>
        <Card title="Waiting Approvals" bordered={true}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <Table
                columns={columns}
                expandable={{
                  expandedRowRender: (record) => (
                    <p
                      style={{
                        margin: 0,
                      }}
                    >
                      {/* {record.description} */}
                      Request details will be added.
                    </p>
                  ),
                  rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
                dataSource={requests}
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ProviderRequests;