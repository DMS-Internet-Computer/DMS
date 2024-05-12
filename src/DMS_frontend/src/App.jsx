import { useEffect, useState } from 'react';
import { DMS_backend } from 'declarations/DMS_backend';
import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  ExperimentOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';

import { Divider, Spin, Space, Tabs, Card, Button, Layout, Menu, theme, Table, Rate, Calendar } from 'antd';
import ImgCrop from 'antd-img-crop';
// UserMenu
import SmartAssistant from './components/UserMenu/SmartAssistant/SmartAssistant';
import Visits from './components/UserMenu/Visits/Visits';
import Prescriptions from './components/UserMenu/Prescriptions/Prescriptions';
import Reports from './components/UserMenu/Reports/Reports';
import Diseases from './components/UserMenu/Diseases/Diseases';
import Tests from './components/UserMenu/Tests/Tests';
import RadiologicalImages from './components/UserMenu/RadiologicalImages/RadiologicalImages';
import Allergies from './components/UserMenu/Allergies/Allergies';
import Medications from './components/UserMenu/Medications/Medications';
import Appointments from './components/UserMenu/Appointment/Appointments';
import ProviderRequests from './components/UserMenu/ProviderRequests/ProviderRequests';
import UserProfile from './components/Profile/UserProfile';
import { render } from 'react-dom';

const { Header, Sider, Content } = Layout;

