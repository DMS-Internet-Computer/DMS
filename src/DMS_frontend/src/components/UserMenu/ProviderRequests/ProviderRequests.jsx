
import { Input, Typography, Form, Button, Table, Modal, Card, Col, Row, Space } from 'antd';
import React, { useState
  ,useEffect
 } from 'react';
import { UserOutlined, CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
import { DMS_backend } from 'declarations/DMS_backend';
import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react"
// Editing option for Provider Requests.
// More Information on Provider Requests - Provider Location - Uploading Certain Documents etc.
// Provider Requests will be send some amount of users and will wait their acceptance. And status will be showed on the status bar like 
// Waitin for Approval 2/11. This improvement will be done.
// Approved and Declined Requests need to inform users. If an request approved user will have a notification, same for the decline status.

function ProviderRequests() {
  const [modal2Open, setModal2Open] = useState(false);
  const [providerName, setProviderName] = useState(""); // State for provider name input
  const [requests, setRequests] = useState([]); // State for provider requests
  const [selfProviderRequets, setSelfProviderRequests] = useState([]); // State for other provider requests

  useEffect(() => {
    listProviderRequests();
  }, []);

  const listProviderRequests = async () => {
    try {
      const requestsData = await DMS_backend.list_provider_requests();
      const otherRequestData = requestsData.filter(request => request.provider_id !== principal);
      const selfRequestData = requestsData.filter(request  => request.provider_id === principal);
      console.log(otherRequestData);
      console.log(selfRequestData);
      setSelfProviderRequests(selfRequestData);
      setRequests(otherRequestData);
    } catch (error) {
      console.error("Error fetching provider requests:", error);
    }
  }

  const updateRequestStatus = async (record, status) => {
    try {
      await DMS_backend.update_provider_request(record.provider_id, status);
      // If the update is successful, fetch the updated list of requests and update the state
      listProviderRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      // Optionally, you can display an error message to the user or handle the error in another way
    }
  };

  const handleApplyClick = async (values) => {
    // Call create_provider_request function with the provider name input value
    console.log(await DMS_backend.create_provider_request(principal, values.provider_name));
    listProviderRequests();
    setModal2Open(false);
  };

  const { principal } = useConnect({
    onConnect: () => {},
    onDisconnect: () => {}
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
          {text === 0 ? <span>Waiting Approval</span> : text === 1 ? <span>Accepted</span> : <span>Rejected</span>}
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
          <Button icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} onClick={() => {updateRequestStatus(record, 1)}}>Approve</Button>
          <Button icon={<CloseCircleTwoTone twoToneColor="#ff3d00" />} onClick={() => {updateRequestStatus(record, 2)}}>Decline</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={24}>
        <Col span={10}>
          <Card title="My Requests" bordered={true}>
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
                    {record.description}
                  </p>
                ),
                rowExpandable: (record) => record.name !== 'Not Expandable',
              }}
              dataSource={selfProviderRequets}
            />
            <Button onClick={() => setModal2Open(true)}>
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
                  {/* <Typography.Title level={5}>Provider Name: </Typography.Title> */}
                  <Input placeholder="Enter your provider name." prefix={<UserOutlined />}></Input>
                </Form.Item>
                <Button type="primary" htmlType="submit">Apply</Button>
              </Form>

            </Modal>
          </Card>
        </Col>
        <Col span={14}>
          <Card title="Waiting Approvals" bordered={true}>
            <Table
              columns={columns}
              expandable={{
                expandedRowRender: (record) => (
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    {record.description}
                  </p>
                ),
                rowExpandable: (record) => record.name !== 'Not Expandable',
              }}
              dataSource={requests}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ProviderRequests;