const http = require('http');
const fs = require('fs');
const path = require('path');

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

    const fullPath = path.join(__dirname, filePath);
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
    return;
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
  else if (req.method === 'POST' && req.url === '/api/addtoCart') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const item = data.category;
        let foundCategory = null;

        for (const i in categories) {
          if (categories[i].includes(item)) {
            foundCategory = i;
            break;
          }
        }

        let message;
        if (foundCategory) {
          message = `${item} was added to your cart under category "${foundCategory}".`;
        } else {
          message = "Item not found in any category";
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON format' }));
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
