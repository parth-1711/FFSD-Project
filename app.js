const express=require("express");
const bodyParser=require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/login",function (req,res) {
    res.sendFile(__dirname+"/views/login.html");

})

app.post("/login",function (req,res) {
    let userName=req.body.username;
    let password=req.body.password;
    console.log(userName);
    console.log(password);
    res.redirect("/home")
})

app.get("/home",function (req,res) {
    res.sendFile(__dirname+"/views/home.html")
})

app.get("/sellerBargain",function (req,res) {
    res.sendFile(__dirname+"/views/sellerBargain.html")
})


app.listen(80,function () {
    console.log("server is up and running on port 3000");
})