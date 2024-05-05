import { Ticket } from "@/models/models";
import {formatTicketStatus, handleResponseStatus, SERVER_ORIGIN} from "./generalUtilities";
import {createClient} from "@/utilities/supabase/client";
import { compareSync } from "bcrypt-ts";
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET_KEY!;

// TODO: delete this function
export const adminLoginOld = (credential: { email: string; password: string }) => {
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

export const adminLogin = async (credential: { email: string; password: string }) => {
  return getAdminInfoByEmail(credential.email)
    .then((data) => {
      if (compareSync(credential.password, data?.hash)) {
        // set and store JWT
        localStorage.setItem("adminEmail", credential.email);
        const token = jwt.sign({email: credential.email}, JWT_SECRET_KEY.toString(), {
          expiresIn: '1 day',
          algorithm: 'HS256',
        });
        localStorage.setItem("authToken", token);
        return true
      } else {
        console.log("Login failed")
        throw new Error("The password does not match the record");
      }
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error.message);
    });
}

const getAdminInfoByEmail = async (email: string) => {
  const {data, error} = await createClient()
    .from("admins")
    .select("hash")
    .eq("email", email)
    .limit(1)
    .single();

  if (error) {
    throw new Error("The user does not exist");
  }

  return data;
}

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
  const {data, error} = await createClient()
    .from("helpdesk_ticket")
    .select(`
      *,
      users(*)
    `)
    .is("archived_at", null)

  if (error) {
    throw new Error("Fail to get tickets");
  }

  let tickets: Ticket[] = [];
  data.forEach((ticket: any) => {
    tickets.push({
      id: ticket.id,
      userId: ticket.user_id,
      issueDescription: ticket.issue_description,
      status: formatTicketStatus(ticket.status),
      adminResponse: ticket.admin_response,
      firstName: ticket.users.first_name,
      lastName: ticket.users.last_name,
      email: ticket.users.email,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
    });
  });

  return { tickets: tickets };
}

export async function getAllTicketsOld(): Promise<{ tickets: Ticket[] }> {
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

export const updateTicketStatus = async (
  ticketId: number,
  status: string,
  adminResponse: string,
) => {
  const {error} = await createClient()
    .from("helpdesk_ticket")
    .update({status: status, admin_response: adminResponse})
    .eq("id", ticketId);

  if (error) {
    throw new Error("Fail to update ticket status");
  }
}

export const updateTicketStatusOld = (
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
