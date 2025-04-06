const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp")
}

let chats = [
    {
        from: "Hari",
        to: "harshit",
        message: "Today i will not go there.",
        created_at: new Date(),
    },
    {
        from: "pritam",
        to: "pragyan",
        message: "Today i will not go to the gym.",
        created_at: new Date(),
    },
    {
        from: "pritisha",
        to: "pragyan",
        message: "I love youuuuu",
        created_at: new Date(),
    },
    {
        from: "alex",
        to: "hiya",
        message: "What are you doing baby",
        created_at: new Date(),
    },
    {
        from: "mazulika",
        to: "akshay",
        message: "Ami Manzulikaaaaa!!",
        created_at: new Date(),
    },
    {
        from: "sohan",
        to: "pragyan",
        message: "Where is the Key?",
        created_at: new Date(),
    },
    {
        from: "Krishna",
        to: "arjun",
        message: "Donot think about result, do your work constantly",
        created_at: new Date(),
    }
]

Chat.insertMany(chats)
.then((res) => {
    console.log("Documents inserted:", res);
})
.catch((err) => {
    console.error("Error inserting documents:", err);
});;