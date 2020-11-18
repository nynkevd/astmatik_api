const express = require('express');

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,  X-Auth-Token");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

    next();
});

app.listen(5000);