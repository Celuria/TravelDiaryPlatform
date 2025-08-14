import React from "react";
import "./Firstpage.css"; // Assuming you have a CSS file for styling
const Firstpage = () => {
  return (
    <div className="first-page-container">
      <div className="first-page-content">
        <h1 className="first-page-title">欢迎来到 游记审核系统</h1>

        <p className="first-page-description">
          在这里，您可以高效地管理和审核来自各地的旅行故事，<br />
          发现世界的美好，记录每一次精彩瞬间。
        </p>

        <button
          className="first-page-button"
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          开始体验
        </button>
      </div>
    </div>
  );
};

export default Firstpage;
