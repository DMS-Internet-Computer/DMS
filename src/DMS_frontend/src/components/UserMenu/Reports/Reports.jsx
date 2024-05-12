import { Table, Button, Modal, Image} from "antd";
import { useState } from "react";
import { PictureOutlined, FilePptOutlined} from '@ant-design/icons';

function Reports(){
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
    },
  ];

  const menuProps = {
    items,
  };

  const diseasesMockData = [
    {
      key: '1',
      date: '12.01.2024 15.00',
      reportNumber: '96300067',
      reportTrackingNumber: '12990022',
      reportType: 'Disease',
      diagnosis: 'Diagnosis Ex.',
      startingDate: '15.04.2024',
      endDate: '21.04.2024',
      diagnosis: 'Diagnosis Ex.',
    }
  ]

  const diseasesColumns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Report Number',
        dataIndex: 'reportNumber',
        key: 'reportNumber',
      },
      {
        title: 'Report Tracking Number',
        dataIndex: 'reportTrackingNumber',
        key: 'reportTrackingNumber',
      },
      {
        title: 'Report Type',
        dataIndex: 'reportType',
        key: 'reportType',
      },
      {
        title: 'Starting Date',
        dataIndex: 'startingDate',
        key: 'startingDate',
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: 'Diagnosis',
        dataIndex: 'diagnosis',
        key: 'diagnosis',
      },
      {
        title: 'Details',
        dataIndex: 'details',
        render: () =>  <Button icon={<FilePptOutlined />}  onClick={() => window.open(prospectusUrl)}>
        PDF
      </Button>,
      }
  ]

  const diseasesDetailsMockData = [
    {
      key: '1',
      diagnosis: 'Diagnosis Ex.',
      department: 'Department A',
      doctor: 'Doctor A',
      date: '12.01.2024 15.00',
    }
  ]

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
]

    return(
      <>
        <Table size="small" dataSource={diseasesMockData} columns={diseasesColumns}/>
        <Modal
        title="Diagnosis Details"
        centered
        width={1100}
        open={modalOpen}
        footer={null}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        >
        <Table size="small" dataSource={diseasesDetailsMockData} columns={diseasesDetailsColumns}/>
        </Modal>
        <Image
        width={200}
        style={{
          display: 'none',
        }}
        src= {boxImgUrl}
        preview={{
          visible,
          scaleStep,
          src: boxImgUrl,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
      </>
    )
  }

  export default Reports;