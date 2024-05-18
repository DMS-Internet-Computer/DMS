import { Divider, Spin, Modal, Form, Input, Space, Tooltip, Tabs, Card, Button, Layout, Menu, theme, Table, Rate, Calendar } from 'antd';
import React, { useState, useEffect } from 'react';
import { UserOutlined, QuestionCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { DMS_backend } from 'declarations/DMS_backend';
import { ConnectButton, useConnect } from "@connect2ic/react"
import { render } from 'react-dom';

function ManageDoctors() {
  const [modal2Open, setModal2Open] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const { principal } = useConnect({
    onConnect: () => { },
    onDisconnect: () => { }
  });

  useEffect(() => {
    listDoctors();
  }, []);

  async function listProviders() {
    console.log("Listing providers");
    console.log(await DMS_backend.list_providers());
  }

  async function listDoctors() {
    setLoading(true); // Set loading to true when fetching data
    console.log("Listing doctors");
    try {
      const doctors = await DMS_backend.list_doctors(principal, "a");
      setDoctorsList(doctors);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is done
    }
  }

  const departmentColumns = [
    {
      title: 'Doctor Name',
      dataIndex: 'doctor_name',
      key: 'doctor_name',
    },
    {
      title: 'Doctor Department',
      dataIndex: 'doctor_department',
      key: 'doctor_department',
    },
    {
      title: 'Actions',
      dataIndex: 'details',
      render: (text, record) => (
        <Button type="primary">
          Show Details
        </Button>
      )
    }
  ]

  const handleApplyClick = async (values) => {
    console.log(await DMS_backend.add_doctor(principal, values.user_id,  values.doctor_name, values.department_name));
    setModal2Open(false);
    listDoctors();
  };

  return (
    <Card>
      {loading ? ( 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>

          <Button style={{marginBottom: '10px'}} onClick={() => setModal2Open(true)}>
           <PlusCircleOutlined />Add New Doctor
          </Button>
          <Table size="small" dataSource={doctorsList} columns={departmentColumns} />
        </>
      )}

      <Modal
        title="Creating New Department"
        centered
        open={modal2Open}
        onOk={handleApplyClick}
        footer={null}
        onCancel={() => setModal2Open(false)}
      >
        <Form onFinish={handleApplyClick}>
          <Form.Item
            name="user_id"
            rules={[
              {
                required: true,
                message: 'Please enter doctors identity',
              },
            ]}
          >
            <Input placeholder="Enter doctors identity." prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="doctor_name"
            rules={[
              {
                required: true,
                message: 'Please enter doctors name',
              },
            ]}
          >
            <Input placeholder="Enter doctors name." prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="department_name"
            rules={[
              {
                required: true,
                message: 'Please enter doctors department',
              },
            ]}
          >
            <Input placeholder="Enter doctors department name." prefix={<UserOutlined />} />
          </Form.Item>
          <Button htmlType="submit">Add</Button>
        </Form>
      </Modal>
    </Card>
  )
}

export default ManageDoctors;
