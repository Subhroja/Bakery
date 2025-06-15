const http = require('http'); // Gives access to Node.js HTTP server tools

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
    res.setHeader('Access-Control-Allow-Origin', '*');
    if(req.method ==='GET' && req.url=== '/')
    {
        req.on('data', function(err, msg)
        {
            

        })
    }
    if(req.method === 'POST' && req.url === '/api/category')
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
        res.write("Welcome to my Bakery!");
        res.end();
    }    
}).listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});