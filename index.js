const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplates');
//////////////////////
//file
// const textIn= fs.readFileSync('./txt/input.txt','utf-8');
//  console.log(textIn);
//  const textOut= `this is what we know about the avocado:${textIn} .\nCreate on ${Date.now()}`;
//  console.log(textOut);
// fs.writeFileSync('./txt/output.txt',textOut)
// console.log('File written')

// non blocking code

// fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
//     console.log(data)
// });

// console.log("will read file")

//////////////////////

//Server

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);
const slugs = productData.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // const pathname= req.url;

  // res.end('hey from server')
  //overview
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    // console.log(cardsHtml)

    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  } else if (pathname === '/product') {
    // console.log(query)
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = productData[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
});

server.listen(8000, () => {
  console.log('listening the request');
});
