import { Ticket } from "@/models/models";
import { handleResponseStatus, SERVER_ORIGIN } from "./generalUtilities";

export const adminLogin = (credential: { email: string; password: string }) => {
  const loginUrl = `${SERVER_ORIGIN}/admins/login`;

  // call the api to login
  return fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  })
    .then((response) => {
      if (!response.ok) {
        throw Error("Fail to log in");
      }
      localStorage.setItem("adminEmail", credential.email);
      return response.json();
    })
    .then((token: { token: string }) => {
      localStorage.setItem("authToken", token.token);
    });
};

export const registerAdmin = (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  const url = `${SERVER_ORIGIN}/admins/register-admin`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify({
      adminEmail: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    }),
  }).then((response) => {
    handleResponseStatus(response, "Fail to register");
  });
};

export const changeAdminPassword = (
  email: string,
  oldPassword: string,
  newPassword: string,
) => {
  const url = `${SERVER_ORIGIN}/admins/change-password`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify({
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
    }),
  }).then((response) => {
    handleResponseStatus(response, "Fail to change password");
  });
};

export async function getAllTickets(): Promise<{ tickets: Ticket[] }> {
  const url = `${SERVER_ORIGIN}/admins/all-tickets`;

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  }).then((response) => {
    handleResponseStatus(response, "Fail to get tickets");
    return response.json();
  });
}

export const updateTicketStatus = (
  ticketId: number,
  status: string,
  adminResponse: string,
) => {
  const url = `${SERVER_ORIGIN}/admins/update-ticket-status`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify({
      ticketId: ticketId,
      status: status,
      adminResponse: adminResponse,
    }),
  }).then((response) => {
    handleResponseStatus(response, "Fail to update ticket status");
  });
};
