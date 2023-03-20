const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const path=require("path")
const sqlite=require("sqlite3")

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine","ejs");
const dbna = path.join(__dirname, "data", "ofsd.db");

const db=new sqlite.Database(dbna,(err)=>{
    if (err) {
        console.log(err.message);        
    }
    console.log("Connected");
})

const createTable=`create table if not exists Users (
    uname varchar(50) primary key,
    email varchar(100),
    password varchar(100),
    mobileNo varchar(12),
    address varchar(200)
);`

db.run(createTable,(err)=>{
    if(err){
        console.log(err.message);
    }
    console.log("table created !");
})

app.get("/Table",function (req,res) {
    const command=`select * from Users`
    db.all(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
        }
        res.render("fdata", { model: rows });
    });
})

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

app.get("/sign-in",function (req,res) {
    res.sendFile(__dirname+"/views/sign-in.html")
})

app.post("/sign-in",function (req,res) {
    let userName=req.body.username;
    let password=req.body.password;
    console.log(userName);
    console.log(password);
    res.redirect("/home")
})

app.get("/sign-up",function (req,res) {
    res.sendFile(__dirname+"/views/sign-up.html")
})

app.post("/sign-up",function (req,res) {
    let userName=req.body.username;
    let email=req.body.email;
    let password=req.body.password;
    let insertCommand=`insert into Users (uname,email,password) values(?,?,?)`
    let values=[userName,email,password];
    db.run(insertCommand,values,(err)=>{
        if(err) console.log(err.message);

    })
    console.log(userName);
    console.log(password);
    res.redirect("/home")
})

app.get("/Product/:parameter",function (req,res) {
    // console.log(req.params.parameter)
    res.sendFile(__dirname+"/views/Product.html")
})

app.get("/sellerBargain",function (req,res) {
    res.sendFile(__dirname+"/views/sellerBargain.html")
})


app.listen(80,function () {
    console.log("server is up and running");
})