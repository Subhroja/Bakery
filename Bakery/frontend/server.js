const http = require('http'); // Gives access to Node.js HTTP server tools
const fs = require('fs');
const path = require('path');
//Creating a sample data object for product categories
const categories = {
  Breads: ['Baguette', 'Sourdough', 'Whole Wheat'],
  Cakes: ['Chocolate Cake', 'Cheesecake', 'Red Velvet'],
  Pastries: ['Danish', 'Croissant', 'Puff Pastry'],
  Cookies: ['Chocolate Chip', 'Oatmeal', 'Peanut Butter']
};


// Creating server
const server = http.createServer(function (req, res) 
{
    //res.setHeader('Access-Control-Allow-Origin', '*');
    if(req.method ==='GET' && req.url=== '/')
    {
        fs.readFile(path.join(__dirname,'Menu.html'),(err, data) =>{
            if(err){
                res.writeHead(500);
                res.end('Error loading file');
            }else{
                res.writeHead(200, {'Content-Type':'text/html'});
                res.end(data);
            }            
        });        
    }    
    else if(req.method === 'POST' && req.url === '/api/category')
    {   
        req.on('data', function(chunk)
        {
            const data = JSON.parse(chunk);
            const category = data.category;
            let message;
            if(categories[category]){
                message = `${category} items: ${categories[category].join(',')}`;
            }     else{
                message = 'Category not found';
            } 
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({message: message}))
            res.end();
            
        });                             
    }        
    else
    {
        res.writeHead(200,'Page Not Found');
        res.end();
    }    
}).listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});