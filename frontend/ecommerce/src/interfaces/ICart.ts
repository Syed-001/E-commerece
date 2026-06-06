export interface CartRequest {
  userId: string;
  productId: number;
  quantity: number;
}

export interface CartItem {
  cartId: number;
  userId: string;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}