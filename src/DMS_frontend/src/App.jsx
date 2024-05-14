import { useEffect, useState } from 'react';
import { DMS_backend } from 'declarations/DMS_backend';
import { useConnect } from "@connect2ic/react";
import {Layout} from 'antd';
import LoginPage from './components/LoginPage/LoginPage';
import MainPage from './components/MainPage/MainPage';

const { Header, Sider, Content } = Layout;

function App() {
  const { isConnected, principal } = useConnect({
    onConnect: () => {
    },
    onDisconnect: () => {
    }
  });


  return (
    <main>
      {(isConnected && principal) ? <MainPage /> : <LoginPage />}
    </main>
  );
}

export default App;
