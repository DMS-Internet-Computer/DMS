import { Dropdown, Table, Button, Modal, Image} from "antd";
import { useState } from "react";
import { DownOutlined, PictureOutlined, FilePptOutlined} from '@ant-design/icons';

function Prescriptions(){
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

  const prescriptionsMockData = [
    {
      key: '1',
      date: '12.01.2024 15.00',
      number: 'H123O12KXXZ',
      type: 'Normal',
      details: 'Details'
    }
  ]

  const prescriptionsColumns = [
      {
        title: 'Prescription Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Prescription Number',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: 'Prescription Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Details',
        dataIndex: 'details',
        render: () => <Button type="primary" onClick={() => setModalOpen(true)}>
        Show More
      </Button>,
      }
  ]

  const prescriptionsDetailsMockData = [
    {
      key: '1',
      barcode: '9637876560011',
      medicineName: 'Medicine X',
      explanation: 'Explanation',
      dosage: '1',
      period: '1 in a day',
      usageMethod: 'Oral',
      usageNumber: '1',
      boxCount: '1',
      actions: 'Actions',
    }
  ]

  const prescriptionsDetailsColumns = [
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
    },
    {
      title: 'Medicine Name',
      dataIndex: 'medicineName',
      key: 'medicineName',
    },
    {
      title: 'Explanation',
      dataIndex: 'explanation',
      key: 'explanation',
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      key: 'dosage',
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Usage Method',
      dataIndex: 'usageMethod',
      key: 'usageMethod',
    },
    {
      title: 'Box Count',
      dataIndex: 'boxCount',
      key: 'boxCount',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: () => <Dropdown.Button menu={menuProps} placement="bottom" icon={<DownOutlined />}>
      Actions
    </Dropdown.Button>

    }
]

    return(
      <>
        <Table size="small" dataSource={prescriptionsMockData} columns={prescriptionsColumns}/>
        <Modal
        title="Prescriptions Details"
        centered
        width={1100}
        open={modalOpen}
        footer={null}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        >
        <Table size="small" dataSource={prescriptionsDetailsMockData} columns={prescriptionsDetailsColumns}/>
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

export default Prescriptions;