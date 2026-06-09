export interface Product {
  productId?: number;
  name: string;
  description: string;
  category?: string;
  make?: string;
  price: number;
  quantity: number;
  uom?: string;
  rating?: number;
  imageUrl?: string;
}

export interface ProductApiRequest {
  prodName: string;
  prodDesc: string;
  prodCat: string;
  make: string;
  availableQty: number;
  price: number;
  uom: string;
  prodRating: number;
  imageURL: string;
}
