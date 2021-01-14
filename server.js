const io = require("socket.io")(3000,{
    cors:{
        methods: ["GET", "POST","PUT","DELETE"]
    }
});

console.log("server is running at port 3000");


const users = {};

let firstUser = "";
let secondUser = "";
let userCount = 0;
io.on("connection",socket=>{

    console.log("new user connected");

    socket.on("new-user",name=>{
    console.log(`name is ${name} and socket id is ${socket.id}`);
    users[socket.id] = name;
    if(userCount > 0){
        socket.broadcast.emit("user-connected",name);
    } 
    if(userCount == 0){
        userCount++;
        firstUser = name;
    }
    else{
        secondUser = name;
        io.to(socket.id).emit('user-connected', firstUser);
        userCount++
    }
    })

    socket.emit("chat-message","hello world");
    socket.on("new-message-send",(message)=>{
        console.log(`new message is ${message}`);
        socket.broadcast.emit("sent-message",message);
    })

    socket.on("typing-status",e=>{
        console.log(`value of element  is ${e.status}`)
        if(e.status){
            console.log("typing");
            socket.broadcast.emit("isTyping",{typing:true})
        }
        else{
            console.log("not typing");
            socket.broadcast.emit("isTyping",{typing:false})
        }
    })

    socket.on("disconnect",()=>{
        console.log(`user ${users[socket.id]} disconected`);
        userCount--;
        socket.broadcast.emit("user-disconect",users[socket.id]);
        if(userCount < 1){
            firstUser = "";
            secondUser = "";
        }
        else if(firstUser == users[socket.id]){
            firstUser =secondUser
        }
        delete users[socket.id];
    })

})