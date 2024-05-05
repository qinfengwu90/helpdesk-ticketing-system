import {useState} from "react";
import {adminLogin} from "@/utilities/adminUtilities";
import {Button, Form, Input, message, Modal} from "antd";
import {LockOutlined, MailOutlined} from "@ant-design/icons";

function AdminLogin({onLoginSuccess}: { onLoginSuccess: () => void }) {
  const [displayModal, setDisplayModal] = useState(false);

  const handleCancel = () => {
    setDisplayModal(false);
  };

  const signinOnClick = () => {
    setDisplayModal(true);
  };

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: {
    email: string;
    password: string;
  }) => {
    setLoading(true);

    // try {
    //   await adminLogin(data);
    //   onLoginSuccess();
    // } catch (err: any) {
    //   message.error(err.message);
    // } finally {
    //   setLoading(false);
    //   setDisplayModal(false);
    // }

    adminLogin(data)
      .then(() => {
        onLoginSuccess();
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
        setDisplayModal(false);
      })
  };

  return (
    <>
      <Button shape="round" onClick={signinOnClick} className={"bg-white"}>
        Admin Login
      </Button>
      <Modal
        title="Log in"
        open={displayModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Form name="normal_login" onFinish={handleFormSubmit} preserve={false}>
          <Form.Item
            name="email"
            rules={[{required: true, message: "Please input your email"}]}
          >
            <Input prefix={<MailOutlined/>} placeholder="Email"/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{required: true, message: "Please input your password"}]}
          >
            <Input.Password prefix={<LockOutlined/>} placeholder="Password"/>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Login</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AdminLogin;
