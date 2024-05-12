import { Avatar, Col, Divider, Drawer, List, Row, Typography } from 'antd';
import { useState } from 'react';
import { DMS_backend } from 'declarations/DMS_backend';

import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react"
function UserProfile() {
    const { isConnected, principal, activeProvider } = useConnect({
        onConnect: () => {},
        onDisconnect: () => {}
    })


    const get_user_data =  async (identity) => {
        console.log("Getting current user data");
        (console.log(await DMS_backend.get_current_user(identity)));
    }

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        get_user_data(principal);
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );
    return (
        <>
            <div className='profile-section'>
                <List className="profile-card"
                    dataSource={[
                        {
                            id: 1,
                            name: "Tuğberk",
                        },
                    ]}
                    bordered
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar size={'large'} src="logo.png" />
                                }
                                title={<a href="https://ant.design/index-cn">{item.name}</a>}
                                description=                                 {<a onClick={showDrawer} key={`a-${item.id}`}>
                                Profile
                            </a>}
                            />
                        </List.Item>
                    )}
                />
                <ConnectButton></ConnectButton>
                <Drawer width={300} placement="right" closable={false} onClose={onClose} open={open}>
                    <p
                        className="site-description-item-profile-p"
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        User Profile
                    </p>
                    <Divider></Divider>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        Personal Information
                    </Typography.Title>
                    <Row>
                        <DescriptionItem title="Name" content={<Typography.Text editable style={{ margin: 0 }}>
                            Tugberk
                        </Typography.Text>} />
                    </Row>
                    <Row>
                        <DescriptionItem title="Surname" content={<Typography.Text editable style={{ margin: 0 }}>
                            Serce
                        </Typography.Text>} />
                    </Row>
                    <Row>
                        <DescriptionItem title="Birthday" content={<Typography.Text editable style={{ margin: 0 }}>
                            11.02.2022
                        </Typography.Text>} />
                    </Row>
                    <Divider></Divider>
                    <Row>
                        <DescriptionItem title="Height" content={<Typography.Text editable style={{ margin: 0 }}>
                            333
                        </Typography.Text>} />
                    </Row>
                    <Row>
                        <DescriptionItem title="Weight" content={<Typography.Text editable style={{ margin: 0 }}>
                            33
                        </Typography.Text>} />
                    </Row>
                    <Row>
                        <DescriptionItem title="Blood Type" content={<Typography.Text editable style={{ margin: 0 }}>
                            B+
                        </Typography.Text>} />
                    </Row>
                    <Divider></Divider>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        Location Information
                    </Typography.Title>
                    <Row>
                        <DescriptionItem title="City" content={<Typography.Text editable style={{ margin: 0 }}>
                            Istanbul
                        </Typography.Text>} />
                    </Row>
                    <Row>
                        <DescriptionItem title="Country" content={<Typography.Text editable style={{ margin: 0 }}>
                            Turkey
                        </Typography.Text>} />
                    </Row>
                    <Row>
                        <DescriptionItem title="Province" content={<Typography.Text editable style={{ margin: 0 }}>
                            Esenyurt
                        </Typography.Text>} />
                    </Row>
                    <Divider></Divider>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        Contact Information
                    </Typography.Title>
                    <Row>
                        <DescriptionItem title="Mail" content={<Typography.Text editable style={{ margin: 0 }}>
                            Esenyurt
                        </Typography.Text>} />
                    </Row>
                    <Row>
                        <DescriptionItem title="Phone" content={<Typography.Text editable style={{ margin: 0 }}>
                            Esenyurt
                        </Typography.Text>} />
                    </Row>
                </Drawer>
            </div>
        </>)
}

export default UserProfile;




{
    /* 
    const [fileList, setFileList] = useState([]);
    const onChangeImg = ({ fileList: newFileList }) => {setFileList(newFileList);};
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

    
    
    <Sider className='right-sider' theme='light'>
    <ImgCrop rotationSlider>
    <Upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      listType="picture-card"
      fileList={fileList}
      onChange={onChangeImg}
      onPreview={onPreview}
    >
      {fileList.length < 1 && '+ Upload'}
    </Upload>
    </ImgCrop>
    <Tooltip placement="top" title={principal}><p>Identity</p></Tooltip>  
    <ConnectButton></ConnectButton>
</Sider> */}