function App() {
  const [spinning, setSpinning] = useState(false);
  const { isConnected, principal } = useConnect({
    onConnect: () => {
    },
    onDisconnect: () => {
    }
  });
  useEffect(() => {
    const createUser = async () => {
      try {
        if (!principal) {
          setSpinning(true);
          console.log("Waiting for principal...");
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log("Creating user...");
        await DMS_backend.create_user(principal);
        console.log("User created.");
      } catch (error) {
        console.error("Error during user creation:", error);
      } finally {
        setSpinning(false);
      }
    };

    if (isConnected) {
      createUser();
    }
  }, [isConnected, principal]);


  function LoginPage() {
    return (
      <div className="login-page">
        <div className="login-page-left">
          <p>Login Page - 3D Animation Part</p>
        </div>
        <div className="login-page-right">
          <p>Login Page - Authentication Part</p>
          <ConnectButton />
          <ConnectDialog />
        </div>
      </div>
    );
  }

  async function listActiveSession() {
    console.log(await DMS_backend.list_active_sessions());
  }

  function ActiveAppointments() {
    const data = [];
    for (let i = 0; i < 2; ++i) {
      data.push({
        key: i.toString(),
        provider: 'A Hospital',
        department: 'Department A',
        doctor: 'A Doctor',
        appointmentId: 500,
        date: '2014-12-24 23:12:00',
      });
    }


    const columns = [
      {
        title: 'Provider',
        dataIndex: 'provider',
        key: 'provider',
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: 'Doctor',
        dataIndex: 'doctor',
        key: 'doctor',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Actions',
        key: 'Actions',
        render: () => <Rate />
      },
      {
        title: 'Details',
        key: 'details',
        render: () => <Button>Details</Button>
      },
    ];
    return (
      <>
        <Table
          columns={columns}
          dataSource={data}
          size="small"
        />
      </>
    )
  }

  function LastAppointments() {
    const [selectedPage, setSelectedPage] = useState(1);

    const data = [];
    for (let i = 0; i < 2; ++i) {
      data.push({
        key: i.toString(),
        provider: 'A Hospital',
        department: 'Department A',
        doctor: 'A Doctor',
        appointmentId: 500,
        date: '2014-12-24 23:12:00',
      });
    }


    const columns = [
      {
        title: 'Provider',
        dataIndex: 'provider',
        key: 'provider',
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: 'Doctor',
        dataIndex: 'doctor',
        key: 'doctor',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Evaluate',
        key: 'evaluate',
        render: () => <Rate />
      },
      {
        title: 'Details',
        key: 'details',
        render: () => <Button>Details</Button>
      },
    ];
    return (
      <>
        <Table
          columns={columns}
          dataSource={data}
          size="small"
        />
      </>
    )
  }
  function MainContent() {
    return (
      <>
        <div className='main-sections'>
          <Card className='details-section'>
            <Tabs
              //onChange={onChange}
              type="card"
              items={[{ label: "Smart Assistant", key: 1, children: <SmartAssistant /> }]}
            />
          </Card>
          <Space size={"large"} />
          <Card className='appointment-section'>
            <Tabs
              //onChange={onChange}
              type="card"
              items={[{ label: "Active Appointments", key: 1, children: <ActiveAppointments /> }, { label: "Last Appointments", key: 2, children: <LastAppointments /> }]}
            />
          </Card>
          <button onClick={listActiveSession}>Sessions</button>
        </div>
      </>
    )
  }

  function MainPage() {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const onChange = (key) => { };
    const [selectedPage, setSelectedPage] = useState(1);

    let userIsDoctor = false;
    let userIsProvider = false;
    let MenuItems = [];

    const providerMenuItems = [
      { key: '1', icon: <UserOutlined />, label: 'Main Page' },
      { key: '2', icon: <UserOutlined />, label: 'Manage Departments' },
      { key: '3', icon: <UserOutlined />, label: 'Manage Doctors' },
      { key: '4', icon: <UploadOutlined />, label: 'Provider Approvals' },
    ]
    const doctorMenuItems = [
      { key: '1', icon: <UserOutlined />, label: 'Main Page' },
      { key: '2', icon: <UserOutlined />, label: 'Manage Appointments' },
      { key: '3', icon: <UserOutlined />, label: 'Patient Management' },
      { key: '4', icon: <UploadOutlined />, label: 'Provider Approvals' },
    ]
    const userMenuItems = [
      { key: '1', pagenumber: 1, icon: <UserOutlined />, label: 'Main Page', onClick: () => setSelectedPage(1), component: <MainContent /> },
      { key: '2', pagenumber: 2, icon: <CalendarOutlined />, label: 'Appointments', onClick: () => setSelectedPage(2), component: <Appointments /> },
      { key: '3', pagenumber: 3, icon: <CarryOutOutlined />, label: 'Visits', onClick: () => setSelectedPage(3), component: <Visits /> },
      { key: '4', pagenumber: 4, icon: <UploadOutlined />, label: 'Prescriptions', onClick: () => setSelectedPage(4), component: <Prescriptions /> },
      { key: '5', pagenumber: 5, icon: <PaperClipOutlined />, label: 'Reports', onClick: () => setSelectedPage(5), component: <Reports /> },
      { key: '6', pagenumber: 6, icon: <UploadOutlined />, label: 'Diseases', onClick: () => setSelectedPage(6), component: <Diseases /> },
      { key: '7', pagenumber: 7, icon: <ExperimentOutlined />, label: 'Tests', onClick: () => setSelectedPage(7), component: <Tests /> },
      { key: '8', pagenumber: 8, icon: <UploadOutlined />, label: 'Radiological Images', onClick: () => setSelectedPage(8), component: <RadiologicalImages /> },
      { key: '9', pagenumber: 9, icon: <UploadOutlined />, label: 'Allergies', onClick: () => setSelectedPage(9), component: <Allergies /> },
      { key: '10', pagenumber: 10, icon: <UploadOutlined />, label: 'Medications', onClick: () => setSelectedPage(10), component: <Medications /> },
      { key: '11', pagenumber: 11, icon: <UploadOutlined />, label: 'Provider Request', onClick: () => setSelectedPage(11), component: <ProviderRequests /> },]

    if (userIsProvider == true) {
      MenuItems = providerMenuItems;
    }
    if (userIsDoctor == true) {
      MenuItems = doctorMenuItems;
    }
    else {
      MenuItems = userMenuItems;
    }

    return (
      <div className='main-page'>
        <Spin spinning={spinning} fullscreen />
        <div className='navbar'>
          <img className='logo' src="../public/logo.png" alt="" />
          <UserProfile />
        </div>
        <Divider></Divider>
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed} style={{
            background: colorBgContainer,
          }}  >
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={['1']}
              items={MenuItems}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            </Header>
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                overflow: 'initial',
              }}
            >
              {userMenuItems.map(page => page.pagenumber === selectedPage && page.component)}
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }

  return (
    <main>
      {isConnected ? <MainPage /> : <LoginPage />}
    </main>
  );
}

export default App;
