const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")
}

// index route

app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    //console.log(chats);
    res.render("index.ejs", { chats });
    // res.send("Chats show section");
})

// Form for create new route
app.get("/chats/new", (req, res) => {
    res.render("new.ejs")
    // res.send("New route");
})

// create route
app.post("/chats", (req, res) => {
    let { from, to, message } = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        message: message,
        created_at: new Date(),
    })

    newChat.save().then((res) => {
        console.log(res);
    })
        .catch((err) => {
            console.log(err);
        });

    res.redirect("/chats");
})

// edit form route
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
})

// Update route
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { message: newMessage } = req.body;

    try {
        // Update the message and set updated_at to the current date
        let updatedChat = await Chat.findByIdAndUpdate(
            id,
            { 
                message: newMessage, 
                updated_at: new Date() // Correctly update the updated_at field
            },
            { runValidators: true, new: true } // Ensure validation and return the updated document
        );

        if (!updatedChat) {
            return res.status(404).send("Chat not found");
        }

        console.log("Updated Chat:", updatedChat);
        res.redirect("/chats");
    } catch (err) {
        console.error("Error updating chat:", err);
        res.status(500).send("Error updating chat");
    }
});

// destroy route
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    //console.log(deletedChat);
    res.redirect("/chats");
})

app.get("/", (req, res) => {
    res.send("working");
})

app.listen(port, () => {
    console.log("Server is running on port 3000");
})