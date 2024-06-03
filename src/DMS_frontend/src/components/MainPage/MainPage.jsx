import { useEffect, useState } from 'react';
import { DMS_backend } from 'declarations/DMS_backend';
import { useConnect } from "@connect2ic/react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    CalendarOutlined,
    CarryOutOutlined,
    ExperimentOutlined,
    PaperClipOutlined,
    PicLeftOutlined,
    FileTextOutlined,
    MedicineBoxOutlined,
    DislikeOutlined,
    BorderlessTableOutlined
} from '@ant-design/icons';
import { Spin, Divider, Button, Layout, Menu, theme } from 'antd';
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
import ManageAppointments from '../DoctorMenu/ManageAppointments';
import MainContent from './MainContent/MainContent';
import ManageDepartments from '../ProviderMenu/ManageDepartments/ManageDepartments';
import ManageDoctors from '../ProviderMenu/ManageDoctors';

const { Header, Sider, Content } = Layout;

function MainPage() {
    const { principal, isConnected } = useConnect({
        onConnect: () => { },
        onDisconnect: () => { }
    });

    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState({});
    const [isProvider, setIsProvider] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const [selectedPage, setSelectedPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const createUser = async () => {
            try {
                if (!principal) {
                    console.log("Waiting for principal...");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                console.log("Creating user...");
                await DMS_backend.create_user(principal);
                console.log("User created.");
            } catch (error) {
                console.error("Error during user creation:", error);
            }
        };

        const fetchData = async () => {
            try {
                const userData = await get_user_data(principal);
                setUser(userData);
                setIsProvider(userData.user_type === 1);
                setIsDoctor(userData.user_type === 2);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };

        if (principal && isConnected) {
            createUser();
            fetchData();
        }
    }, [principal, isConnected]);

    const get_user_data = async (identity) => {
        const userData = await DMS_backend.get_current_user(identity);
        console.log(identity);
        console.log("userData:", JSON.parse(userData)); // Log userData to check its value
        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null; // Return null or handle the error in a different way
        }
    };

    const providerMenuItems = [
        { key: '1', icon: <UserOutlined />, label: 'Main Page', pagenumber: 1, component: <MainContent /> },
        { key: '2', icon: <UserOutlined />, label: 'Manage Departments', pagenumber: 2, component: <ManageDepartments /> },
        { key: '3', icon: <UserOutlined />, label: 'Manage Doctors', pagenumber: 3, component: <ManageDoctors /> },
        { key: '4', icon: <UploadOutlined />, label: 'Provider Requests', pagenumber: 4, component: <ProviderRequests /> },
    ];

    const doctorMenuItems = [
        { key: '1', icon: <UserOutlined />, label: 'Management', pagenumber: 1, component: <ManageAppointments /> },
        { key: '2', icon: <UploadOutlined />, label: 'Provider Requests', pagenumber: 2, component: <ProviderRequests /> },
    ];

    const userMenuItems = [
        { key: '1', icon: <UserOutlined />, label: 'Main Page', pagenumber: 1, component: <Appointments /> },
        // { key: '2', icon: <CalendarOutlined />, label: 'Appointments', pagenumber: 2, component: <Appointments /> },
        { key: '2', icon: <CarryOutOutlined />, label: 'Visits', pagenumber: 2, component: <Visits /> },
        { key: '3', icon: <FileTextOutlined />, label: 'Prescriptions', pagenumber: 3, component: <Prescriptions /> },
        { key: '4', icon: <PaperClipOutlined />, label: 'Reports', pagenumber: 4, component: <Reports /> },
        { key: '5', icon: <BorderlessTableOutlined />, label: 'Diseases', pagenumber: 5, component: <Diseases /> },
        { key: '6', icon: <ExperimentOutlined />, label: 'Tests', pagenumber: 6, component: <Tests /> },
        { key: '7', icon: <PicLeftOutlined />, label: 'Radiological Images', pagenumber: 7, component: <RadiologicalImages /> },
        { key: '8', icon: <DislikeOutlined />, label: 'Allergies', pagenumber: 8, component: <Allergies /> },
        { key: '9', icon: <MedicineBoxOutlined />, label: 'Medications', pagenumber: 9, component: <Medications /> },
        { key: '10', icon: <UploadOutlined />, label: 'Provider Requests', pagenumber: 10, component: <ProviderRequests /> },
    ];

    const MenuItems = isProvider ? providerMenuItems : (isDoctor ? doctorMenuItems : userMenuItems);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin tip="Loading..." size="large" />
            </div>
        );
    }

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
                        onSelect={({ key }) => setSelectedPage(Number(key))}
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
    );
}

export default MainPage;
