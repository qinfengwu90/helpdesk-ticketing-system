import { handleResponseStatus, SERVER_ORIGIN } from "./generalUtilities";
import { Notification, Ticket } from "@/models/models";
export async function getAllTicketsAndEmailUpdatesForUser(
  userEmail: string,
  lastName: string,
): Promise<{ tickets: Ticket[]; emails: Notification[] }> {
  const url = `${SERVER_ORIGIN}/users/all-tickets-and-email-updates`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail: userEmail, lastName: lastName }),
  }).then((response) => {
    handleResponseStatus(response, "Fail to get tickets");
    return response.json();
  });
}

export const createTicket = (
  email: string,
  description: string,
  firstName: string,
  lastName: string,
) => {
  const url = `${SERVER_ORIGIN}/users/create-ticket`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userEmail: email,
      issueDescription: description,
      firstName: firstName,
      lastName: lastName,
    }),
  }).then((response) => {
    handleResponseStatus(response, "Fail to create ticket");
  });
};

export const editTicket = (
  email: string,
  ticketId: string,
  description: string,
) => {
  const url = `${SERVER_ORIGIN}/users/edit-ticket`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      ticketId: ticketId,
      issueDescription: description,
    }),
  }).then((response) => {
    handleResponseStatus(response, "Fail to update ticket");
  });
};
