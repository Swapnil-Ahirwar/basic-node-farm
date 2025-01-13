// const hello = "Hello world";
// console.log(hello);

const { error } = require('console');
const fs = require('fs');
const http = require('http');
const url = require('url');


////////////////////////////////
// FILES READING AND WRITING

// Blocking, Synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8'); // We're reading a file from here
// const textOut = `This is what we know about the avacado. ${textIn} \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/outputNew.txt', textOut);
// console.log("File written!!");

// Non-blocking, Asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR!');
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     // console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       //console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('Your file has been written');
//       });
//     });
//   });
// });
// console.log('will read file!');


///////////////////////////
// SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%CITY%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }

    return output;
}
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);



const server = http.createServer((req, res)=>{
    // console.log(req.url);
    const {query, pathname} = url.parse(req.url, true);
    
    // console.log(req.url);
    // console.log(url.parse(pathname, true));

    // Overview page
    if(pathname === '/' || pathname === '/overview'){
        // res.end('This is the OVERVIEW!');
        res.writeHead(200, {'content-type': 'text/html'});

        const cardsHtml = dataObject.map(ele => replaceTemplate(tempCard, ele)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        // console.log(output);
        res.end(output);
    }

    // Product page
    else if(pathname === '/product'){
        res.writeHead(200, {'content-type': 'text/html'});
        // console.log(query);

        const product = dataObject[query.id];
        // console.log(product);
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }
    
    // Api page
    else if(pathname === '/api'){
        res.writeHead(200, {'content-type': 'application/json'});
        // console.log(productData); 
        res.end(JSON.stringify(dataObject));
    }

    // Not Found page
    else{
        res.writeHead(404, {
            'content-type' : 'text/html',
            'my-own-header' : 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
    // res.end('Hello from the server!');
});

const port = 8000;

server.listen(port, '127.0.0.1', ()=> {
    console.log(`Listening to requests on port ${port}`);
});