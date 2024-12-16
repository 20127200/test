const userRouter = require('./userRouter');
const bakeGoodRouter = require('./bakeGoodRouter');
const orderRouter = require('./orderRouter');
const orderItemRouter = require('./orderItemRouter');
const paypalRouter = require('./paypalRouter');

const routes = (app) =>{
    app.use('/api/user', userRouter);
    app.use('/api/bakeGood', bakeGoodRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/orderItems', orderItemRouter);
    app.use('/api/paypal', paypalRouter);
}

module.exports = routes