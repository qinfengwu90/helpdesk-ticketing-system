export const SERVER_ORIGIN = process.env.REACT_APP_API_ROOT;
import {createClient} from "@/utilities/supabase/client";

export const handleResponseStatus = (response: Response, errMsg: string) => {
  const { status, ok } = response;

  if (status === 401) {
    localStorage.removeItem("authToken"); // web storage
    window.location.reload();
    return;
  }

  if (!ok) {
    throw Error(errMsg);
  }
};

export const deleteTicket = async (ticketId: number) => {
  return createClient()
    .from("helpdesk_ticket")
    .update({archived_at: "now()"})
    .eq("id", ticketId);
}

export const formatTicketStatus = (status: string) => {
  let newStatus = status.charAt(0).toUpperCase() + status.slice(1);
  return newStatus.replace(/_/g, " ");
};
