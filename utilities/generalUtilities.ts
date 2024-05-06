import {createClient} from "@/utilities/supabase/client";

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