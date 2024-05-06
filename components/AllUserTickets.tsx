"use client"
import { useEffect, useState } from "react";
import { Notification, Ticket } from "@/models/models";
import UserInfoToReviewTicket from "./UserInfoToReviewTicket";
import UserExistingTickets from "./UserExistingTickets";
import { getAllTicketsAndEmailUpdatesForUser } from "@/utilities/userUtilities";

function AllUserTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [emails, setEmails] = useState<Notification[]>([]);
  const [correctUserInfoEntered, setCorrectUserInfoEntered] = useState(false);

  const onSuccess = (
    retrievedTickets: Ticket[],
    retrievedEmails: Notification[],
  ) => {
    setCorrectUserInfoEntered(!correctUserInfoEntered);
    setTickets([...retrievedTickets]);
    setEmails([...retrievedEmails]);
  };

  useEffect(() => {
    let userEmail = localStorage.getItem("userEmail");
    let userLastName = localStorage.getItem("userLastName");

    if (userEmail && userLastName) {
      getAllTicketsAndEmailUpdatesForUser(userEmail, userLastName)
        .then((value) => {
          onSuccess(value?.tickets, value?.emails);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

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
