import { handleResponseStatus, SERVER_ORIGIN } from "./generalUtilities";
import { Notification, Ticket } from "@/models/models";
import {supabase} from "@/utilities/supabase/supabase";
import {createClient} from "@/utilities/supabase/client";

export const getAllTicketsAndEmailUpdatesForUser = async (
  userEmail: string,
  lastName: string,
) => {
  const allTickets = await getAllTicketsForUser(userEmail, lastName);
  const allEmails = await getAllEmailsForUser(userEmail, lastName);
  return { tickets: allTickets, emails: allEmails };
}

async function getAllTicketsForUser(
  userEmail: string,
  lastName: string,
) {
  const {data, error} = await createClient()
    .from("users")
    .select(`
      helpdesk_ticket (*)
     `)
    .eq("email", userEmail)
    .eq("last_name", lastName);

  if (error) {
    throw new Error("Fail to get tickets");
  }

  return data
}

async function getAllEmailsForUser(
  userEmail: string,
  lastName: string,
) {
  const {data, error} = await createClient()
    .from("ticket_notification_email")
    .select(`
      *,
      helpdesk_ticket (*, users (*))
     `)

  console.log("emails", data, "error", error)

  if (error) {
    throw new Error("Fail to get emails");
  }

  return data.filter((email: any) => email.helpdesk_ticket.users.email === userEmail && email.helpdesk_ticket.users.last_name === lastName)
}

// TODO: delete this function
export async function getAllTicketsAndEmailUpdatesForUserOld(
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

export const createTicket = async (
  email: string,
  description: string,
  firstName: string,
  lastName: string,
) => {
  let userId = null;
  let error = null;
  // Check if user exists
  let { data, count } = await createClient()
    .from("users")
    .select("*", {count: "exact"})
    .eq("email", email);

  console.log("user exists", data, "count", count);

  userId = data ? data[0].id : null;

  // if not, create user
  if (count === 0) {
    const {data, error} = await createClient()
      .from("users")
      .insert([
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
        },
      ])
      .select();

    console.log("create user", data, "error create user", error);

    if (error) {
      throw new Error("Fail to create user");
    }
    userId = data ? data[0].id : null;
  }
  console.log("user id", userId, "description", description);
  // create ticket
   return createClient()
     .from("helpdesk_ticket")
     .insert([
       {
         issue_description: description,
         user_id: userId,
       },
     ])
};

// TODO: delete this function
export const createTicketOld = (
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

export const editTicketOld = (
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
