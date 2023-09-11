require('dotenv').config();

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/chat')

const app = require('express')();

const htttp = require('http').Server(app)

const userRoute = require('./routes/userRoute');

app.use('/', userRoute);

htttp.listen(3000, function(){
    console.log('Server is running on port 3000')
});
