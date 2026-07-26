const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("hello");
});

const server = app.listen(3000, () => {
    console.log("Server started");
});

console.log("Immediately after listen:");
console.log("listening:", server.listening);

setTimeout(() => {
    console.log("After 5 seconds:");
    console.log("listening:", server.listening);
    console.log("address:", server.address());
}, 5000);

server.on("close", () => {
    console.log("CLOSE EVENT FIRED");
    console.trace();
});

process.on("exit", (code) => {
    console.log("EXIT:", code);
});