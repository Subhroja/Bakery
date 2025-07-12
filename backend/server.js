const http = require('http');
const fs = require('fs');
const path = require('path');
const urlModule = require('url');

const categories = {
  Breads: ['Baguette', 'Sourdough', 'Whole Wheat'],
  Cakes: ['Chocolate Cake', 'Cheesecake', 'Red Velvet'],
  Pastries: ['Danish', 'Croissant', 'Puff Pastry'],
  Cookies: ['Chocolate Chip', 'Oatmeal', 'Peanut Butter']
};

const server = http.createServer(function (req, res) {
  //console.log("Request:", req.method, req.url); // Debugging log

  // Handle GET requests for .html pages
  if (req.method === 'GET') {
    let filePath = req.url === '/' ? 'Home.html' : req.url.slice(1);
if (!path.extname(filePath)) {
  filePath += '.html';
}

const fullPath = path.join(__dirname, '..', 'frontend', filePath);
console.log("Serving file:", fullPath);

fs.readFile(fullPath, (err, data) => {
  if (err) {
    console.error("File not found:", fullPath);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page Not Found');
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  }
});
  }

  // Handle POST to /api/category
  else if (req.method === 'POST' && req.url === '/api/category') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const data = JSON.parse(body);
      const category = data.category;
      let message;

      if (categories[category]) {
        message = `${category} items: ${categories[category].join(', ')}`;
      } else {
        message = 'Category not found';
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message }));
    });
  }

  // Handle POST to /api/addtoCart
  else if (req.method === 'POST' && req.url.startsWith('/api/addtoCart')) {
  const parsedUrl = urlModule.parse(req.url, true);
  const item = parsedUrl.query.item;
  const quantity = parseInt(parsedUrl.query.quantity || '1');

  if (!item) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, error: 'Item is required' }));
  }

  const cartPath = path.join(__dirname, 'Cart.json');
  let cart = [];
  try {
    const cartData = fs.readFileSync(cartPath, 'utf8');
    cart = JSON.parse(cartData);
    if (!Array.isArray(cart)) cart = [];
  } catch {
    cart = [];
  }

  const existingItem = cart.find(x => x.item === item);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ item, quantity });
  }

  fs.writeFileSync(cartPath, JSON.stringify(cart, null, 2));

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, message: `${item} added to cart`, cart }));
}

  else if (req.method === 'POST' && req.url.startsWith('/api/removeItemFromCart'))
  {
    const parsedUrl = urlModule.parse(req.url, true);
    const item = parsedUrl.query.item;
    const cartPath = path.join(__dirname, 'Cart.json');
    let cart = [];
    try
    {
        const cartData = fs.readFileSync(cartPath, 'utf8');
        cart = JSON.parse(cartData);
        //Protect against invalid JSON format
        if(!Array.isArray(cart))
        {
          cart = [];
        }
    }
    catch (err)
    {
      cart = []; //if file is empty
    }
    const existingItemIndex = cart.findIndex(x=>x.item === item);
    if (existingItemIndex !== -1){
      const existingItem = cart[existingItemIndex];
      existingItem.quantity -= 1;

      //remove item if quantity <= 0
      if(existingItem.quantity <= 0)
      {
        cart.splice(existingItemIndex, 1);
      }
    }    

    //always write back to cart.json
    fs.writeFileSync(cartPath, JSON.stringify(cart, null, 2));

    //send updated cart as response
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({success: true, cart}));  

  }
  else if (req.method === 'POST' && req.url.startsWith('/api/clearCart'))
  {
    const cartPath = path.join(__dirname,'Cart.json');
    try
    {
      //clear the cart by writing an empty array
      fs.writeFileSync(cartPath, JSON.stringify([], null, 2));

      //send updated cart as response
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({success: true, message: 'Cart has been cleared'}));  
    }
    catch(err)
    {
      //send updated cart as response
      res.writeHead(400, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({success: false, error: 'Failed to clear cart'}));  
    }
  }
  // Handle GET to /api/getCart
else if (req.method === 'POST' && req.url === '/api/getCart') {
  fs.readFile(path.join(__dirname, 'Cart.json'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read cart' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data); // Send cart data
      }
    });
}


  // All other routes
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page Not Found');
  }
}).listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});