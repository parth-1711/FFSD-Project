const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path")
const sqlite = require("sqlite3")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
const dbna = path.join(__dirname, "data", "ofsd.db");

const db = new sqlite.Database(dbna, (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("Connected");
})

const createTable = `create table if not exists Users (
    uname varchar(50) primary key,
    email varchar(100),
    password varchar(100),
    mobileNo varchar(12),
    address varchar(200)
);`

db.run(createTable, (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("table created !");
})


// app.get("/login", function (req, res) {
//     res.render("login.ejs");

// })

// app.post("/login", function (req, res) {
//     let userName = req.body.username;
//     let password = req.body.password;
//     console.log(userName);
//     console.log(password);
//     res.redirect("/home")
// })

app.get("/", function (req, res) {
    res.render("home.ejs")
})

app.get("/homeAS/:parameter", function (req, res) {

    res.render("homeAS.ejs", { user: req.params.parameter })
    // console.log(req.params.parameter)
})

app.get("/sign-in", function (req, res) {
    res.sendFile(__dirname + "/views/sign-in.html")
})

app.post("/sign-in", function (req, res) {
    let userName = req.body.username
    let Password = req.body.password;
    // console.log(userName);
    // console.log(Password);
    db.each("select password from Users where Users.uname=(?)",userName, function (err, row) {
        if (err) {
            console.log(err.message);
        }
        else {
            if (row.password === Password) {
                res.redirect("/homeAS/" + userName);
            }
            else{
                res.redirect("/failure")
            }
        }


    })

})

app.get("/sign-up", function (req, res) {
    res.sendFile(__dirname + "/views/sign-up.html")
})

app.post("/sign-up", function (req, res) {
    let userName = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let insertCommand = `insert into Users (uname,email,password) values(?,?,?)`
    let values = [userName, email, password];
    db.run(insertCommand, values, (err) => {
        if (err) console.log(err.message);

    })
    // console.log(userName);
    // console.log(password);
    res.redirect("/homeAS/" + userName);
})

app.get("/failure",function (req,res) {
    res.sendFile(__dirname+"/views/failure.html")
})

app.get("/product/:parameter", function (req, res) {
    // console.log(req.params.parameters)
    res.render("Product (1).ejs",{user:req.params.parameter})
})

app.get("/userProfile/:parameter",function (req,res) {
    res.render("userprofile.ejs",{user:req.params.parameter})
})

app.get("/sellerBargain/:parameter1/:parameter2", function (req, res) {
    res.render("sellerBargain.ejs",{productName:req.params.parameter1,user:req.params.parameter2})
})

app.get("/SavedAddress/:parameter", function (req, res) {
    res.render("SavedAddress.ejs",{user:req.params.parameter})
})

app.get("/Myads/:parameter",function (req,res) {
    res.render("Myads.ejs",{user : req.params.parameter})
})

app.get("/checkout/:parameters", function (req, res) {
    res.render("checkout.ejs",{user : req.params.parameters})
})

app.get("/MyOffers/:parameters",function(req,res){
    res.render("MyOffers.ejs",{user : req.params.parameters})
})

app.get("/aboutUs",function (req,res) {
    res.sendFile(__dirname+"/views/aboutUs.html")
})

app.get("/sell/:parameter",function (req,res) {
    res.render("Sellproduct.ejs",{user:req.params.parameter})
})

app.get("/RemoveUser",function (req,res) {
    res.sendFile(__dirname+"/views/RemoveUser.html")
})

app.get("/help/:parameter",function (req,res) {
    res.render("help.ejs",{user:req.params.parameter})
})

app.get("/admin",function (req,res) {
    res.render("adminpage.ejs")
})



app.get("/productdetails/:parameter",function (req,res) {
    res.render("productdetails.ejs",{user:req.params.parameter})
})

app.post("/RemoveUser",function (req,res) {
    let userName=req.body.uname;
    let reason=req.body.reason;
    db.run("delete from Users where uname=(?)",[userName],function (err) {
        if (err) {
            res.redirect(__dirname+"/views/deletionFailure.html")
        }
        else{
            res.redirect("/RemoveUser")
        }
    })
})


const createAdminTable = `create table if not exists Admins (
    uname varchar(50) primary key,
    email varchar(100),
    password varchar(100),
    mobileNo varchar(12),
    address varchar(200)
);`

db.run(createAdminTable, (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("Admin table created !");
})


app.get("/adminsignup", function (req, res) {
    res.sendFile(__dirname + "/views/adminsignup.html")
})

app.post("/adminsignup", function (req, res) {
    let userName = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let insertCommand = `insert into Admins (uname,email,password) values(?,?,?)`
    let values = [userName, email, password];
    db.run(insertCommand, values, (err) => {
        if (err) console.log(err.message);

    })
    console.log(userName);
    console.log(password);
    res.redirect("/admin");
})

app.get("/adminsignin", function (req, res) {
    res.sendFile(__dirname + "/views/adminsignin.html")
})

app.post("/adminsignin", function (req, res) {
    let userName = req.body.username
    let Password = req.body.password;
    console.log(userName);
    console.log(Password);
    db.each("select password from Admins where Admins.uname=(?)",userName, function (err, row) {
        if (err) {
            console.log(err.message);
        }
        else {
            if (row.password === Password) {
                res.redirect("/admin");
            }
            else{
                res.redirect("/failure")
            }
        }


    })

})

const createQueryTable=`create table if not exists Queries(
    query varchar(1000),
    querrier varchar(50)
);`

db.run(createQueryTable,function (err) {
    if (err) {
        console.log(err.message)
    }
    console.log("Query Table created !");
})

app.post("/help/:parameter",function(req,res){
    let Query=req.body.query;
    let Querrier=req.params.parameter;
    const insertCommand=`insert into Queries (query,querrier) values (?,?)`
    let values=[Query,Querrier];
    db.run(insertCommand,values,function (err) {
        if (err) {
            console.log(err.message);
        }
    })
    res.redirect("/help/"+Querrier)

});

app.get("/queries",function (req,res) {
    const selectCommand=`select * from Queries`
    db.all(selectCommand,function (err,rows) {
        if (err) {
            console.log(err.message)
        }
        res.render("adminqueries.ejs",{Rows:rows})
    })
    
})


app.listen(80, function () {
    console.log("server is up and running");
})