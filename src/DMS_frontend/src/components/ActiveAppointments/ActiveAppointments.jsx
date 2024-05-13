import { Button, Table, Rate, } from 'antd';
import { useState } from 'react';


function ActiveAppointments() {
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
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Actions',
        key: 'Actions',
        render: () => <Rate />
      },
      {
        title: 'Details',
        key: 'details',
        render: () => <Button>Details</Button>
      },
    ];
    return (
      <>
        <Table
          columns={columns}
          dataSource={data}
          size="small"
        />
      </>
    )
  }

  export default ActiveAppointments;