import { Divider, Spin, Modal, Form, Input, Space, Tabs, Card, Button, Layout, Menu, theme, Table, Rate, Calendar } from 'antd';
import React, { useState
  ,useEffect
 } from 'react';
 import { UserOutlined, CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
 import { DMS_backend } from 'declarations/DMS_backend';
 import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react"

function ManageDepartments(){
  const [modal2Open, setModal2Open] = useState(false);
  const { principal } = useConnect({
    onConnect: () => {},
    onDisconnect: () => {}
  });

async function listProviders(){
   console.log("Listing providers");
   console.log(await DMS_backend.list_providers());
}

async function listDepartments(){
  console.log("Listing departments");
  console.log(await DMS_backend.list_departments(principal));
}

const departmentColumns = [
    {
        title: 'Department Name',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Doctor Number',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: 'Active Appointments',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Actions',
        dataIndex: 'details',
        render: () => <Button type="primary">
        Show More
      </Button>,
      }
]
const departmentsList = [];


const handleApplyClick = async (values) => {
  // Call create_provider_request function with the provider name input value
  console.log(await DMS_backend.add_department(principal, values.department_name));
  //listProviderRequests();
  setModal2Open(false);
};

 return (
    <Card>
        <Table size="small" dataSource={departmentsList} columns={departmentColumns}/>
        <Button onClick={() => setModal2Open(true)}>
                Add New Department
        </Button>
        <Button onClick={() => listProviders()}>List Providers</Button>
        <Button onClick={() => listDepartments()}>List Providers</Button>

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
                  name="department_name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter department name',
                    },
                  ]}
                >
                  {/* <Typography.Title level={5}>Provider Name: </Typography.Title> */}
                  <Input placeholder="Enter department name." prefix={<UserOutlined />}></Input>
                </Form.Item>
                <Button type="primary" htmlType="submit">Apply</Button>
        </Form>
        </Modal>
    </Card>
 )
}

export default ManageDepartments;