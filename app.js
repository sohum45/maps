const { log } = require('console')
const express = require('express')
const app = express()
const path = require("path")
const http = require('http')
const socketio = require("socket.io")
const server = http.createServer(app)
const io = socketio(server);

app.set("view engine","ejs")
app.set(express.static(path.join(__dirname,"public")))

app.use(express.static('public'));

io.on("connection",function (socket){
    socket.on("send-location",(data)=>{
        io.emit("receive-location", {id: socket.id , ...data }) // all connected people can see location
    })
    
    socket.on("disconnect", ()=>{
        io.emit("user-disconnected",socket.id)
    })

    
})
app.get('/',(req,res)=>{
    res.render("index")
})

server.listen(3000)