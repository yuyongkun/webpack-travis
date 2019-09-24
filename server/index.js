
if (typeof window === 'undefined') {
    global.win = false;
    global.window = {};
    global.document = {};
}
const express = require('express');
const path = require('path');
const fs = require('fs');
const { renderToString } = require('react-dom/server');

const IndexServer = require('../dist/static/js/index-server');
const server = (port) => {

    const app = express();

    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('/index', (req, res) => {
        const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');
        console.log(renderToString(IndexServer));
        res.status(200).send(renderMarkup(template, renderToString(IndexServer)));
        // res.status(200).send(renderMarkup2(renderToString(IndexServer)));
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

const renderMarkup = (template, str) => {
    return template.replace(/<!--HTML_PLACEHOLDER-->/, str)
}
const renderMarkup2 = (str) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>首页</title>
    <link href="/static/css/index_77c4eefb.css" rel="stylesheet"></head>
    <body>
        <div id="root">
            ${str}
        </div>
        </body>
    </html>`
}
server(process.env.PORT || 3000);