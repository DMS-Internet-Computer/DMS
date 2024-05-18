import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react"
import { Divider, Spin, Modal, Form, Input, Space, Tabs, Card, Button, Layout, Menu, theme, Table, Rate, Calendar } from 'antd';

function LoginPage() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        <ConnectButton />
        <ConnectDialog />
      </Card>
    </div>
    );
  }

  export default LoginPage;