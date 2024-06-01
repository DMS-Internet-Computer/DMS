import React, { useState, Suspense } from 'react';
import { Dropdown, Table, Button, Modal, Image } from "antd";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import ThreeDModel from './ThreeDModel';
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
  BorderlessTableOutlined,
  PictureOutlined,
  FilePptOutlined,
} from '@ant-design/icons';
function Diseases() {
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  let scaleStep = 0.5;
  let prospectusUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  let boxImgUrl = 'https://st.depositphotos.com/51820676/60982/i/450/depositphotos_609828198-stock-photo-white-circle-pills-pack-two.jpg';

  const items = [
    {
      label: 'Box Image',
      key: '1',
      icon: <PictureOutlined />,
      onClick: () => setVisible(true),
    },
    {
      label: 'Prospectus',
      key: '2',
      icon: <FilePptOutlined />,
      onClick: () => window.open(prospectusUrl),
    }
  ];

  const diseasesMockData = [
    {
      key: '1',
      date: '12.01.2024 15.00',
      diagnosis: 'Diagnosis Ex.',
      provider: 'Provider A',
      department: 'Department A',
      doctor: 'Doctor A',
      details: 'Details'
    }
  ];

  const diseasesColumns = [
    {
      title: 'Diagnosis Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
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
      title: 'Details',
      dataIndex: 'details',
      render: () => <Button type="primary" onClick={() => setModalOpen(true)}>
        Show
      </Button>,
    }
  ];

  const diseasesDetailsMockData = [
    {
      key: '1',
      diagnosis: 'Diagnosis Ex.',
      department: 'Department A',
      doctor: 'Doctor A',
      date: '12.01.2024 15.00',
    }
  ];

  const diseasesDetailsColumns = [
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
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
    }
  ];

  return (
    <>
      <Table size="small" dataSource={diseasesMockData} columns={diseasesColumns} />
      <Modal
        title="Diagnosis Details"
        centered
        width={1100}
        open={modalOpen}
        footer={null}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        <Table size="small" dataSource={diseasesDetailsMockData} columns={diseasesDetailsColumns} />
      </Modal>
      <Image
        width={200}
        style={{
          display: 'none',
        }}
        src={boxImgUrl}
        preview={{
          visible,
          scaleStep,
          src: boxImgUrl,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
      <div style={{ width: '100%', height: '500px', marginTop: '20px' }}>
        <Canvas>
          <Suspense fallback={null}>
            <Stage>
              <ThreeDModel />
            </Stage>
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </>
  );
}

export default Diseases;
