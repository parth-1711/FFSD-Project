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

const offerSchema = {
    offerer: String,
    amount: Number,
    offerStatus: {
        type:Number,
        default:0
    }
}


const userSchema = {
    uname: String,
    email: String,
    password: String,
    adress: [String],
    offers: [offerSchema]
};

const adminSchema = {
    aname: String,
    email: String,
    password: String,
}

const querySchema={
    querrier : String,
    query : String
}

const isAuth=(req,res,next)=>{
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
    howold:String,
    setprice:Number,
    address:String,
    owner:String,
    offersreceived: [offerSchema]
}

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Offer = mongoose.model("Offer", offerSchema);
const Product = mongoose.model("Product", productSchema);
const Query=mongoose.model("Query",querySchema);



app.get("/", isAuth, function (req, res) {
    Product.find({}).then((foundProducts)=>{
        res.render("home.ejs", { user: req.session.user,ProducList:foundProducts })
    })
})

app.get("/homeAS/:parameter", isAuth, function (req, res) {
    Product.find({}).then((foundProducts)=>{
        res.render("homeAS.ejs", { user: req.session.user,ProducList:foundProducts })
    })
})

app.get("/furniture",(req,res)=>{
    Product.find({tags: "furniture"}).then((foundProducts)=>{
        res.render("aftersearch.ejs",{ user: req.session.user, productList:foundProducts })
    })
})

app.get("/automobile",(req,res)=>{
    Product.find({tags: "automobile"}).then((foundProducts)=>{
        res.render("aftersearch.ejs",{ user: req.session.user, productList:foundProducts })
    })
})

app.get("/sign-in", function (req, res) {
    res.render("sign-in.ejs")
})

app.post("/sign-in", function (req, res) {
    let userName = req.body.username;
    let Password = req.body.password;
    const isAdmin = req.body.admin === 'true';
    // console.log(isAdmin);
    if(isAdmin) {

    Admin.findOne({ aname: userName }).then(function (foundUser) {
        // console.log(foundUser);
        if (foundUser) {
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
        }
        else res.redirect("/failure")

    })
}

   else {
    User.findOne({ uname: userName }).then(function (foundUser) {
        // console.log(foundUser);
        if(foundUser){
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
        }
        else res.redirect("/failure")

    })

   }
})

app.get("/sign-up", function (req, res) {
    res.render("sign-up.ejs")
})

app.post("/sign-up", function (req, res) {
    let userName = req.body.username
    let email = req.body.email;
    let Password = req.body.password;
    const isAdmin = req.body.admin === 'true';

  if (isAdmin) {
    let insertCommand = `insert into Admins (uname,email,password) values(?,?,?)`
    let values = [userName, email, Password];
    bcrypt.hash(Password, 12).then((encryptedPassword) => {
        let admin = new Admin({
            aname: userName,
            email: email,
            password: encryptedPassword
        })
        admin.save()
        res.redirect("/sign-in");
    })
  } else {

    bcrypt.hash(Password, 12).then((encryptedPassword) => {
        let user = new User({
            uname: userName,
            email: email,
            password: encryptedPassword
        })
        user.save()
        res.redirect("/sign-in");
    })
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
    res.render("Failure.ejs")
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
    User.find({}).then((foundUsers)=>{
        res.render("RemoveUser.ejs",{Rows : foundUsers});
    })
    // res.render("RemoveUser.ejs")
})

app.post("/RemoveUser",isAuth,(req,res)=>{
    let username = req.body.searcheduser;
    User.find({uname: new RegExp(username,'i')}).then((foundUsers)=>{
        res.render("RemoveUser.ejs",{Rows : foundUsers});
    })
})

app.post("/ConfirmRemoval",isAuth,(req,res)=>{
    let username = req.body.username;
    // console.log(username);
    User.deleteOne({uname: username}).then(()=>{
        res.redirect("/RemoveUser");
    })
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


app.post("/help/:parameter",isAuth, function (req, res) {
    let queryStatement = req.body.query;
    let Querrier = req.params.parameter;

    let query1=new Query({
        querrier:Querrier,
        query:queryStatement
    });
    query1.save()
    res.redirect("/help/" + Querrier)

});

app.get("/queries",isAuth, function (req, res) {
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
    Product.find({title:new RegExp(searchString,'i')}).then((foundProducts)=>{
        // res.send(foundProducts);
        res.render("aftersearch",{user:req.session.user,productList:foundProducts})
        // console.log(foundProducts)
    })
})


app.listen(80, function () {
    console.log("server is up and running");
})

