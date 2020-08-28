const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');
const http = require('http').createServer(express);
const io = require('socket.io')(http);

// Defining the PORT
const port = 3000;

// Initialize the app
const app = express();


// Mongodb Config
const { mongoose } = require('./db.js');




const user = require('./routes/userController');
const post = require('./routes/postController');


// Defining the Middlewares
app.use(cors())
    // Set the static folder
app.use(express.static(path.join(__dirname, 'dist')));
// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));



app.use('/api', user);
app.use('/api', post);



app.get("/", function(req, res) {
    res.send(`<h2>hello 3of</h2>`);
})



app.listen(port, function() {
    console.log("Server running on localhost:" + port);

});