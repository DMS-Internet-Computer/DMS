import { Avatar, Col, Upload, Divider, Drawer, Row, Typography, Button, Space, Spin, Tooltip, Input } from 'antd';
import { useState } from 'react';
import { DMS_backend } from 'declarations/DMS_backend';
import { UserOutlined, QuestionCircleOutlined, EditOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { ConnectButton, useConnect } from "@connect2ic/react";

function UserProfile() {
    const { principal } = useConnect({
        onConnect: () => { },
        onDisconnect: () => { }
    });

    const [userData, setUserData] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editable, setEditable] = useState(false); 

    const showDrawer = async () => {
        setDrawerVisible(true);
        setLoading(true);
        try {
            const data = await DMS_backend.get_current_user(principal);
            setUserData(JSON.parse(data));
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const onCloseDrawer = () => {
        setDrawerVisible(false);
    };

    const DescriptionItem = ({ title, content }) => (
        <Row>
            <Col span={8}>
                <Typography.Text strong>{title}:</Typography.Text>
            </Col>
            <Col span={16}>
                {editable ? (
                    <Input value={content} onChange={(e) => handleInputChange(title, e.target.value)} />
                ) : (
                    <Typography.Text>{content}</Typography.Text>
                )}
            </Col>
        </Row>
    );

    const handleInputChange = (title, value) => {
        // Update the corresponding field in userData
        setUserData(prevData => ({
            ...prevData,
            personal_data: {
                ...prevData.personal_data,
                [title.toLowerCase()]: value
            }
        }));
    };

    const toggleEditable = () => {
        setEditable(!editable);
    };

    const saveChanges = async () => {
        // Update user data on the backend
        try {
            await DMS_backend.update_user(principal, userData);
            setEditable(false); // Switch back to non-editable mode
        } catch (error) {
            console.error("Failed to update user data:", error);
        }
    }; 

    const [fileList, setFileList] = useState([
    ]);
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    return (
        <>
            <div>
                <Button size="large" type="link" onClick={showDrawer}>
                    <UserOutlined />
                </Button>
            </div>
            <Drawer
                title="User Profile"
                width={400}
                placement="right"
                closable={false}
                onClose={onCloseDrawer}
                open={drawerVisible}
            >
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    userData && (
                        <>
                            <Divider orientation="left">Personal Information</Divider>
                            <Row>
                                <Col span={16}>
                                    <DescriptionItem title="Name" content={userData.personal_data.name || <Tooltip title={"This information is empty on your profile. Please update."}>
                                        <QuestionCircleOutlined />
                                    </Tooltip>} />
                                    <DescriptionItem title="Surname" content={userData.personal_data.surname || <Tooltip title={"This information is empty on your profile. Please update."}>
                                        <QuestionCircleOutlined />
                                    </Tooltip>} />
                                    <DescriptionItem title="Birthday" content={userData.personal_data.birthday || <Tooltip title={"This information is empty on your profile. Please update."}>
                                        <QuestionCircleOutlined />
                                    </Tooltip>} />
                                </Col>

                                <Col span={8}>
                                    <ImgCrop rotationSlider>
                                        <Upload
                                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                            listType="picture-card"
                                            onChange={onChange}
                                            onPreview={onPreview}
                                        >
                                            {fileList.length == 1 && '+ Upload'}
                                        </Upload>
                                    </ImgCrop>
                                </Col>
                            </Row>



                            <Divider orientation="left">Location Information</Divider>
                            <DescriptionItem title="City" content={userData.personal_data.city || <Tooltip  title={"This information is empty on your profile. Please update."}>
                                <QuestionCircleOutlined />
                            </Tooltip>} />
                            <DescriptionItem title="Country" content={userData.personal_data.country || <Tooltip title={"This information is empty on your profile. Please update."}>
                                <QuestionCircleOutlined />
                            </Tooltip>} />
                            <DescriptionItem title="Province" content={userData.personal_data.province || <Tooltip title={"This information is empty on your profile. Please update."}>
                                <QuestionCircleOutlined />
                            </Tooltip>} />

                            <Divider orientation="left">Contact Information</Divider>
                            <DescriptionItem title="Mail" content={userData.personal_data.mail || <Tooltip title={"This information is empty on your profile. Please update."}>
                                <QuestionCircleOutlined />
                            </Tooltip>} />
                            <DescriptionItem title="Phone" content={userData.personal_data.phone || <Tooltip title={"This information is empty on your profile. Please update."}>
                                <QuestionCircleOutlined />
                            </Tooltip>} />

                            <Divider orientation="left">Identity</Divider>
                            <Row>
                            <Space>
                                    <Typography.Text strong>Identity:</Typography.Text>

                                    <Tooltip title={userData.identity}>
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Space>

                            </Row>

                            <Divider orientation="left"></Divider>
                            <Row>
                                <Space>
                                <Button onClick={toggleEditable} style={{ marginLeft: '20px', height: '41px', borderRadius: '10px' }}><EditOutlined /> {editable ? "Cancel" : "Edit Information"}</Button>
                                <ConnectButton style={{ height: '39px', borderRadius: '10px'}}/> 
                                </Space>
                                    
                            </Row>

                        </>
                    )
                )}
            </Drawer>
        </>
    );
}

export default UserProfile;
