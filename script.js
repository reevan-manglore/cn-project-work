


const socket = io("http://localhost:3000");

let name = "anonymus";

name = prompt("enter your name = ");

login();


socket.emit("new-user",name);


let lastMessage = null;//0 for sent message 1 for recived message null whenever webpage is loaded

let isTyping = false;

socket.on("chat-message",(m)=>{
    console.log(m);
})

let sendBtn = document.querySelector("#send");
let  txtBox = document.querySelector('input[type = "text"]');

sendBtn.addEventListener("click",e=>{
    e.preventDefault();
    socket.emit("typing-status",{status:false})
    let txt = txtBox.value;
    console.log(txt);
    socket.emit("new-message-send",txt);
    txtBox.value = "";
    if(lastMessage == 0){
        let outer = document.querySelector(".last-container");
        let msg = document.createElement("div");
        msg.classList.add("sent");
        let p = document.createElement("p");
        p.classList.add("text");
        p.innerText = txt;
        msg.appendChild(p);
        outer.appendChild(msg);
        lastMessage = 0;
    }
    else{

        if( lastMessage !=null && document.querySelector(".last-container").classList.contains("last-container")){
            document.querySelector(".last-container").classList.remove("last-container")
        }
        let main = document.createElement("div");
        main.classList.add("message");
        main.classList.add("last-container")
        let msg = document.createElement("div");
        msg.classList.add("sent");
        let name = document.createElement("p");
        name.classList.add("name");
        name.innerText = "you";
        let p = document.createElement("p");
        p.classList.add("text");
        p.innerText = txt;
        msg.appendChild(name);
        msg.appendChild(p);
        main.appendChild(msg);
        document.querySelector("#message-container").appendChild(main);
        lastMessage = 0;
        
    }
    let containerBottom = document.querySelector("#message-container");
    containerBottom.scrollTop = containerBottom.scrollHeight; 
})


document.querySelector(".person-initial").innerText ="";
document.querySelector(".person-name").innerText = "none";
document.querySelector(".online-status").innerText = "offline";


let usr2 = "";

socket.on("user-connected",usr=>{
    let initial = usr.trim().charAt(0);
    usr2 = usr;
    document.querySelector(".person-initial").innerText = initial;
    document.querySelector(".person-name").innerText = usr.trim();
    document.querySelector(".online-status").innerText = "online";
    login(usr);
})


socket.on("sent-message",message=>{//for recived message
    console.log(`recived  message is = ${message}`)
    if(lastMessage == 1){
        let outer = document.querySelector(".last-container");
        let msg = document.createElement("div");
        msg.classList.add("recived");
        let p = document.createElement("p");
        p.classList.add("text");
        p.innerText = message;
        msg.appendChild(p);
        outer.appendChild(msg);
        lastMessage = 1;
    }
    else{
        if(lastMessage !=null && document.querySelector(".last-container").classList.contains("last-container") ){
            document.querySelector(".last-container").classList.remove("last-container")
        }
        let main = document.createElement("div");
        main.classList.add("message");
        main.classList.add("last-container")
        let msg = document.createElement("div");
        msg.classList.add("recived");
        let name = document.createElement("p");
        name.classList.add("name");
        name.innerText = usr2;
        let p = document.createElement("p");
        p.classList.add("text");
        p.innerText = message;
        msg.appendChild(name);
        msg.appendChild(p);
        main.appendChild(msg);
        document.querySelector("#message-container").appendChild(main);
        lastMessage = 1;
        
    }
    let containerBottom = document.querySelector("#message-container");
    containerBottom.scrollTop = containerBottom.scrollHeight; //to automatically scroll to bottom
});


socket.on("user-disconect",msg=>{
    document.querySelector(".online-status").innerText = "offline";
    login(msg,true);//if true then logout is true the user has left out of the chat
    let containerBottom = document.querySelector("#message-container");
    containerBottom.scrollTop = containerBottom.scrollHeight; //to automatically scroll to bottom
})


 
document.addEventListener("keyup",()=>{
        if(txtBox.value.trim().length > 0){
            console.log("typing");
            socket.emit("typing-status",{status:true});
        }
        else {
            socket.emit("typing-status",{status:false})
        }
})
 


 socket.on("isTyping",(e)=>{
    if(e.typing){
        document.querySelector(".online-status").innerText = "typing..."
    }
    else {
        document.querySelector(".online-status").innerText = "online";
    }
 })


function login(name=null,logout=false){
    let mainCont = document.querySelector("#message-container");
    let outer = document.createElement("div");
    outer.classList.add("message");
    let inner = document.createElement("div");
    inner.classList.add("message-status");
    if(name == null){
        inner.innerText = `you logged in`;
    }
    else{
        if(!logout)
            inner.innerText = ` ${name} joined`;
        else
            inner.innerText = `${name} left`
    }
    outer.appendChild(inner);
    mainCont.appendChild(outer)
    let containerBottom = document.querySelector("#message-container");
    containerBottom.scrollTop = containerBottom.scrollHeight; //to automatically scroll to bottom
}