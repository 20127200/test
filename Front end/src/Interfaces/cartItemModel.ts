export interface cartItemModel {
  _id : string,
  orderid: string;
  productid: string;
  priceone: number;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}