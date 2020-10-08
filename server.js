var express = require('express');
const axios = require('axios');
var app = express();
var port = 3000;
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.listen(port, function () {
  console.log(`Server Started and is listening on port: ${port}`);
});
