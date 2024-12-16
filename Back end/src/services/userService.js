const UserModel = require('../models/user');
const OrderModel = require('../models/order')

const createUser = async (UserInfo) => {
    try {
      const existingEmail = await UserModel.findOne({ email: UserInfo.email });
      if (existingEmail) {
        return { status: 'ERROR', message: 'Email đã được đăng kí' };
      }
  
      const existingUsername = await UserModel.findOne({ username: UserInfo.username });
      if (existingUsername) {
        return { status: 'ERROR', message: 'Username đã được đăng kí' };
      }
  
      const newUser = await UserModel.create({
        ...UserInfo
      });
      
      if(newUser){
        const countOrders = await OrderModel.countDocuments();
        var order = new OrderModel({userid: newUser._id, trackingNumber: countOrders + 1, shippingAddress:newUser.shippingAddress });
        
        await order.save();

      
        return {
            status: 'OK',
            message: 'Đăng kí tài khoản thành công!',
            data: newUser
          };
      }
    
    } catch (error) {
      return { status: 'ERROR', message: error.message };
    }
  };

  const loginUser = async (UserInfo) => {
    try {

      const existingUser = await UserModel.findOne({ username: UserInfo.username, password: UserInfo.password });
      console.log("Người dùng tìm thấy:", existingUser);
      const existingOrder = await OrderModel.findOne({userid: existingUser._id , orderStatus: "Cart"});
      console.log("Đơn hàng tìm thấy:", existingOrder);

      if (!existingUser ) { //|| !existingOrder
        return { status: 'ERROR', message: 'Đăng nhập không thành công' };
      }
      else{
        const { password, ...userWithoutPassword } = existingUser.toObject();
        return {
            status: 'OK',
            message: 'Đăng nhập thành công!',
            data: userWithoutPassword,existingOrder,
          };
      }
    } catch (error) {
      return { status: 'ERROR', message: 'Lỗi đăng nhập' }; 
    }
  };

  const getAllUser = async () => {
    try {

      const allUser = await UserModel.find();

    return {
        status: 'OK',
        message: 'Danh sách user!!',
        data: allUser
        };
    } catch (error) {
      return { status: 'ERROR', message: 'Lỗi lấy danh sách user' }; 
    }
  };

  

module.exports = {
    createUser,loginUser,getAllUser
}