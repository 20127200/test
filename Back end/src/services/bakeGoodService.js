const BakeGoodModel = require('../models/bakeGood')

const createBakeGood = async (bakeGoodInfo) => {
    try {
      const exist = await BakeGoodModel.findOne({ name: bakeGoodInfo.name });
      if (exist) {
        return { status: 'ERROR', message: 'Tên sản phẩm đã tồn tại' };
      }

      const newBakeGood = await BakeGoodModel.create({
        ...bakeGoodInfo
      });
      if(newBakeGood){
        return {
            status: 'OK',
            message: 'Tạo sản phẩm thành công!',
            data: newBakeGood
          };
      }
    
    } catch (error) {
      return { status: 'ERROR', message: `${error.message}` };
    }
  };

  const searchBakeGood = async (key) => {
    try {
      const modifiedKey = key.replace(/bánh/gi, '');
      const pipeline = [
        {
          $search: {
            index: "name_category", 
            text: {
              query: modifiedKey,
              path: ["name", "category"] 
            }
          }
        }
      ];
  
      const exist = await BakeGoodModel.aggregate(pipeline);

      if (exist.length === 0) {
        return { status: 'ERROR', message: 'Không tìm thấy!' };
      }
      else{
        return {
          status: 'OK',
          message: 'Tìm thành công!',
          data: exist
        };
      }
    
    } catch (error) {
      return { status: 'ERROR', message: `${error.message}` };
    }
  };

  const getAllBakeGood = async () => {
    try {

      const exist = await BakeGoodModel.find();

      if (exist.length === 0) {
        return { status: 'ERROR', message: 'Danh sách rỗng!' };
      }
      else{
        return {
          status: 'OK',
          message: 'Load danh sách thành công!',
          data: exist
        };
      }
    
    } catch (error) {
      return { status: 'ERROR', message: `${error.message}` };
    }
  };

  
  const getDetail = async (id) => {
    try {

      const exist = await BakeGoodModel.findById(id);

      if (exist.length === 0) {
        return { status: 'ERROR', message: 'Khong co item!' };
      }
      else{
        return {
          status: 'OK',
          message: 'Done!',
          data: exist
        };
      }
    
    } catch (error) {
      return { status: 'ERROR', message: `${error.message}` };
    }
  };

  const filterCateBakeGood = async (cate) => {
    try {
      const exist = await BakeGoodModel.find({category : cate});

      if (exist.length === 0) {
        return { status: 'ERROR', message: 'Không tìm thấy!' };
      }
      else{
        return {
          status: 'OK',
          message: 'Filter thành công!',
          data: exist
        };
      }
    
    } catch (error) {
      return { status: 'ERROR', message: `${error.message}` };
    }
  };

  module.exports = {
    createBakeGood,searchBakeGood,getAllBakeGood,filterCateBakeGood,getDetail
}