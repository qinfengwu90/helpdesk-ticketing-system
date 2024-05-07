'use client'

import {Button, Drawer, Layout} from "antd";
import {useState, useEffect} from "react";
import {LayoutOutlined} from "@ant-design/icons";
import AdminLogin from "@/components/AdminLogin";
import UserView from "@/components/UserView";
import AdminTicketView from "@/components/AdminTicketView";

const {Header, Content, Footer} = Layout;

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

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
    <Layout style={{"minHeight":"100vh"}}>
      <Header
        className={"px-5 md:px-10 flex flex-row items-center justify-between"}
      >
        <div className={"text-white font-semibold text-sm md:text-lg gap-x-1"}>
          <LayoutOutlined/> Help Desk Ticketing System
        </div>
        <div className={"flex flex-row gap-x-2"}>
          {authed ? (
            <>
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
          <Button shape="round" onClick={() => setDrawerOpen(true)} ghost={true}>
            Instructions
          </Button>
        </div>
      </Header>
      <Content className={"px-5 pt-5 md:px-10 md:pt-10"}>
        <Drawer title={"Instruction"} onClose={() => setDrawerOpen(false)} open={drawerOpen}>
          <div className={"flex flex-col gap-y-4 text-base"}>
            <p>Please use <b>email: <code>admin@qinfengwu.com</code></b>, <b>password: <code>1234567890</code></b> to log in as admin</p>
            <p>Click &quot;Instruction&quot; on the upper right corner to access this info again</p>
          </div>
        </Drawer>
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
