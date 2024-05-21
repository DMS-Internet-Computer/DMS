import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react";
import { useState } from 'react';
import { Card } from 'antd';
import './LoginPage.css'; // Özel CSS dosyası

function LoginPage() {
 // Yazılacak metin

  return (
    <div className="login-page-container">
      <div className="background-overlay"></div>
      <Card className="login-card">
        <div className="logo-container">
          <img src="DMS-LOGO.png" alt="Logo" className="login-logo" />
          <ConnectButton style={{borderRadius: '11px', backgroundColor: 'white', color: 'red', border: '2px solid red', fontWeight: 'bold'}}/>
        </div>
        <ConnectDialog />
      </Card>
    </div>
  );
}

export default LoginPage;
