import React, { useState } from "react";
import { Form, Input, Upload, Button, DatePicker, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const TravelSubmitPage = () => {
  const [form] = Form.useForm();
  const [uploadFileList, setUploadFileList] = useState([]);

  // 表单提交
  const onFinish = async (values) => {
    // 把上传图片的地址提取出来（后端需要的话）
    const images = uploadFileList.map((file) => file.url || file.response?.url);

    const travelData = {
      title: values.title,
      content: values.content,
      images: images,
    };

    try {
      // ======= 后端交互：提交游记数据 =======
      await axios.post(
        "http://localhost:3001/api/travelNote/submit",
        travelData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("游记提交成功！");
      form.resetFields();
      setUploadFileList([]);
    } catch (error) {
      message.error("提交失败，请检查网络或后端接口");
    }
  };

  return (
    <div style={{ alignItems: "right", height: "inherit", padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>提交游记</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          author: "",
          title: "",
          content: "",
        }}
      >
        <Form.Item
          label="作者"
          name="author"
          rules={[{ required: true, message: "请输入作者名" }]}
        >
          <Input placeholder="请输入作者名" />
        </Form.Item>

        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: "请输入游记标题" }]}
        >
          <Input placeholder="请输入游记标题" />
        </Form.Item>

        <Form.Item
          label="日期"
          name="date"
          rules={[{ required: true, message: "请选择日期" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="正文内容"
          name="content"
          rules={[{ required: true, message: "请输入游记内容" }]}
        >
          <TextArea rows={6} placeholder="请输入游记内容..." />
        </Form.Item>

        <Form.Item label="上传图片">
          <Upload
            // ======= 后端交互：图片上传接口 =======
            action="http://localhost:3001/upload" // 你的图片上传接口
            listType="picture"
            fileList={uploadFileList}
            onChange={({ fileList }) => setUploadFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>选择图片</Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" size="large">
            提交游记
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TravelSubmitPage;
