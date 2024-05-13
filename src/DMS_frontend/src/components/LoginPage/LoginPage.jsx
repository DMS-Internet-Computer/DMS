import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react"

function LoginPage() {
    return (
      <div className="login-page">
        <div className="login-page-left">
          <p>Login Page - 3D Animation Part</p>
        </div>
        <div className="login-page-right">
          <p>Login Page - Authentication Part</p>
          <ConnectButton />
          <ConnectDialog />
        </div>
      </div>
    );
  }

  export default LoginPage;