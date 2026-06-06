
export interface OrderItem {
  productId: number;
  quantity: number;
  productName?: string; 
  price?: number;       
}

export interface Order {
  orderId?: number;
  userId: string;
  items: OrderItem[]; 
  totalAmount: number;
  orderStatus?: string;
  orderDate?: string;
}