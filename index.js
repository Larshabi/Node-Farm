// to import a module or library we use require, that is creating an object of that module/class

const fs = require('fs');
const http = require('http')
const url = require('url')

// synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)
// const textOut = `This is what we know about the avocado: ${textIn}.\n Created on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File Written')
// const text = `Please I am still a learner: ${textIn}`
// fs.writeFileSync('./outlet.txt', text)
// console.log("Another File Written")
//asynchronous
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('ERROR')
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data) => {
//         console.log(data);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3)
//             fs.writeFile('./txt/final.txt', `${data}\n${data3}`, 'utf-8', (err) => {
//                 console.log("Your file has been written")
//             })
//         })
//     })
// })
// console.log('Will read file')

//-------------------------------------------------------------------------------
//SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)

    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    }
    return output
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const dataObj = JSON.parse(data)
const server = http.createServer((req, res) => {

        const { query, pathname } = url.parse(req.url, true)

        if (pathname === '/overview' || pathname === '/') {
            res.writeHead(200, {
                'Content-type': 'text/html'
            })
            const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
            const output = tempOverview.replace('{%PRODUCTS_CARDS%}', cardsHtml)
            res.end(output)
        } else if (pathname === '/product') {
            res.writeHead(200, { 'Content-type': 'text/html' })
            const product = dataObj[query.id]
            const output = replaceTemplate(tempProduct, product)
            res.end(output)
        } else if (pathname === '/api') {
            res.writeHead(200, {
                'Content-type': 'application/json'
            })
            res.end(data)
        } else {
            res.writeHead(404, {
                'Content-type': 'text/html'
            });
            res.end('<h1>Page not found</h1>')
        }
    })
    // listen takes in two parameters which are the port and the host in this case port is 8000 and host is localhost
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})