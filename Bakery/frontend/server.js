const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  let filePath = '.' + (req.url === '/' ? '/Menu.html' : req.url);
  const ext = path.extname(filePath);

  let contentType = 'text/html';
  if (ext === '.js') contentType = 'text/javascript';
  if (ext === '.css') contentType = 'text/css';
  if (ext === '.json') contentType = 'application/json';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}).listen(5000, () => {
  console.log('Frontend server running at http://localhost:5000');
});
