import { Divider, Spin, Space, Tabs, Card, Button, Layout, Menu, theme, Table, Rate, Calendar } from 'antd';
import SmartAssistant from '../../UserMenu/SmartAssistant/SmartAssistant';
import ActiveAppointments from '../../ActiveAppointments/ActiveAppointments';
import LastAppointments from '../../LastAppointments/LastAppointments';


function MainContent() {
    async function listActiveSession() {
        console.log(await DMS_backend.list_active_sessions());
      }

    return (
      <>
        <div className='main-sections'>
          <Card className='details-section'>
            <Tabs
              //onChange={onChange}
              type="card"
              items={[{ label: "Smart Assistant", key: 1, children: <SmartAssistant /> }]}
            />
          </Card>
          <Card className='appointment-section'>
            <Tabs
              //onChange={onChange}
              type="card"
              items={[{ label: "Active Appointments", key: 1, children: <ActiveAppointments /> }, { label: "Last Appointments", key: 2, children: <LastAppointments /> }]}
            />
          </Card>
        </div>
      </>
    )
  }

  export default MainContent;