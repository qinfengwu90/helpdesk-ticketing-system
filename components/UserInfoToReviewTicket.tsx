import {Button, Form, Input, message, Space} from "antd";
import {getAllTicketsAndEmailUpdatesForUser} from "@/utilities/userUtilities";
import {MailOutlined, UserOutlined} from "@ant-design/icons";
import {Notification, Ticket} from "@/models/models";

function UserInfoToReviewTicket({
                                    onSuccess,
                                }: {
    onSuccess: (tickets: Ticket[], emails: Notification[]) => void;
}) {
    const [form] = Form.useForm();
    const onFinish = (data: { email: string; lastName: string }) => {
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userLastName", data.lastName);
        getAllTicketsAndEmailUpdatesForUser(data.email, data.lastName)
            .then((value) => {
                // onSuccess(value.tickets, value.emails);
                window.location.reload();
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    return (
        <div className={"flex flex-col gap-y-3 xs:w-4/5 sm:w-1/2 lg:w-1/3 justify-items-stretch"}>
            <div className={"!text-center font-semibold text-lg md:text-2xl whitespace-normal"}>
                Retrieve all your tickets
            </div>

            <Form
                form={form}
                name={"user_login"}
                onFinish={onFinish}
                preserve={false}
                layout={"vertical"}
            >
                <Form.Item
                    label={"Email"}
                    name={"email"}
                    rules={[{required: true, message: "Please input your email"}]}
                >
                    <Input prefix={<MailOutlined/>}/>
                </Form.Item>
                <Form.Item
                    label={"Last Name"}
                    name={"lastName"}
                    rules={[{required: true, message: "Please input your last name"}]}
                >
                    <Input prefix={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button htmlType="submit">Retrieve tickets</Button>
                        <Button
                            htmlType={"reset"}
                            style={{background: "darkred", color: "white"}}
                        >
                            Reset
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UserInfoToReviewTicket;
