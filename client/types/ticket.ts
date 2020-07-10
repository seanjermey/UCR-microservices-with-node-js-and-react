export interface User {
  email: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  price: string;
  userId: string;
}

export interface Order {
  id: string;
  expiresAt: string;
  status: string;
  ticket: {
    title: string;
    price: number;
  };
}
