const express = require('express'); 
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server)


const PORT = process.env.PORT|| 3000;
// server.listen(3000);
server.listen(PORT,()=>{
    console .log(`server is connected to port ${(PORT)}.`);
})  

app.use(express.static(__dirname+'/public'))
 
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})
//socket .io

io.on('connection',(socket)=>{
    console.log('connected,...')
})