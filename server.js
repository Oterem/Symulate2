const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const app = new express();
const router = require('./lib/router');
const {init} = require('./lib/storage');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

app.listen(config.port || 3005, ()=>{
    console.log('listening!')
    init();
})


