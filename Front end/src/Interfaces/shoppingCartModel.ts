import { cartItemModel } from "./cartItemModel";

export default interface shoppingCartModel {
  _id?: string;
  cartItems?: cartItemModel[];
  userId?: string;
  orderDate?: Date;
  totalAmount?: number;
  orderStatus?: string;
  shippingMethod?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  specialInstructions?: string;
  trackingNumber?: number;
  shippingAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
}