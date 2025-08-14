import React, { useState, useEffect } from "react";
import "./Auditpage.css";
import {
  Input,
  DatePicker,
  Checkbox,
  Table,
  Tag,
  Button,
  Space,
  Popconfirm,
  message,
} from "antd";

const { Search } = Input;

const Auditpage = () => {
  const [data, setData] = useState([]); // 游记列表
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState(null);


  // 获取游记数据
  const fetchData = async () => {};

  useEffect(() => {
    fetchData();
  }, [searchKeyword, dateFilter, statusFilter]);

  // 表格列配置
  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "提交时间",
      dataIndex: "submitTime",
      key: "submitTime",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "已通过"
            ? "green"
            : status === "未通过"
            ? "red"
            : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => message.info(`查看详情：${record.title}`)}
          >
            查看
          </Button>
          <Popconfirm
            title="确认通过吗？"
            onConfirm={() => handleApprove(record.id)}
          >
            <Button type="link">通过</Button>
          </Popconfirm>
          <Popconfirm
            title="确认驳回吗？"
            onConfirm={() => handleReject(record.id)}
          >
            <Button type="link" danger>
              驳回
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 审核操作
  const handleApprove = (id) => {
    message.success(`已通过 ID ${id}`);
    // 这里调用后端 API 更新状态
  };
  const handleReject = (id) => {
    message.warning(`已驳回 ID ${id}`);
    // 这里调用后端 API 更新状态
  };

  return (
    <div className="audit-page-max">
      <div className="audit-page-select">
        <div className="search-input-box">
          <Search
            className="search-input"
            placeholder="输入关键字"
            onSearch={(value) => setSearchKeyword(value)}
          />
        </div>

        <div className="date-picker-box">
          <DatePicker
            className="date-picker"
            onChange={(date, dateString) => setDateFilter(dateString)}
            placeholder="选择日期"
          />
        </div>

        <div className="checkbox-group-box">
          <Checkbox.Group
            className="checkbox-group"
            onChange={(values) => setStatusFilter(values)}
          >
            <Checkbox value="全部">全部</Checkbox>
            <Checkbox value="待审核">待审核</Checkbox>
            <Checkbox value="已通过">已通过</Checkbox>
            <Checkbox value="未通过">未通过</Checkbox>
          </Checkbox.Group>
        </div>
      </div>

      {/* 游记列表 */}
      <div className="audit-page-content">
        <Table
          className="audit-page-table"
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default Auditpage;
