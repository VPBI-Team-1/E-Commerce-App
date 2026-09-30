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
    id?: string;
    name?: string;
    price?: number;
    stock?: number;
    product?: {
      id?: string;
      name?: string;
      images?: {
        url: string;
      }[];
    };
  };
}

export interface ShippingAddressData {
  recipientName?: string;
  phone?: string;
  fullAddress?: string;
  city?: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  status: OrderStatus;
  totalAmount: number;
  courier: string;
  trackingNumber?: string | null;
  eta?: string | null;
  expiresAt?: string;
  shippingAddress?: ShippingAddressData | Record<string, unknown> | null;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
