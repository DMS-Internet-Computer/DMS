import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react";
import { useState } from 'react';
import { Card, Statistic, Row, Col} from 'antd';
import './LoginPage.css'; // Özel CSS dosyası
import GlobeCanvas from './Globe';
import CountUp from 'react-countup';

function LoginPage() {
 // Yazılacak metin
 const formatter = (value) => <CountUp end={value} separator="." />;

  return (
    <div className="login-page-container">
      <div className="background-overlay"></div>
      <Card className="globe-card">
        <GlobeCanvas/>
        
      </Card>
      <Card className="login-card">
      <Row gutter={16}>

      <Statistic title="Active Users" value={112893} formatter={formatter} />

      <Statistic title="Account Balance (CNY)" value={112893} precision={2} formatter={formatter} />

  </Row>

        <div className="logo-container">
          <img src="DMS-LOGO.png" alt="Logo" className="login-logo" />
          <ConnectButton style={{borderRadius: '11px', backgroundColor: 'white', color: 'red', border: '0px solid red'}}/>
        </div>
          <ConnectDialog />
      </Card>
    </div>
  );
}

export default LoginPage;
