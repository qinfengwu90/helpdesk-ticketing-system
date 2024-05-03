import CreateTicketBox from "./CreateTicketBox";
import React from "react";
import AllUserTickets from "./AllUserTickets";

function UserView() {
    return (
        <div className={"flex flex-col gap-y-2"}>
            <div
                className={
                    "md:min-h-[280px] bg-white rounded-lg py-5 flex flex-row place-content-center"
                }
            >
                <CreateTicketBox/>
            </div>
            <div
                className={
                    "md:min-h-[280px] bg-white rounded-lg py-5 flex flex-row place-content-center"
                }
            >
                <AllUserTickets/>
            </div>
        </div>
    );
}

export default UserView;
