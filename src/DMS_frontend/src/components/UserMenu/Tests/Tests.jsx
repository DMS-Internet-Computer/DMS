import { Table, Button, Modal, Image} from "antd";
import { useState } from "react";
import { FilePptOutlined} from '@ant-design/icons';

function Tests(){
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  let scaleStep = 0.5;
  let prospectusUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  let boxImgUrl = 'https://st.depositphotos.com/51820676/60982/i/450/depositphotos_609828198-stock-photo-white-circle-pills-pack-two.jpg';

  const testsMockData = [
    {
      key: '1',
      providerName: 'Provider A',
      processName: 'Process Ex.',
      result: '2',
      resultUnit: 'mm/S',
      referenceValue: '0-23',
      report: 'Report',
      date: '12.01.2024 15.00',
    }
  ]

  const testsColumns = [
      {
        title: 'Provider Name',
        dataIndex: 'providerName',
        key: 'providerName',
      },
      {
        title: 'Process Name',
        dataIndex: 'processName',
        key: 'processName',
      },
      {
        title: 'Result',
        dataIndex: 'result',
        key: 'result',
      },
      {
        title: 'Result Unit',
        dataIndex: 'resultUnit',
        key: 'resultUnit',
      },
      {
        title: 'Reference Value',
        dataIndex: 'referenceValue',
        key: 'referenceValue',
      },
      {
        title: 'Report',
        dataIndex: 'report',
        render: () =>  <Button icon={<FilePptOutlined />}  onClick={() => window.open(prospectusUrl)}>
        PDF
      </Button>,
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      }
  ]

  const testsDetailsMockData = [
    {
      key: '1',
      diagnosis: 'Diagnosis Ex.',
      department: 'Department A',
      doctor: 'Doctor A',
      date: '12.01.2024 15.00',
    }
  ]

  const testsDetailsColumns = [
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
        <Table size="small" dataSource={testsMockData} columns={testsColumns}/>
        <Modal
        title="Diagnosis Details"
        centered
        width={1100}
        open={modalOpen}
        footer={null}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        >
        <Table size="small" dataSource={testsDetailsMockData} columns={testsDetailsColumns}/>
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

export default Tests;