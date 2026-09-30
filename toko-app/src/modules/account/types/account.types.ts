export interface Address {
  id: string;
  userId: string;
  fullAddress: string;
  isDefault: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type OrderStatus =
  | "PENDING"
  | "VERIFYING"
  | "PAID"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  variant?: {
    product?: {
      images?: {
        url: string;
      }[];
    };
  };
}

export interface Order {
  id: string;
  invoiceNumber: string;
  status: OrderStatus;
  totalAmount: number;
  courier: string;
  createdAt: string;
  items: OrderItem[];
}
