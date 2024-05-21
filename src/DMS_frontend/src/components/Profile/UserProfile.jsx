import React, { useState, useEffect } from 'react';
import { Drawer, Divider, Button, Spin, Row, Col, Typography, Tooltip, Form, Input, DatePicker, message, Upload, Image } from 'antd';
import { UserOutlined, LoadingOutlined, QuestionCircleOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import ImgCrop from 'antd-img-crop';
import { DMS_backend } from 'declarations/DMS_backend';
import { ConnectButton, useConnect } from "@connect2ic/react";

const { Text } = Typography;

const DescriptionItem = ({ title, content }) => (
    <Row style={{ marginBottom: 10 }}>
        <Col span={8}>
            <Text strong>{title}:</Text>
        </Col>
        <Col span={16}>
            <Text>
                {content || (
                    <Tooltip title={"This information is empty on your profile. Please update."}>
                        <QuestionCircleOutlined />
                    </Tooltip>
                )}
            </Text>
        </Col>
    </Row>
);


const UserProfile = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const { principal } = useConnect({
        onConnect: () => { },
        onDisconnect: () => { }
    });

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

    const updateUserProfile = async (values) => {
        try {
            if (fileList.length > 0) {
                const pictureFile = fileList[0].originFileObj;
                const base64String = await convertFileToBase64(pictureFile);
                const base64ArrayBuffer = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
                await DMS_backend.update_user_picture(principal, base64ArrayBuffer);
            }

            await DMS_backend.update_user_profile(principal, values.name, values.surname, values.birthday.format('YYYY-MM-DD'), values.country, values.city, values.province, values.mail, values.phone, values.height, values.weight, values.blood_type);

            message.success('Profile updated successfully!');
            setDrawerVisible(false);
            setEditing(false);
        } catch (error) {
            message.error('Failed to update profile');
        }
    };

    const displayImageFromVecU8 = (vecU8Data) => {
        // Vec<u8> verisini base64 stringine dönüştür
        const base64String = btoa(String.fromCharCode.apply(null, vecU8Data));
        // Base64 stringini bir resim olarak görüntüle
        return `data:image/png;base64,${base64String}`;
    };


    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const startEditing = () => {
        setEditing(true);
    };

    const closeEditing = () => {
        setEditing(false);
    };

    useEffect(() => {
        if (userData) {
            form.setFieldsValue({
                name: userData.personal_data.name,
                surname: userData.personal_data.surname,
                birthday: moment(userData.personal_data.birthday),
                country: userData.personal_data.country,
                city: userData.personal_data.city,
                province: userData.personal_data.province,
                mail: userData.personal_data.mail,
                phone: userData.personal_data.phone,
                height: userData.health_data.height,
                weight: userData.health_data.weight,
                blood_type: userData.health_data.blood_type
            });
            if (userData.personal_data.picture.length > 0) {
                const img64 = userData.personal_data.picture;
                setFileList([
                    {
                        uid: '-1',
                        name: 'currentImage.png',
                        status: 'done',
                        url: `data:image/png;base64,${img64}`
                    }
                ]);
                const userProfilePicture = displayImageFromVecU8(userData.personal_data.picture);
                setProfilePic(userProfilePicture);
            }
        }
    }, [userData, form]);

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
                    <div style={{ textAlign: 'center' }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                ) : (
                    <>
                        {editing ? (
                            <Form
                                form={form}
                                onFinish={updateUserProfile}
                                layout="vertical"
                                initialValues={{ remember: true }}
                            >
                                <Form.Item
                                    name="name"
                                    label="Name"
                                    rules={[{ required: true, message: 'Please input your name!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="surname"
                                    label="Surname"
                                    rules={[{ required: true, message: 'Please input your surname!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="birthday"
                                    label="Birthday"
                                    rules={[{ required: true, message: 'Please select your birthday!' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                    name="country"
                                    label="Country"
                                    rules={[{ required: true, message: 'Please input your country!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="city"
                                    label="City"
                                    rules={[{ required: true, message: 'Please input your city!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="province"
                                    label="Province"
                                    rules={[{ required: true, message: 'Please input your province!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="mail"
                                    label="Email"
                                    rules={[{ required: true, message: 'Please input your email!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label="Phone"
                                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="height"
                                    label="Height"
                                    rules={[{ required: true, message: 'Please input your height!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="weight"
                                    label="Weight"
                                    rules={[{ required: true, message: 'Please input your weight!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="blood_type"
                                    label="Blood Type"
                                    rules={[{ required: true, message: 'Please input your blood type!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Profile Picture">
                                    <ImgCrop>
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileList}
                                            onChange={onChange}
                                            beforeUpload={() => false}
                                        >
                                            {fileList.length === 0 && '+ Upload'}
                                        </Upload>
                                    </ImgCrop>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                    <Button onClick={closeEditing}>
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Form>
                        ) : (
                            userData && (
                                <>
                                    <Divider orientation="left">Personal Information</Divider>
                                    <Row>
                                        <Col span={16}>
                                            <DescriptionItem
                                                title="Name"
                                                content={userData.personal_data.name}
                                            />
                                            <DescriptionItem
                                                title="Surname"
                                                content={userData.personal_data.surname}
                                            />
                                            <DescriptionItem
                                                title="Birthday"
                                                content={userData.personal_data.birthday}
                                            />
                                        </Col>
                                        <Col span={8}>
                                        <Image
    width={100}
    height={100}
    src={profilePic}
    fallback="data:image/png;base64,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"
  />
                                        </Col>
                                    </Row>
                                    <Divider orientation="left">Location Information</Divider>
                                    <DescriptionItem
                                        title="City"
                                        content={userData.personal_data.city}
                                    />
                                    <DescriptionItem
                                        title="Country"
                                        content={userData.personal_data.country}
                                    />
                                    <DescriptionItem
                                        title="Province"
                                        content={userData.personal_data.province}
                                    />
                                    <Divider orientation="left">Contact Information</Divider>
                                    <DescriptionItem
                                        title="Mail"
                                        content={userData.personal_data.mail}
                                    />
                                    <DescriptionItem
                                        title="Phone"
                                        content={userData.personal_data.phone}
                                    />
                                    <Divider orientation="left">Identity</Divider>
                                    <Row>
                                        <Tooltip title={userData.identity}>
                                            <QuestionCircleOutlined />
                                        </Tooltip>
                                    </Row>
                                    <Divider />
                                    <Row justify="end">
                                        <Button onClick={startEditing}>
                                            <EditOutlined /> Edit Profile
                                        </Button>
                                    </Row>
                                </>
                            )
                        )}
                        <ConnectButton
                            style={{ height: '39px', borderRadius: '10px' }}
                        />
                    </>
                )}
            </Drawer>
        </>
    );
};

export default UserProfile;
