import { useEffect, useState } from "react";
import { Notification, Ticket } from "@/models/models";
import UserInfoToReviewTicket from "./UserInfoToReviewTicket";
import UserExistingTickets from "./UserExistingTickets";
import { formatTicketStatus } from "@/utilities/generalUtilities";
import {
  getAllTicketsAndEmailUpdatesForUser } from "@/utilities/userUtilities";

function AllUserTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [emails, setEmails] = useState<Notification[]>([]);
  const [correctUserInfoEntered, setCorrectUserInfoEntered] = useState(false);

  useEffect(() => {
    let userEmail = localStorage.getItem("userEmail");
    let userLastName = localStorage.getItem("userLastName");

    if (userEmail && userLastName) {
      getAllTicketsAndEmailUpdatesForUser(userEmail, userLastName)
        .then((value) => {
          console.log(value);
          // onSuccess(value.tickets, value.emails);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const onSuccess = (
    retrievedTickets: Ticket[],
    retrievedEmails: Notification[],
  ) => {
    setCorrectUserInfoEntered(!correctUserInfoEntered);
    if (retrievedTickets !== null) {
      retrievedTickets.forEach((ticket, index) => {
        retrievedTickets[index].status = formatTicketStatus(ticket.status);
      });
      setTickets([...retrievedTickets]);
    }
    if (retrievedEmails !== null) {
      setEmails([...retrievedEmails]);
    }
  };

  const onLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userFirstName");
    setCorrectUserInfoEntered(false);
    setTickets([]);
    setEmails([]);
    window.location.reload();
  };

  return (
    <>
      {!correctUserInfoEntered ? (
        <UserInfoToReviewTicket onSuccess={onSuccess} />
      ) : (
        <UserExistingTickets
          tickets={tickets}
          emails={emails}
          onLogout={onLogout}
        />
      )}
    </>
  );
}

export default AllUserTickets;
