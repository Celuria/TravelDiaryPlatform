import {useState } from "react";
import "./Login.css";
import { Input, Button, Radio, Form } from "antd";

function Login() {
  const [rememberPassword, setRememberPassword] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleRadioClick = () => {
    setRememberPassword((prev) => !prev); // 每次点击切换 true/false
  };

  const summitLoginForm = (id, password) => {
    console.log("Submitting form with ID:", id, "and Password:", password);
    // 在这里可以添加表单提交逻辑，例如调用API进行登录验证
    // 如果 rememberPassword 为 true，可以将 id 和 password 存储在本地
  };

  const summitRegisterForm = (id, password) => {
    console.log("Submitting registration form with ID:", id, "and Password:", password);
    // 在这里可以添加注册逻辑，例如调用API进行用户注册
    // 如果 rememberPassword 为 true，可以将 id 和 password 存储在本地
  }

  return (
    <div className="login-max-box">
      <div className="login-content-box">
        <Form className="login-users-info">
          <Input
            type="primary"
            className="login-input-id"
            placeholder="账号"
            value={id}
            onChange={(e) => setId(e.target.value)}
          ></Input>
          <Input.Password
            type="primary"
            className="login-input-password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input.Password>
        </Form>

        <div className="login-button-container">
          <div>
            <Radio checked={rememberPassword} onClick={handleRadioClick}>
              记住密码
            </Radio>
          </div>
          <div className="login-button-box">
            <Button
              className="login-button"
              type="primary"
              onClick={summitLoginForm}
            >
              登录
            </Button>
            <Button
              className="login-button"
              type="primary"
              onClick={summitRegisterForm}
            >
              注册
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
