import {useState, useEffect} from "react";
import "./Login.css";
import { Input, Button, Radio, Form, message} from "antd";


function Login() {
  const [rememberPassword, setRememberPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRadioClick = () => {
    setRememberPassword((prev) => !prev); // 每次点击切换 true/false
  };

 // 检查本地存储中是否有记住的用户名和密码
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberPassword(true);
    }
  }, []);


  const summitLoginForm = async () => {
    
    console.log("Submitting form with Username:", username, "and Password:", password);
    try {
        const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // 登录成功
        const { token } = data;
        localStorage.setItem("token", token); // 将 token 存储到本地存储
         // 如果记住密码被选中，存储用户名和密码
        if (rememberPassword) {
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
        } else {
          // 如果取消记住密码，清除本地存储
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }
        message.success("登录成功");
        // 可以跳转到其他页面
      } else {
        // 登录失败
        message.error(data.message || "登录失败");
        console.log(data)
      }
    } catch (error) {
      console.error("登录失败:", error);
      message.error("登录失败，请检查网络或联系管理员");
    }
  };

  const summitRegisterForm = async () => {
    console.log("Submitting registration form with Username:", username, "and Password:", password);
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // 注册成功
        message.success("注册成功");
        // 如果记住密码被选中，存储用户名和密码
        if (rememberPassword) {
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
        }
        // 可以跳转到其他页面
      } else {
        // 注册失败
        message.error(data.message || "注册失败");
      }
    } catch (error) {
      console.error("注册失败:", error);
      message.error("注册失败，请检查网络或联系管理员");
    } 
  }

  return (
    <div className="login-max-box">
      <div className="login-content-box">
        <Form className="login-users-info">
          <Input
            type="text"
            className="login-input-id"
            autoComplete="username"
            placeholder="账号"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></Input>
          <Input.Password
            type="password"
            className="login-input-password"
            autoComplete="current-password"
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
