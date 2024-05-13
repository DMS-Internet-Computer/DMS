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
  useEffect(() => {
    const createUser = async () => {
      try {
        if (!principal) {
          console.log("Waiting for principal...");
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log("Creating user...");
        await DMS_backend.create_user(principal);
        console.log("User created.");
      } catch (error) {
        console.error("Error during user creation:", error);
      }
    };

    if (isConnected) {
      createUser();
    }
  }, []);


  
  return (
    <main>
      {isConnected ? <MainPage /> : <LoginPage />}
    </main>
  );
}

export default App;
