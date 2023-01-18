const express = require('express');
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server)
const path = require('path');



var engines = require('consolidate');
var swig = require('swig')

const PORT = process.env.PORT || 3000;



app.engine('html', engines.swig);
app.set('views', __dirname + '/layout');
app.set('view engine', 'html');

const usersRoute = require('./routers/index.js')

app.use(express.static(__dirname + '/public'))



// app.get('/', (req, res) => {
//     res.sendFile(__dirname + 'index')
// })


app.use('/', usersRoute)

// server.listen(3000);
server.listen(PORT, () => {
    console.log(`server is connected to port ${(PORT)}.`);
})
//socket .io

io.on('connection', (socket) => {
    console.log('connected,...');
    socket.on('message', (msg) => {
        console.log(msg)
        socket.broadcast.emit('message', msg)
    })
})