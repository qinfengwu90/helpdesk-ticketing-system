import {createClient} from "@/utilities/supabase/client";
import {Notification, Ticket} from "@/models/models";

export const getAllTicketsAndEmailUpdatesForUser = async (
  userEmail: string,
  lastName: string,
) => {
  let tickets: Ticket[] = [];
  let emails: Notification[] = [];
  const allTickets = await getAllTicketsForUser(userEmail, lastName);
  const allEmails = await getAllEmailsForUser(userEmail, lastName);
  if (allTickets?.length > 0) {
    let tempTicket = allTickets[0];
    tempTicket.helpdesk_ticket.forEach((ticket: any) => {
      tickets.push({
        id: ticket.id,
        userId: ticket.user_id,
        issueDescription: ticket.issue_description,
        status: ticket.status,
        adminResponse: ticket.admin_response,
        email: tempTicket.email,
        firstName: tempTicket.first_name,
        lastName: tempTicket.last_name,
        updatedAt: new Date(ticket.updated_at),
        createdAt: new Date(ticket.created_at),
      });
    });
  }

  allEmails.forEach((email: any) => {
    emails.push({
      id: email.id,
      ticketId: email.ticket_id,
      message: email.message,
      createdAt: new Date(email.created_at),
    })
  })
  return { tickets: tickets, emails: emails };
}

async function getAllTicketsForUser(
  userEmail: string,
  lastName: string,
) {
  const {data, error} = await createClient()
    .from("users")
    .select(`
      email,
      first_name,
      last_name,
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