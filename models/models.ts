export interface Ticket {
  id: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  issueDescription: string;
  status: string;
  adminResponse: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: number;
  ticketId: number;
  message: string;
  createdAt: Date;
}
