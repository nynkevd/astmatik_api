const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user-routes');
const attackRoutes = require('./routes/attack-routes');
const peakflowRoutes = require('./routes/peakflow-routes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,  X-Auth-Token");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

    next();
});

app.use("/api/user", userRoutes);
app.use("/api/attack", attackRoutes);
app.use("/api/peakflow", peakflowRoutes);

app.get('/', (req, res) => {
    res.send('Astmatik API!');
})

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@astmatik-db.4a19c.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(process.env.PORT || 5000);
    })
    .catch((err) => {
        console.log("Something went wrong!")
    });

app.listen(5000);