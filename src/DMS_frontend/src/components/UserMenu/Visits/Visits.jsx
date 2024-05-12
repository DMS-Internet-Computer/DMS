import {Table, Rate, Tabs, } from "antd";
import Prescriptions from "../Prescriptions/Prescriptions";

function Visits(){
  const expandedRowRender = () => {
    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i.toString(),
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56',
      });
    }
    return <Tabs
    type="card"
    items={[
    { label: "Tests", key: 1, children: <Table size="small" dataSource={testMockData} columns={testColumns}/> }, 
    // { label: "Prescriptions", key: 2, children: <Table size="small" dataSource={prescriptionsMockData} columns={prescriptionsColumns}/> }, 
    { label: "Prescriptions", key: 2, children: <Prescriptions /> }, 
    { label: "Actions", key: 3, children: <Table size="small" dataSource={actionsMockData} columns={actionsColumns}/> },
    { label: "Diagnosis", key: 4, children: <Table size="small" dataSource={diagnosisMockData} columns={diagnosisColumns}/> },
    ]}
  />
  };

  const testMockData = [
    {
      key: '1',
      date: '12.01.2024 15.00',
      name: 'Test Name',
      result: '11',
      resultUnit: '22-44'
    }
  ]
  const testColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Test Name',
      dataIndex: 'name',
      key: 'name',
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
    }
  ]

  const actionsMockData = [
    {
      key: '1',
      time: '12.01.2024 15.00',
      name: 'Blood Test',
    }
  ]
  
  const actionsColumns = [
    {
      title: 'Process Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Process Name',
      dataIndex: 'name',
      key: 'name',
    }
  ]

  const diagnosisMockData = [
    {
      key: '1',
      date: '12.01.2024 15.00',
      diagnosis: 'Rinit',
      doctor: 'Doctor A',
      department: 'Department A',
    }
  ]

  const diagnosisColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Diagnosis',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    }
  ]

  const columns = [
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
      title: 'Appointment ID',
      dataIndex: 'appointmentId',
      key: 'appointmentId',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Evaluate',
      key: 'evaluate',
      render: () => <Rate/>
    },
    {
      title: 'Action',
      key: 'operation',
      render: () => <a>Share</a>,
    },
  ];
  const data = [];
  for (let i = 0; i < 2; ++i) {
    data.push({
      key: i.toString(),
      provider: 'A Hospital',
      department: 'Department A',
      doctor: 'A Doctor',
      appointmentId: 500,
      date: '2014-12-24 23:12:00',
    });
  }
  return (
    <>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
          // defaultExpandedRowKeys: ['0'],
        }}
        dataSource={data}
        size="small"
      />
    </>
  );
  }

  export default Visits;