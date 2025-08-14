import React from "react";

const Personalpage = () => {
  return (
    <div
      style={{
        width: "700px",
        margin: "2rem auto",
        background: "linear-gradient(135deg, #ffffff, #f3f6ff)",
        borderRadius: "20px",
        padding: "2rem",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#333",
      }}
    >
      {/* 头像 + 昵称 */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img
          src="https://i.pravatar.cc/150?img=3"
          alt="avatar"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: "4px solid #fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <h2 style={{ marginTop: "1rem", fontWeight: "bold" }}>用户名</h2>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          这是一句个性签名，记录心情~
        </p>
      </div>

      {/* 个人信息 */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "0.5rem" }}>
          个人信息
        </h3>
        <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0" }}>
          <li style={{ margin: "0.5rem 0" }}>
            <strong>邮箱：</strong> user@example.com
          </li>
          <li style={{ margin: "0.5rem 0" }}>
            <strong>注册时间：</strong> 2025-08-14
          </li>
          <li style={{ margin: "0.5rem 0" }}>
            <strong>已审核游记：</strong> 25 篇
          </li>
        </ul>
      </div>

      {/* 按钮操作 */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          style={{
            background: "linear-gradient(90deg, #74ABE2, #5563DE)",
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#fff",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          编辑资料
        </button>
        <button
          style={{
            background: "#f04e4e",
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#fff",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Personalpage;
