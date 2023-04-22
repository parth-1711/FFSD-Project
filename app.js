const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session)
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const sqlite = require("sqlite3");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
// const dbna = path.join(__dirname, "data", "ofsd.db");
const mongodbURI="mongodb+srv://parthirache8:tX15BDJHvUPQi3rq@cluster0.wnqv1xn.mongodb.net/?retryWrites=true&w=majority"
// const mongodbURI = "mongodb://127.0.0.1:27017/FFSD_ProjectDB"

mongoose.connect(mongodbURI, { useNewUrlParser: true })

const store = new mongodbSession({
    uri: mongodbURI,
    collection: "sessionInfo"
})

app.use(session({
    secret: "This will sign the cookie",
    resave: false,
    saveUninitialized: false,
    store: store
}))

const userSchema = {
    uname: String,
    email: String,
    password: String,
    adress: [String]
};

const adminSchema = {
    aname: String,
    email: String,
    password: String,
}

const offerSchema = {
    offerer: userSchema,
    amount: Number,
    offerStatus: {
        type:Number,
        default:0
    }
}


const querySchema={
    querrier : String,
    query : String
}

const isAuth=(req,res,next)=>{
    // console.log(req.session.isAuth);
    if (req.session.isAuth) {
        next();
    }
    else {
        res.redirect("/failure")
    }
}

const productSchema = {
    title: String,
    description: String,
    howold:Number,
    setprice:Number,
    // flat:String,
    // street:String,
    // landmark:String,
    // city:String,
    address:String,
    owner:String,
    offersreceived: [offerSchema]
}

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Offer = mongoose.model("Offer", offerSchema);
const Product = mongoose.model("Product", productSchema);
const Query=mongoose.model("Query",querySchema);

// const db = new sqlite.Database(dbna, (err) => {
//     if (err) {
//         console.log(err.message);
//     }
//     console.log("Connected");
// })

const createTable = `create table if not exists Users (
    uname varchar(50) primary key,
    email varchar(100),
    password varchar(100),
    mobileNo varchar(12),
    address varchar(200)
);`

// db.run(createTable, (err) => {
//     if (err) {
//         console.log(err.message);
//     }
//     console.log("table created !");
// })


app.get("/", function (req, res) {
    res.render("home.ejs")
})

app.get("/homeAS/:parameter", isAuth, function (req, res) {

    res.render("homeAS.ejs", { user: req.session.user })
    // console.log(req.params.parameter)
})

app.get("/sign-in", function (req, res) {
    res.sendFile(__dirname + "/views/sign-in.html")
})

app.post("/sign-in", function (req, res) {
    let userName = req.body.username;
    let Password = req.body.password;
    const isAdmin = req.body.admin === 'true';
    console.log(isAdmin);
    if(isAdmin) {

    Admin.findOne({ aname: userName }).then(function (foundUser) {
        console.log(foundUser);

        bcrypt.compare(Password, foundUser.password).then((isMatch) => {
            if (isMatch) {
                req.session.isAuth = true
                req.session.user = userName
                res.render("adminpage.ejs");
            }
            else {
                res.redirect("/failure")
            }
        })

    })
}

   else {
    User.findOne({ uname: userName }).then(function (foundUser) {
        console.log(foundUser);

        bcrypt.compare(Password, foundUser.password).then((isMatch) => {
            if (isMatch) {
                req.session.isAuth = true
                req.session.user = userName
                res.redirect("/homeAS/"+userName);
            }
            else {
                res.redirect("/failure")
            }
        })

    })

   }
})

app.get("/sign-up", function (req, res) {
    res.sendFile(__dirname + "/views/sign-up.html")
})

app.post("/sign-up", function (req, res) {
    let userName = req.body.username
    let email = req.body.email;
    let Password = req.body.password;
    const isAdmin = req.body.admin === 'true';

  if (isAdmin) {
    let insertCommand = `insert into Admins (uname,email,password) values(?,?,?)`
    let values = [userName, email, Password];
    // db.run(insertCommand, values, (err) => {
    //     if (err) console.log(err.message);

    // })
    bcrypt.hash(Password, 12).then((encryptedPassword) => {
        let admin = new Admin({
            aname: userName,
            email: email,
            password: encryptedPassword
        })
        admin.save()
        res.redirect("/sign-in");
    })
    // console.log(userName);
    // console.log(password);
    // res.redirect("/admin");
  } else {
    let insertCommand = `insert into Users (uname,email,password) values(?,?,?)`
    let values = [userName, email, Password];
    // db.run(insertCommand, values, (err) => {
    //     if (err) console.log(err.message);

    // })

    bcrypt.hash(Password, 12).then((encryptedPassword) => {
        let user = new User({
            uname: userName,
            email: email,
            password: encryptedPassword
        })
        user.save()
        res.redirect("/sign-in");
    })

    // console.log(userName);
    // console.log(password);
}})

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            throw err;
        }
    })
    res.redirect("/")
})

