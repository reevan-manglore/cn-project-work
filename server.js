const io = require("socket.io")(3000,{
    cors:{
        methods: ["GET", "POST","PUT","DELETE"]
    }
});

const users = {};


let firstUser = "";
let secondUser = "";
let userCount = 0;
io.on("connection",socket=>{

    console.log("new user connected");

    socket.on("new-user",name=>{
    console.log(name);
    users[socket.id] = name;
    if(userCount == 0){
        userCount++;
        firstUser = name;
    }
    else{
        secondUser = name;
        io.to(socket.id).emit('user-connected', firstUser);
        userCount++
    }
    socket.broadcast.emit("user-connected",name); 
    })

    socket.emit("chat-message","hello world");
    socket.on("new-message-send",(message)=>{
        console.log(`new message is ${message}`);
        socket.broadcast.emit("sent-message",message);
    })

    socket.on("typing-status",e=>{
        console.log(`value of element  is ${e.typing}`)
        if(e.typing){
            console.log("typing");
            socket.broadcast.emit("isTyping",{typing:true})
        }
        else{
            console.log("not typing");
            socket.broadcast.emit("isTyping-status",{typing:false})
        }
    })

    socket.on("disconnect",()=>{
        console.log(`user ${users[socket.id]} disconected`);
        userCount--;
        socket.broadcast.emit("user-disconect",users[socket.id]);
        if(firstUser == users[socket.id]){
            firstUser =secondUser
        }
        delete users[socket.id];
    })

})