const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = 5001; // Đảm bảo cổng không xung đột

server.use(middlewares);

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/shoppingcart') {
    try {
      const { userId, menuItemId, updateQuantityBy } = req.body;

      if (!userId || !menuItemId || !updateQuantityBy) {
        throw new Error('Missing required fields');
      }

      // Tìm giỏ hàng của user
      let userCart = router.db.get('shoppingcart').find({ userId }).value();

      if (userCart) {
        // Thêm sản phẩm mới vào giỏ hàng mà không kiểm tra tồn tại
        const newItem = { id: Date.now().toString(), menuItemId, quantity: updateQuantityBy };
        userCart.items.push(newItem);
        router.db.get('shoppingcart').find({ userId }).assign(userCart).write();
        res.status(201).jsonp(newItem);
      } else {
        // Nếu userCart chưa tồn tại, tạo giỏ hàng mới
        userCart = { userId, items: [{ id: Date.now().toString(), menuItemId, quantity: updateQuantityBy }] };
        router.db.get('shoppingcart').push(userCart).write();
        res.status(201).jsonp(userCart.items[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).jsonp({ error: error.message });
    }
  } else {
    next();
  }
});

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
