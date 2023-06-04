import { createServer } from "http";
import { Server,  } from "socket.io";

import express, { json } from "express"
import cors from "cors"



const app = express();

app.use(express.json())
app.use(cors())

const users = [{}]

const httpServer = createServer(app);

const io = new Server(httpServer, {
  
});
app.get('/',(req,res)=>{
    res.send("working is server now")
})
// on meaning data receved karna 

io.on("connection", (socket) => {
  console.log('New connection')

  socket.on(`Joined`, ({user})=>{
    users [socket.id] = user;
    console.log(`${user} user joined `)
    //  broadcast jis n bj hai us ko chor k sb jeay ga
    // emit mean jis na bja hai us ko jeay ga 
    socket.broadcast.emit('useJoined', { user:"Admin",message:` ${users[socket.id]} has Joined`})
    socket.emit('welcome',{user:"Admin",message:`Welcome to Chat,  ${users[socket.id]}`})
  })

  socket.on(`message`,({message, id})=>{
    // io mean pura serket ko bj na 
    io.emit(`sendMessage`, {user:users[id],message,id})
  })

  socket.on('disconnect', ()=>{
    socket.broadcast.emit(`leave`, {user:'Admin', message:` ${users[socket.id]} user left`})
    console.log(`user Left`)
  })
   
   
});

const Port = process.env.PORT || 4000;

httpServer.listen(Port,()=>{
    console.log(`server is working on ${Port}`)
});