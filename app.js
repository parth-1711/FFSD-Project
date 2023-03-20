const express=require("express");
const bodyParser=require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set('view  engine','ejs');

app.get("/login",function (req,res) {
    res.render("login.ejs");

})

app.post("/login",function (req,res) {
    let userName=req.body.username;
    let password=req.body.password;
    console.log(userName);
    console.log(password);
    res.redirect("/home")
})
 
app.get("/home",function (req,res) {
    res.render("home.ejs")
})

app.get("/sign-in",function (req,res) {
    res.render("sign-in.ejs")
})

app.post("/sign-in",function (req,res) {
    let userName=req.body.username;
    let password=req.body.password;
    console.log(userName);
    console.log(password);
    res.redirect("/home")
})

app.get("/sign-up",function (req,res) {
    res.render("sign-up.ejs")
})

app.post("/sign-up",function (req,res) {
    let userName=req.body.username;
    let password=req.body.password;
    console.log(userName);
    console.log(password);
    res.redirect("/home")
})

app.get("/product",function (req,res) {
    res.render("product.ejs")
})

app.get("/sellerBargain",function (req,res) {
    res.render("sellerBargain.ejs")
})

app.get("/checkout",function (req,res) {
    res.render("checkout.ejs")
})


app.listen(80,function () {
    console.log("server is up and running on port 3000");
})