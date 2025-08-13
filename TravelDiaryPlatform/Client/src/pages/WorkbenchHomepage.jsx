import { useState } from "react";
import { Layout, Menu, Avatar, Modal, Button } from "antd";
import {
  HomeOutlined,
  AuditOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./WorkbenchHomepage.css";

import Firstpage from "../assets/Firstpage";
import Auditpage from "../assets/Auditpage";
import Personalpage from "../assets/Personalpage";

const { Header, Sider, Content } = Layout;
function WorkbenchHomepage(){
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState("1"); // 默认首页
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
    };

    const showSettings = () => {
        setIsModalVisible(true);
    };

    const hideSettings = () => {
        setIsModalVisible(false);
    };

    const renderContent = () => {
        switch (selectedKey) {
            case "1":
                return <Firstpage />;
            case "2":
                return <Auditpage />;
            case "3":
                return <Personalpage/>;
            default:
                return <Firstpage />;
        }
    };

    return (
      <Layout className="workbench-layout">
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          className="workbench-sider"
        >
          <div className="logo-box">
            <img src="/logo.jpeg" alt="logo" className="logo-img" />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={[
              {
                key: "1",
                icon: <HomeOutlined />,
                label: "首页",
              },
              {
                key: "2",
                icon: <AuditOutlined />,
                label: "审核内容页",
              },
              {
                key: "3",
                icon: <UserOutlined />,
                label: "个人中心",
              },
            ]}
          />
        </Sider>

        <Layout>
          <Header className="workbench-header">
            <div className="header-left"></div>
            <div className="header-right">
              <Button
                type="text"
                icon={<SettingOutlined />}
                onClick={showSettings}
              >
                设置
              </Button>
            </div>
          </Header>

          {<Content className="workbench-content">{renderContent()}</Content>}
        </Layout>

        <Modal
          title="系统设置"
          open={isModalVisible}
          onCancel={hideSettings}
          footer={[
            <Button key="close" onClick={hideSettings}>
              关闭
            </Button>,
          ]}
        >
          <p>这里是设置内容</p>
        </Modal>
      </Layout>
    );
}

export default WorkbenchHomepage;