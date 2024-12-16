export default interface price {
  name: string;
  price: number;
  _id: string;
}

export default interface menuItemModel {
  _id: string; // _id sẽ là một chuỗi
  name: string;
  description?: string;
  category?: string;
  prices: price[];
  discount?: number;
  isAvailable: boolean;
  image?: string;
  totalTimeToCook?: number;
  createdAt?: string; // createdAt và updatedAt cũng sẽ là chuỗi
  updatedAt?: string;
}