app.get("/failure", function (req, res) {
    res.sendFile(__dirname + "/views/failure.html")
})

app.get("/product/:parameter", isAuth, function (req, res) {
    // console.log(req.params.parameters)
    res.render("Product (1).ejs", { user: req.session.user })
})

app.get("/userProfile/:parameter", isAuth, function (req, res) {
    res.render("userprofile.ejs", { user: req.session.user })
})

app.get("/sellerBargain/:parameter1/:parameter2", isAuth, function (req, res) {
    res.render("sellerBargain.ejs", { productName: req.params.parameter1, user: req.session.user })
})

app.post("sellerBargain/:parameter1/:parameter2",isAuth,(req,res)=>{
    Product.findOne({productName:req.params.parameter1,owner:req.session.user}).then((foundProduct)=>{
        let accFlag=-1;
        for (let i = 0; i < foundProduct.offersreceived.length; i++) {
            if (foundProduct.offersreceived[i].offerStatus===1) {
                accFlag=i;
            }
            
        }

        let statusArraymsg=["Sorry your Offer is declined","Waiting for response from Seller","Congratulation! Offer Accepted witing for buyer's Response"]

        if (accFlag!=-1) {
            res.render("sellerBargain",{offers: [foundProduct.offersreceived[accFlag]],statusMsg:statusArraymsg});
        }
        else{
            res.render("sellerBargain",{offers: foundProduct.offersreceived,statusMsg:statusArraymsg})
        }
    })
})

app.post("/acceptOffer/:parameter",isAuth,(req,res)=>{
    const offerId=req.body.oId;
    Product.findOne({productName:req.params.parameter,owner:req.session.user}).then((foundProduct)=>{
        for (let i = 0; i < foundProduct.offersreceived.length; i++) {
            if (foundProduct.offersreceived[i]._id=oId) {
                foundProduct.offersreceived[i].offerStatus=1
            }
            else foundProduct.offersreceived[i].offerStatus=-1 
            
        }
        res.redirect("sellerBargain/"+req.params.parameter+"/"+req.session.user)
    })
})



app.get("/SavedAddress/:parameter", isAuth, function (req, res) {   
    User.findOne({uname: req.session.user})
        .then((docs)=>{
            let num = docs.__v;
            res.render("SavedAddress.ejs", { user: req.session.user, Rows:docs})
    })
    .catch((err)=>{
        console.log(err);
    });
    
})

app.post("/SavedAddress/:parameter", isAuth, function (req, res) {
    let addline1 = req.body.addlineone;
    let addlin2 = req.body.addlinetwo;
    let landm = req.body.landmark;
    let city = req.body.city;
    let new_addr = addline1+ "\n" + addlin2 + "\n" + landm + "\n" + city;
    User.findOne({uname: req.session.user})
        .then((docs)=>{
            docs.adress.push(new_addr);
            docs.save();
            res.render("SavedAddress.ejs", { user: req.session.user ,  Rows:docs});
    })
    .catch((err)=>{
        console.log(err);
    });

})

app.get("/Myads/:parameter", isAuth, function (req, res) {
    res.render("Myads.ejs", { user: req.session.user })
})
app.get("/search/:parameter", isAuth, function (req, res) {
    res.render("aftersearch.ejs", { user: req.session.user })
})

app.post("/Myads/:parameter",isAuth,(req,res)=>{
    
})
app.get("/checkout/:parameters",isAuth, function (req, res) {
    res.render("checkout.ejs", { user: req.params.parameters })
})

app.get("/MyOffers/:parameters", isAuth, function (req, res) {
    res.render("MyOffers.ejs", { user: req.session.user })
})

app.get("/aboutUs", function (req, res) {
    res.render("aboutUs.ejs")
})

app.get("/sell/:parameter", isAuth, function (req, res) {
    res.render("Sellproduct.ejs", { user: req.session.user })
})

app.get("/RemoveUser", isAuth, function (req, res) {
    res.sendFile(__dirname + "/views/RemoveUser.html")
})

app.get("/help/:parameter", isAuth, function (req, res) {
    res.render("help.ejs", { user: req.session.user })
})

app.get("/admin", isAuth, function (req, res) {
    res.render("adminpage.ejs")
})



app.get("/productdetails/:parameter", isAuth, function (req, res) {
    res.render("productdetails.ejs", { user: req.session.user })
})

