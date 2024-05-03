import {Button, Form, Input, message, Space} from "antd";
import {createTicket} from "@/utilities/userUtilities";
import {MailOutlined, UserOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

function CreateTicketBox() {
    const [form] = Form.useForm();

    const onFinish = (data: {
        email: string;
        description: string;
        firstName: string;
        lastName: string;
    }) => {
        createTicket(data.email, data.description, data.firstName, data.lastName)
            .then(() => {
                localStorage.setItem("userEmail", data.email);
                localStorage.setItem("userLastName", data.lastName);
                localStorage.setItem("userFirstName", data.firstName);
                message.success({
                    content: `Your ticket has been created`,
                    duration: 3,
                });
                setTimeout(() => {
                    resetFields();
                    window.location.reload();
                }, 1500)
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    const resetFields = () => {
        form.resetFields();
    };

    return (
        <div className={"flex flex-col gap-y-3 xs:w-4/5 sm:w-1/2 lg:w-1/3 justify-items-stretch"}>
            <div className={"!text-center font-semibold text-lg md:text-2xl"}>
                Create a help desk ticket
            </div>
            <Form
                form={form}
                layout={"vertical"}
                name={"new_ticket"}
                onFinish={onFinish}
                preserve={false}
            >
                <Form.Item
                    label={"Email"}
                    name={"email"}
                    rules={[{required: true, message: "Please input your email"}]}
                >
                    <Input prefix={<MailOutlined/>}/>
                </Form.Item>
                <Form.Item
                    label={"First Name"}
                    name={"firstName"}
                    rules={[{required: true, message: "Please input your first name"}]}
                >
                    <Input prefix={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item
                    label={"Last Name"}
                    name={"lastName"}
                    rules={[{required: true, message: "Please input your last name"}]}
                >
                    <Input prefix={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item
                    label={"Description"}
                    name={"description"}
                    rules={[
                        {
                            required: true,
                            message: "Please enter the description of the issue",
                        },
                    ]}
                >
                    <TextArea/>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button htmlType="submit">Create ticket</Button>
                        <Button
                            onClick={() => resetFields()}
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

export default CreateTicketBox;
