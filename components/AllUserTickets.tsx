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

    console.log("initial userEmail", userEmail, "initial userLastName", userLastName);

    if (userEmail && userLastName) {
      getAllTicketsAndEmailUpdatesForUser(userEmail, userLastName)
        .then((value) => {
          console.log(value);
          let tickets = [];
          if (value.tickets?.length > 0) {
            tickets = value.tickets[0].helpdesk_ticket;
          }
          onSuccess(tickets, value?.emails);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const onSuccess = (
    retrievedTickets: any[],
    retrievedEmails: any[],
  ) => {
    setCorrectUserInfoEntered(!correctUserInfoEntered);
    console.log("retrievedTickets", retrievedTickets, "retrievedEmails", retrievedEmails);
    if (retrievedTickets !== null) {
      retrievedTickets.forEach((ticket, index) => {
        console.log("each ticket", ticket);
        retrievedTickets[index].status = formatTicketStatus(ticket.status);
      });
      setTickets([...retrievedTickets] as Ticket[]);
    }
    if (retrievedEmails !== null) {
      let emails: Notification[] = []
      retrievedEmails.forEach((email) => {
        emails.push({
          id: email.id,
          ticketId: email.ticket_id,
          message: email.message,
          createdAt: new Date(email.created_at),
        });
        setEmails([...emails]);
      })
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
