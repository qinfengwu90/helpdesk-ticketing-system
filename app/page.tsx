'use client'

import {Button, Layout} from "antd";
import {useState, useEffect} from "react";
import {LayoutOutlined} from "@ant-design/icons";
import AdminLogin from "@/components/AdminLogin";
import UserView from "@/components/UserView";
import AdminTicketView from "@/components/AdminTicketView";

const {Header, Content, Footer} = Layout;

export default function Home() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthed(authToken !== null);
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    setAuthed(false);
  };

  const handleLoginSuccess = () => {
    setAuthed(true);
  };

  return (
    <Layout>
      <Header
        className={"px-5 md:px-10 flex flex-row items-center justify-between"}
      >
        <div className={"text-white font-semibold text-sm md:text-lg gap-x-1"}>
          <LayoutOutlined/> Help Desk Ticketing System
        </div>
        <div>
          {authed ? (
            <>
              {/*<ChangeAdminPassword />*/}
              {/*<AdminRegister />*/}
              <Button
                shape={"round"}
                onClick={handleLogOut}
                className={"bg-white"}
              >
                Log out
              </Button>
            </>
          ) : (
            <AdminLogin onLoginSuccess={handleLoginSuccess}/>
          )}
        </div>
      </Header>
      <Content className={"px-5 pt-5 md:px-10 md:pt-10"}>
        {authed ? (
          <AdminTicketView/>
        ) : (
          <UserView/>
        )}
      </Content>
      <Footer className={"px-5 md:px-10"}>
        ©{new Date().getFullYear()} Qinfeng Wu
      </Footer>
    </Layout>
  );
}
