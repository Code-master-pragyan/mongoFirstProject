const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError")


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
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp")
}

// index route

app.get("/chats", async (req, res) => {
    try {
        let chats = await Chat.find();
        //console.log(chats);
        res.render("index.ejs", { chats });
        // res.send("Chats show section");
    } catch (err) {
        next(err);
    }

})

// Form for create new route
app.get("/chats/new", (req, res) => {
    // throw new ExpressError(404,"form not found" );
    res.render("new.ejs")
    // res.send("New route");
})

// create route
app.post("/chats", async (req, res, next) => {
    try {
        let { from, to, message } = req.body;
        let newChat = new Chat({
            from: from,
            to: to,
            message: message,
            created_at: new Date(),
        })

        await newChat.save();
        res.redirect("/chats");
    } catch (err) {
        next(new ExpressError(401, "You have fill the required fields"));
    }

})

// NEW Show route--------
app.get("/chats/:id", async (req, res, next) => {
    try{
        let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
        next(new ExpressError(404, "chat not found"));
    }
    res.render("edit.ejs", { chat });
    }catch(err){
        next(new ExpressError(404, "you are trying to access different thing"));
    }
    
})

// edit form route
app.get("/chats/:id/edit", async (req, res) => {
    try{
        let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
    }catch(err){
        next(new ExpressError(401, "the message is not edited"));
    }
    
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
            next(new ExpressError(404, "chat not found"));
        }

        console.log("Updated Chat:", updatedChat);
        res.redirect("/chats");
    } catch (err) {
        console.error("Error updating chat:", err);
        res.status(500).send("Error updating chat");
    }
});

// destroy route
app.delete("/chats/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let deletedChat = await Chat.findByIdAndDelete(id);
        //console.log(deletedChat);
        res.redirect("/chats");
    } catch (err) {
        next(err);
    }

})

app.get("/", (req, res) => {
    res.send("working");
})

app.use((err, req, res, next) => {
    let { status = 500, message = "some error occured" } = err;
    res.status(status).send(message);
})

app.listen(port, () => {
    console.log("Server is running on port 3000");
})