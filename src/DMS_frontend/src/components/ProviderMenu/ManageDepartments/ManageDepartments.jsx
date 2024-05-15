import { Divider, Spin, Space, Tabs, Card, Button, Layout, Menu, theme, Table, Rate, Calendar } from 'antd';

function ManageDepartments(){
const departmentColumns = [
    {
        title: 'Department Name',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Doctor Number',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: 'Active Appointments',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Actions',
        dataIndex: 'details',
        render: () => <Button type="primary">
        Show More
      </Button>,
      }
]
const departmentsList = [];
 return (
    <Card>
        <Table size="small" dataSource={departmentsList} columns={departmentColumns}/>
        <Button>
                Add New Department
        </Button>
    </Card>
 )
}

export default ManageDepartments;