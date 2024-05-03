export const SERVER_ORIGIN = process.env.REACT_APP_API_ROOT;

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

export const deleteTicket = (ticketId: number) => {
  const url = `${SERVER_ORIGIN}/delete-ticket`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ticketId: ticketId }),
  }).then((response) => {
    handleResponseStatus(response, "Fail to delete ticket");
  });
};

export const formatTicketStatus = (status: string) => {
  let newStatus = status.charAt(0).toUpperCase() + status.slice(1);
  return newStatus.replace(/_/g, " ");
};
