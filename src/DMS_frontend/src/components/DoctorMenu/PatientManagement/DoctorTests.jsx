import { Table, Button, Modal, Image, message } from "antd";
import { useState, useEffect } from "react";
import { FilePptOutlined } from '@ant-design/icons';
import { DMS_backend } from 'declarations/DMS_backend';

function DoctorTests({ patientId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [testsData, setTestsData] = useState([]);
  const [detailsData, setDetailsData] = useState([]);

  const scaleStep = 0.5;
  const prospectusUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  const boxImgUrl = 'https://st.depositphotos.com/51820676/60982/i/450/depositphotos_609828198-stock-photo-white-circle-pills-pack-two.jpg';

  useEffect(() => {
    if (patientId) {
      fetchTestResults();
    }
  }, [patientId]);

  const fetchTestResults = async () => {
    try {
      const data = await DMS_backend.get_patient_tests(patientId);
      setTestsData(data);
    } catch (error) {
      message.error('Failed to fetch test results');
    }
  };

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
      render: () => (
        <Button icon={<FilePptOutlined />} onClick={() => window.open(prospectusUrl)}>
          PDF
        </Button>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    }
  ];

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
  ];

  return (
    <>
      <Table size="small" dataSource={testsData} columns={testsColumns} rowKey="key" />
      <Modal
        title="Diagnosis Details"
        centered
        width={1100}
        open={modalOpen}
        footer={null}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        <Table size="small" dataSource={detailsData} columns={testsDetailsColumns} rowKey="key" />
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
    </>
  );
}

export default DoctorTests;
