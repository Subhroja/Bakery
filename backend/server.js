const http= require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const server = http.createServer((req, res) => {
    if(req.method === 'GET' && req.url === '/'){
        const filepath = path.join(__dirname, '..', 'frontend','Home.html');
        fs.readFile(filepath, function(err,data){
            if (err){
                console.error("Error Reading File", err);
                res.writeHead(500, {'content-type': 'text/html'});
                return res.end('<h1>Internal Server Error<h1>');
            }
            res.writeHead(200,{'Content-Type': 'text/html'});
            res.end(data);
        })
    }
    else if(req.method === 'POST' && req.url === '/buy'){
        handlePost(req, res, 'Buy request received');
    }
    else if(req.method === 'POST' && req.url === '/cart'){
        handlePost(req, res, 'Item added to cart');
    }
    else if(req.method === 'POST' && req.url ==='/wishlist'){
        handlePost(req, res, 'Item added to wishlist');
    }
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'Not Found'}));
    }
}
);

function handlePost(req, res, message){
    let body='';
    req.on('data', chunk => body+=chunk);
    req.on('end', () => {
        console.log("Data received:", JSON.parse(body));
        res.writeHead(200, {'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
        res.end(JSON.stringify({message: message}));
    })
}
server.listen(PORT, function(){
    console.log('Server running at http://localhost:3000');
});