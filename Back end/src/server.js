const express = require('express')
const dotenv = require('dotenv')
const body_parser = require('body-parser')
const connectDB = require('./database/connection')
const cors = require('cors')
const routes = require('./routes/index')
dotenv.config({path: 'src/.env'})

const app = express()
const PORT = process.env.PORT || 3000

app.use(body_parser.json())
connectDB()
app.use(cors());
routes(app);

app.post('/create-paypal-order', async (req, res) => {
    const orderInfo = req.body;
    const result = await createPayPalOrder(orderInfo);
    res.json(result);
  });
  
  app.post('/capture-paypal-order', async (req, res) => {
    const { orderId } = req.body;
    const result = await capturePayPalOrder(orderId);
    res.json(result);
  });

app.listen(PORT, () =>{
    console.log(`Server is running in http://localhost:${PORT}`)
})