export interface Ticket {
  id: number;
  userId: number;
  issueDescription: string;
  status: string;
  adminResponse: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: number;
  ticketId: number;
  message: string;
  createdAt: Date;
}
