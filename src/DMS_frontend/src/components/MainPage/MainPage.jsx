import { useEffect, useState } from 'react';
import { DMS_backend } from 'declarations/DMS_backend';
import { useConnect } from "@connect2ic/react"
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
import { Spin, Divider, Button, Layout, Menu, theme, Card } from 'antd';
import Prescriptions from '../UserMenu/Prescriptions/Prescriptions';
import Reports from '../UserMenu/Reports/Reports';
import Diseases from '../UserMenu/Diseases/Diseases';
import Tests from '../UserMenu/Tests/Tests';
import RadiologicalImages from '../UserMenu/RadiologicalImages/RadiologicalImages';
import Allergies from '../UserMenu/Allergies/Allergies';
import Medications from '../UserMenu/Medications/Medications';
import Appointments from '../UserMenu/Appointment/Appointments';
import ProviderRequests from '../UserMenu/ProviderRequests/ProviderRequests';
import UserProfile from '../Profile/UserProfile';
import Visits from '../UserMenu/Visits/Visits';
import MainContent from './MainContent/MainContent';

const { Header, Sider, Content } = Layout;

function MainPage() {
    const { principal } = useConnect({
        onConnect: () => { },
        onDisconnect: () => { }
    });

    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState({});
    const [isProvider, setIsProvider] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const onChange = (key) => { };
    const [selectedPage, setSelectedPage] = useState(1);
    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await get_user_data(principal);
                setUser(userData);
                setIsProvider(userData.user_type === 1);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        if (principal) {
            fetchData();
        }
    }, [principal]);

    const get_user_data = async (identity) => {
        const userData = await DMS_backend.get_current_user(identity);
        return JSON.parse(userData);
    };

    const providerMenuItems = [
        { key: '1', icon: <UserOutlined />, label: 'Main Page', component:  <MainContent />},
        { key: '2', icon: <UserOutlined />, label: 'Manage Departments', component: <MainContent /> },
        { key: '3', icon: <UserOutlined />, label: 'Manage Doctors', component: <MainContent /> },
        { key: '4', icon: <UploadOutlined />, label: 'Provider Approvals', component: <MainContent /> },
    ];

    const doctorMenuItems = [
        { key: '1', icon: <UserOutlined />, label: 'Main Page', component: <MainContent /> },
        { key: '2', icon: <UserOutlined />, label: 'Manage Appointments' },
        { key: '3', icon: <UserOutlined />, label: 'Patient Management' },
        { key: '4', icon: <UploadOutlined />, label: 'Provider Approvals' },
    ];

    const userMenuItems = [
        { key: '1', icon: <UserOutlined />, label: 'Main Page', component: <MainContent /> },
        { key: '2', icon: <CalendarOutlined />, label: 'Appointments', component: <Appointments /> },
        { key: '3', icon: <CarryOutOutlined />, label: 'Visits', component: <Visits /> },
        { key: '4', icon: <UploadOutlined />, label: 'Prescriptions', component: <Prescriptions /> },
        { key: '5', icon: <PaperClipOutlined />, label: 'Reports', component: <Reports /> },
        { key: '6', icon: <UploadOutlined />, label: 'Diseases', component: <Diseases /> },
        { key: '7', icon: <ExperimentOutlined />, label: 'Tests', component: <Tests /> },
        { key: '8', icon: <UploadOutlined />, label: 'Radiological Images', component: <RadiologicalImages /> },
        { key: '9', icon: <UploadOutlined />, label: 'Allergies', component: <Allergies /> },
        { key: '10', icon: <UploadOutlined />, label: 'Medications', component: <Medications /> },
        { key: '11', icon: <UploadOutlined />, label: 'Provider Request', component: <ProviderRequests /> },
    ];

    const MenuItems = isProvider ? providerMenuItems : userMenuItems;

    return (
        <div className='main-page'>
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
                        {MenuItems.map(page => page.pagenumber === selectedPage && page.component)}
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}

export default MainPage;
