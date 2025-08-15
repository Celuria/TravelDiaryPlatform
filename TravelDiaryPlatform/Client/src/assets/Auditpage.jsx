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
  Modal,
} from "antd";
import axios from "axios";

const { Search } = Input;

const Auditpage = () => {
  const [allData, setAllData] = useState([]); // 原始游记数据
  const [data, setData] = useState([]); // 筛选后的游记数据
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 获取游记数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/audit/list", {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("请求失败");
      }

      const result = await response.json();
      const formattedData = result.list.map((item) => ({
        ...item,
        id: item._id,
        author: item.userId?.username || "未知",
        status:
          item.status === "pending"
            ? "待审核"
            : item.status === "approved"
            ? "已通过"
            : "未通过",
        submitTime: new Date(item.createdAt).toLocaleDateString(),
      }));

      setAllData(formattedData); // 保存完整数据
      setData(formattedData); // 初始显示
    } catch (error) {
      message.error("获取游记数据失败，请稍后再试");
    }
    setLoading(false);
  };

  // 前端筛选逻辑
  const applyFilters = () => {
    let filtered = [...allData];

    // 按关键字筛选（标题或作者）
    if (searchKeyword) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.author.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 按日期筛选
    if (dateFilter) {
      filtered = filtered.filter((item) => item.submitTime === dateFilter);
    }

    // 按状态筛选
    if (statusFilter.length > 0 && !statusFilter.includes("全部")) {
      filtered = filtered.filter((item) =>
        statusFilter.includes(item.status)
      );
    }

    setData(filtered);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchKeyword, dateFilter, statusFilter, allData]);

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
            onClick={() => handleViewDetail(record.id)}
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
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:3001/api/audit/operate`,
        { noteId: id, action: "approve" },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then(() => {
        message.success(`已通过 ID ${id}`);
        fetchData();
      })
      .catch(() => {
        message.error(`通过失败 ID ${id}`);
      });
  };

  const handleReject = (id) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:3001/api/audit/operate`,
        { noteId: id, action: "reject", reason: "游记中含有违规内容" },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then(() => {
        message.success(`已驳回 ID ${id}`);
        fetchData();
      })
      .catch(() => {
        message.error(`驳回失败 ID ${id}`);
      });
  };

  // 查看详情
  const handleViewDetail = async (id) => {
    setDetailLoading(true);
    setDetailModalVisible(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/audit/detail/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("获取详情失败");
      const data = await response.json();
      setCurrentNote(data);
    } catch (e) {
      message.error("获取游记详情失败");
      setCurrentNote(null);
    }
    setDetailLoading(false);
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
      <Modal
        title={currentNote ? currentNote.title : "游记详情"}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
        confirmLoading={detailLoading}
      >
        {detailLoading ? (
          <div>加载中...</div>
        ) : currentNote ? (
          <div>
            <p><b>作者：</b>{currentNote.userId?.username || "未知"}</p>
            <p><b>提交时间：</b>{new Date(currentNote.createdAt).toLocaleString()}</p>
            <p><b>状态：</b>{currentNote.status === "pending" ? "待审核" : currentNote.status === "approved" ? "已通过" : "未通过"}</p>
            {currentNote.status === "rejected" && (
              <p><b>驳回原因：</b>{currentNote.rejectReason || "无"}</p>
            )}
            <hr />
            <div style={{ whiteSpace: "pre-wrap", marginBottom: 16 }}>
              {currentNote.content}
            </div>
            {/* 显示图片 */}
            {Array.isArray(currentNote.images) && currentNote.images.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <b>图片：</b>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {currentNote.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`游记图片${idx + 1}`}
                      style={{ maxWidth: 120, maxHeight: 120, borderRadius: 4, border: "1px solid #eee" }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>暂无内容</div>
        )}
      </Modal>
    </div>
  );
};

export default Auditpage;