app.post("/RemoveUser", isAuth, function (req, res) {
    let userName = req.body.uname;
    let reason = req.body.reason;
    // db.run("delete from Users where uname=(?)", [userName], function (err) {
    //     if (err) {
    //         res.redirect(__dirname + "/views/deletionFailure.html")
    //     }
    //     else {
    //         res.redirect("/RemoveUser")
    //     }
    // })
})


const createAdminTable = `create table if not exists Admins (
    uname varchar(50) primary key,
    email varchar(100),
    password varchar(100),
    mobileNo varchar(12),
    address varchar(200)
);`

// db.run(createAdminTable, (err) => {
//     if (err) {
//         console.log(err.message);
//     }
//     console.log("Admin table created !");
// })


app.get("/adminsignup", function (req, res) {
    res.sendFile(__dirname + "/views/adminsignup.html")
})

app.post("/adminsignup", function (req, res) {
    let uname = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let insertCommand = `insert into Admins (uname,email,password) values(?,?,?)`
    let values = [uname, email, password];
    // db.run(insertCommand, values, (err) => {
    //     if (err) console.log(err.message);

    // })
    bcrypt.hash(password, 12).then((encryptedPassword) => {
        let admin = new Admin({
            uname: uname,
            email: email,
            password: encryptedPassword
        })
        admin.save()
        res.redirect("/admin");
    })
    // console.log(userName);
    // console.log(password);
    // res.redirect("/admin");
})

app.get("/adminsignin", function (req, res) {
    res.sendFile(__dirname + "/views/adminsignin.html")
})

app.post("/adminsignin", function (req, res) {
    let userName = req.body.username
    let Password = req.body.password;

    // db.each("select password from Admins where Admins.uname=(?)", userName, function (err, row) {
    //     if (err) {
    //         console.log(err.message);
    //     }
    //     else {
    //         if (row.password === Password) {
    //             res.redirect("/admin");
    //         }
    //         else {
    //             res.redirect("/failure")
    //         }
    //     }


    // })


    Admin.findOne({ uname: userName }).then(function (foundUser) {

        bcrypt.compare(Password, foundUser.password).then((isMatch) => {
            if (isMatch) {
                req.session.isAuth = true
                req.session.user = userName
                res.redirect("/admin")

                // res.session.user=foundUser.uname
            }
            else {
                // console.log("Incorrect")
                res.redirect("/failure")
            }
        })

    })
    

})

const createQueryTable = `create table if not exists Queries(
    query varchar(1000),
    querrier varchar(50)
);`

// db.run(createQueryTable, function (err) {
//     if (err) {
//         console.log(err.message)
//     }
//     console.log("Query Table created !");
// })

app.post("/help/:parameter",isAuth, function (req, res) {
    let queryStatement = req.body.query;
    let Querrier = req.params.parameter;

    let query1=new Query({
        querrier:Querrier,
        query:queryStatement
    });
    query1.save()


    // const insertCommand = `insert into Queries (query,querrier) values (?,?)`
    // let values = [Query, Querrier];
    // db.run(insertCommand, values, function (err) {
    //     if (err) {
    //         console.log(err.message);
    //     }
    // })
    res.redirect("/help/" + Querrier)

});

app.get("/queries",isAuth, function (req, res) {
    // const selectCommand = `select * from Queries`
    // db.all(selectCommand, function (err, rows) {
    //     if (err) {
    //         console.log(err.message)
    //     }
    //     res.render("adminqueries.ejs", { Rows: rows })
    // })

    Query.find({}).then((foundQueries)=>{
        res.render("adminqueries",{Rows : foundQueries});
    })

})

app.post("/productdetails/:parameter", function (req, res) {
    let Title = req.body.title;
    let Description = req.body.descrption;
    let Howold = req.body.howold;
    let Setprice = req.body.setprice;
    let flat = req.body.flat;
    let street = req.body.street;
    let landmark = req.body.landmark;
    let city = req.body.city;
    let images = req.body.images;
    
    let productSch = new Product ({
        title: Title,
        description: Description,
        howold:Howold,
        setprice:Setprice,
        address:flat+","+street+","+landmark+","+city+",",
        
        offersreceived: [offerSchema]
    })
    
    res.redirect("/Myads/" + userName);
});

app.post("/search",isAuth,(req,res)=>{
    let searchString=req.body.searchString;
    Product.find({productName:new RegExp(searchString,'i')}).then((foundProducts)=>{
        // res.send(foundProducts);
        res.render("aftersearch",{user:req.session.user,productList:foundProducts})
        console.log(foundProducts)
    })
})




app.listen(80, function () {
    console.log("server is up and running");
})

