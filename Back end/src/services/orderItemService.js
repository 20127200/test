const orderItemModel = require('../models/orderItems')

const create = async (orderItemInfo) => {
    try {
        const existingItem= await orderItemModel.findOne({ orderid: orderItemInfo.orderid, productid: orderItemInfo.productid});
        if(existingItem){
            return {
                status: 'Error',
                message: 'Sản phẩm đã được thêm vào giỏ hàng!!',
              };
        }
        else{
            const newitem = await orderItemModel.create({
                ...orderItemInfo
              });
            if (newitem){
                return {
                status: 'OK',
                message: 'Thêm item thành công!',
                data: newitem
              };
            }
        }
    } catch (error) {
      return { status: 'ERROR', message: `${error.message}` };
    }
  };

  const update = async (orderItemId, orderItemInfo) => {
    try {
        // Tạo đối tượng cập nhật dựa trên các trường có trong orderInfo
        const updateData = {};
        
        if (orderItemInfo.priceone) {
          updateData.priceone = orderItemInfo.priceone;
        }
        if (orderItemInfo.quantity) {
            updateData.quantity = orderItemInfo.quantity;
          }
          if (orderItemInfo.price) {
            updateData.price = orderItemInfo.price;
          }
       
        // Kiểm tra xem có dữ liệu để cập nhật hay không
        if (Object.keys(updateData).length === 0) {
          return {
            status: 'Error',
            message: 'Không có thông tin cập nhật!',
          };
        }
        // Cập nhật thông tin đơn hàng
        const updatedOrderItem = await orderItemModel.findByIdAndUpdate(
            orderItemId,
          { $set: updateData },
          { new: true } // Tùy chọn này trả về tài liệu sau khi đã cập nhật
        );
    
        if (!updatedOrderItem) {
          return {
            status: 'Error',
            message: 'Không tìm thấy!',
          };
        }
    
        return {
          status: 'OK',
          message: 'Cập nhật item thành công!',
          data: updatedOrderItem
        };
    
      } catch (error) {
        return { status: 'ERROR', message: `${error.message}` };
      }
  };

  const getListItem = async (orderid) => {
    try {
        const exist = await orderItemModel.find({ orderid: orderid});
        if(exist){
            return {
                status: 'OK',
                message: 'Lấy thành công list item',
                data: exist
              };
        }
      } catch (error) {
        return { status: 'ERROR', message: `${error.message}` };
      }
  };

  
  const deleteItem = async (orderItemId) => {
    try {
        const exist = await orderItemModel.deleteOne({ _id: orderItemId});
        if(exist){
            return {
                status: 'OK',
                message: 'Xóa item thành công',
       
              };
        }
      } catch (error) {
        return { status: 'ERROR', message: `${error.message}` };
      }
  };
  module.exports = {
    create,update,getListItem,deleteItem
}