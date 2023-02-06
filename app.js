const express=require("express");
const bodyParser=require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));

app.get("/login",function (req,res) {
    res.sendFile(__dirname+"/views/login.html");

})

app.post("/login",function (req,res) {
    let userName=req.body.uname;
    let password=req.body.password;
    console.log(userName);
    console.log(password);
})

app.listen(3000,function () {
    console.log("server is up and running on port 3000");
})