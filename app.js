// console.log("Start!")

// setTimeout(()=>{

// }, 2000);


// console.log("Finish!")

const http = require("http");

const server = http.createServer((req, res) => {
res.write("Hello from Node Server!");
res.end();
});


server.listen(3000, () => {
    console.log("Server runnng on http:localhost:3000")
})