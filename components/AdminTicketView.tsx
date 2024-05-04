import React, {useEffect, useState} from "react";
import {Ticket} from "@/models/models";
import {getAllTickets, updateTicketStatus} from "@/utilities/adminUtilities";
import {Button, Card, CascaderProps, Form, message, Modal, Select, Space, Table, TableProps} from "antd";
import TextArea from "antd/es/input/TextArea";
import DeleteTicket from "./DeleteTicket";

function AdminTicketView() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticket, setTicket] = useState<Ticket>({} as Ticket);
  const [displayModal, setDisplayModal] = useState(false);

  const statusPriority = (status: string) => {
    switch (status) {
      case "New":
        return 1;
      case "In Progress":
        return 2;
      case "Resolved":
        return 3;
      default:
        return 0;
    }
  }

  const columns: TableProps<Ticket>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      responsive: ["lg"],
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>{record.firstName + " " + record.lastName}</div>
      ),
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Issue",
      dataIndex: "issueDescription",
      key: "issueDescription",
      render: (text, record) => (
        <Space size="middle">
          <a>{record.issueDescription.slice(0, 60)}</a>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ["md"],
      sorter: (a, b) => statusPriority(a.status) - statusPriority(b.status),
    },
    {
      title: "Admin Response",
      dataIndex: "adminResponse",
      key: "adminResponse",
      width: "20%",
      responsive: ["lg"],
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["lg"],
      render: (_, record) => (
        <div>
          {new Date(record.createdAt).toLocaleDateString("en-US", {
            timeZone: "America/New_York",
          })}
        </div>
      ),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      responsive: ["lg"],
      render: (_, record) => (
        <div>
          {new Date(record.updatedAt).toLocaleDateString("en-US", {
            timeZone: "America/New_York",
          })}
        </div>
      ),
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <a className={"text-blue-800"} onClick={() => {
            viewDetailOnClick(record);
          }}>View
          </a>
        </Space>
      ),
    },
  ];

  const ticketStatuses: CascaderProps["options"] = [
    {
      value: "new",
      label: "New",
    },
    {
      value: "in_progress",
      label: "In Progress",
    },
    {
      value: "resolved",
      label: "Resolved",
    },
  ];

  useEffect(() => {
    getAndSetAllTickets();
  }, []);

  const getAndSetAllTickets = () => {
    setDisplayModal(false);
    getAllTickets()
      .then((value) => {
        // setTickets(value.tickets);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const viewDetailOnClick = (ticket: Ticket) => {
    setTicket(ticket);
    setDisplayModal(true);
  };

  const handleUpdateTicket = (data: {
    ticketId: number;
    status: string;
    adminResponse: string;
  }) => {
    updateTicketStatus(data.ticketId, data.status, data.adminResponse)
      .then(() => {
        setDisplayModal(false);
        message.success({
          content: `Ticket #${data.ticketId} has been updated`,
          duration: 3,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500)
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const handleCancel = () => {
    setDisplayModal(false);
  };

  return (
    <div>
      <Table columns={columns} dataSource={tickets}/>
      <Modal
        open={displayModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Card
          key={ticket.id}
          title={
            ticket.firstName +
            " " +
            ticket.lastName +
            " (Ticket #" +
            ticket.id +
            ")"
          }
          bordered={false}
        >
          <Form
            name={"admin_edit_ticket"}
            onFinish={handleUpdateTicket}
            initialValues={{
              "ticketId": ticket.id,
              "status": ticket.status,
              "adminResponse": ticket.adminResponse,
            }}
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
          >
            <Form.Item
              label={<strong>Ticket ID</strong>}
              name={"ticketId"}
              style={{display: "none"}}
            >
              {ticket.id}
            </Form.Item>
            <Form.Item label={<strong>Issue</strong>}>
              <>{ticket.issueDescription}</>
            </Form.Item>
            <Form.Item
              name={"status"}
              label={<strong>Status</strong>}
              rules={[
                {required: true, message: "Please select a status"},
              ]}
            >
              <Select options={ticketStatuses}/>
            </Form.Item>
            <Form.Item
              name={"adminResponse"}
              label={
                <span style={{whiteSpace: "normal"}}>
                        <strong>Admin Response</strong>
                      </span>
              }
            >
              <TextArea/>
            </Form.Item>
            <Form.Item label={<strong>Created At</strong>}>
              {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                timeZone: "America/New_York",
              })}
            </Form.Item>
            <Form.Item label={<strong>Updated At</strong>}>
              {new Date(ticket.updatedAt).toLocaleDateString("en-US", {
                timeZone: "America/New_York",
              })}
            </Form.Item>
            <Form.Item className={"pl-4"}>
              <div
                className={
                  "flex flex-row gap-x-1 justify-between items-center"
                }
              >
                <Button htmlType={"submit"}>Update</Button>
                <DeleteTicket
                  ticketId={ticket.id}
                  getAllTickets={getAndSetAllTickets}
                />
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
}

export default AdminTicketView;
