import {Button, message, Modal} from "antd";
import React, {useState} from "react";
import {deleteTicket} from "@/utilities/generalUtilities";

function DeleteTicket({
                          ticketId,
                          getAllTickets,
                      }: {
    ticketId: number;
    getAllTickets: () => void;
}) {
    const [displayModal, setDisplayModal] = useState(false);

    const handleCancel = () => {
        setDisplayModal(false);
    };

    const openDeleteModalOnClick = () => {
        setDisplayModal(true);
    };

    const deleteTicketOnClick = (ticketId: number) => {
        deleteTicket(ticketId)
            .then(() => {
                setDisplayModal(false);
                getAllTickets();
                message.success("Successfully deleted ticket");
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    return (
        <>
            <Button
                onClick={openDeleteModalOnClick}
                style={{background: "darkred", color: "white"}}
            >
                Delete Ticket
            </Button>
            <Modal
                title="Delete Ticket"
                open={displayModal}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose={true}
            >
                <div className={"flex flex-col gap-y-2"}>
                    <h1>
                        <strong>Are you sure to delete ticket: #{ticketId}?</strong>
                    </h1>
                    <div className={"flex flex-row gap-x-2"}>
                        <Button
                            htmlType={"submit"}
                            onClick={(e) => deleteTicketOnClick(ticketId)}
                            style={{background: "darkred", color: "white"}}
                        >
                            Delete
                        </Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default DeleteTicket;
