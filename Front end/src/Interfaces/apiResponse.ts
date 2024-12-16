import shoppingCartModel from "./shoppingCartModel";
import userModel from "./usersModel";

export default interface ApiResponse {
  status: string;
  message: string;
  data?: userModel;
  existingOrder: shoppingCartModel
}