export default interface userModel {
  _id?: string;
  sdt?: string;
  email: string;
  name?: string;
  username: string;
  password: string;
  shippingAddress?: string;
  role?: string;
  isAdmin?: boolean;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
