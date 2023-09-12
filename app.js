const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session)
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const { title } = require("process");
const { log } = require("console");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const mongodbURI = "mongodb+srv://parthirache8:tX15BDJHvUPQi3rq@cluster0.wnqv1xn.mongodb.net/?retryWrites=true&w=majority"

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

// All schemas for Database

const offerSchema = {
    offerer: String,
    productName: String,
    owner: String,
    amount: Number,
    offerStatus: {
        type: Number,
        default: 0
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

const querySchema = {
    querrier: String,
    query: String
}

const productSchema = {
    images: String,
    title: String,
    description: String,
    howold: String,
    setprice: Number,
    address: String,
    images: String,
    owner: String,
    offersreceived: []
}

// const User = require("./models/User");
// const Offer = require("./models/Offer");
// const Admin = require("./models/Admin");
// const Product = require("./models/Product");
// const Query = require("./models/Query");


//middleware for checking whether user is logged in or not
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    }
    else {
        res.redirect("/failure")
    }
}

const Offer = mongoose.model("Offer", offerSchema);
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Product = mongoose.model("Product", productSchema);
const Query = mongoose.model("Query", querySchema);

app.get("/", function (req, res) {
    //This is home route before sign in

    let pdtimgs = [];
    Product.find({}).then((foundProducts) => {
        for (let i = 0; i < 16; i++) {
            pdtimgs.push(foundProducts[i].images.split(",")[0]);
        }
        res.render("home.ejs", { user: req.session.user, ProductList: foundProducts, ImagesArray: pdtimgs })
    })
})

app.get("/homeAS/:parameter", isAuth, function (req, res) {
        //This is home route after sign in

    let pdtimgs = [];
    Product.find({}).then((foundProducts) => {
        for (let i = 0; i < 16; i++) {
            pdtimgs.push(foundProducts[i].images.split(",")[0]);
        }
        res.render("homeAS.ejs", { user: req.session.user, ProductList: foundProducts, ImagesArray: pdtimgs })
    })
})

app.get("/furniture", (req, res) => {
    Product.find({ tags: "furniture" }).then((foundProducts) => {
        const finalimgarr = [];
        for (let i = 0; i < foundProducts.length; i++) {
            var img = foundProducts[i].images;
            const imgarr = img.split(",");
            finalimgarr[i] = imgarr[0];
        }
        res.render("aftersearch.ejs", { user: req.session.user, productList: foundProducts, imgs: finalimgarr })
    })
})

app.get("/mobile", (req, res) => {
    Product.find({ tags: "mobiles" }).then((foundProducts) => {
        const finalimgarr = [];
        for (let i = 0; i < foundProducts.length; i++) {
            var img = foundProducts[i].images;
            const imgarr = img.split(",");
            finalimgarr[i] = imgarr[0];
        }
        res.render("aftersearch.ejs", { user: req.session.user, productList: foundProducts, imgs: finalimgarr })
    })
})

app.get("/automobile", (req, res) => {
    Product.find({ tags: "automobile" }).then((foundProducts) => {
        const finalimgarr = [];
        for (let i = 0; i < foundProducts.length; i++) {
            var img = foundProducts[i].images;
            const imgarr = img.split(",");
            finalimgarr[i] = imgarr[0];
        }

        res.render("aftersearch.ejs", { user: req.session.user, productList: foundProducts, imgs: finalimgarr })
    })
})

app.get("/electronics", (req, res) => {
    Product.find({ tags: "electronics" }).then((foundProducts) => {
        const finalimgarr = [];
        for (let i = 0; i < foundProducts.length; i++) {
            var img = foundProducts[i].images;
            const imgarr = img.split(",");
            finalimgarr[i] = imgarr[0];
        }
        res.render("aftersearch.ejs", { user: req.session.user, productList: foundProducts, imgs: finalimgarr })
    })
})

app.get("/fashion", (req, res) => {
    Product.find({ tags: "fashion" }).then((foundProducts) => {
        const finalimgarr = [];
        for (let i = 0; i < foundProducts.length; i++) {
            var img = foundProducts[i].images;
            const imgarr = img.split(",");
            finalimgarr[i] = imgarr[0];
        }
        res.render("aftersearch.ejs", { user: req.session.user, productList: foundProducts, imgs: finalimgarr })
    })
})

app.get("/hardware", (req, res) => {
    Product.find({ tags: "hardware" }).then((foundProducts) => {
        const finalimgarr = [];
        for (let i = 0; i < foundProducts.length; i++) {
            var img = foundProducts[i].images;
            const imgarr = img.split(",");
            finalimgarr[i] = imgarr[0];
        }
        res.render("aftersearch.ejs", { user: req.session.user, productList: foundProducts, imgs: finalimgarr })
    })
})

app.get("/sign-in", function (req, res) {
    res.render("sign-in.ejs")
})

app.post("/sign-in", function (req, res) {
    //post route for sign in route it changes req.session.user to current user name and changes req.session.isAuth to true
    let userName = req.body.username;
    let Password = req.body.password;
    const isAdmin = req.body.admin === 'true';
    //console.log(isAdmin);
    if (isAdmin) {

        Admin.findOne({ aname: userName }).then(function (foundUser) {
            //console.log(foundUser);
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
            //console.log(foundUser);
            if (foundUser) {
                bcrypt.compare(Password, foundUser.password).then((isMatch) => {
                    if (isMatch) {
                        req.session.isAuth = true
                        req.session.user = userName
                        res.redirect("/homeAS/" + userName);
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
    //It makes a new entry in user collection
    let userName = req.body.username
    let email = req.body.email;
    let Password = req.body.password;
    const isAdmin = req.body.admin === 'true';

    if (isAdmin) {
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
            console.log(user)
            res.redirect("/sign-in");
        })
    }
})

app.post("/logout", (req, res) => {

    //This destroys existing session

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

let v = 1;
app.get("/product", isAuth, function (req, res) {

    //Page displays data about product dynamically

    var param = req.query.param;
    const arr = param.split("-");

    Product.findOne({ _id: param }).then(function (foundp) {

        var imgs = foundp.images;
        const imgarr = imgs.split(",");



        res.render("product (1).ejs", { howold: foundp.howold, seller: foundp.owner, img1: imgarr, foundproduct: foundp, title: foundp.title, price: foundp.setprice, address: foundp.address, description: foundp.description, user: req.session.user, id: foundp._id })

    })

})

app.get("/userProfile/:parameter", isAuth, function (req, res) {
//this method renders user profile

    var currentUser = req.session.user;

    const arrTitle = [];
    const arrImg = [];

    Product.find({ owner: currentUser }).then((foundProducts) => {
        // console.log(foundProducts);
        len = foundProducts.length
        if (len > 4) {
            for (let i = 0; i < 4; i++) {
                arrTitle[i] = foundProducts[i].title;
            }
            for (let i = 0; i < 4; i++) {
                const imgs = foundProducts[i].images.split(",");
                arrImg[i] = imgs[0];
            }

        }
        else {
            for (let i = 0; i < len; i++) {
                arrTitle[i] = foundProducts[i].title;
            }
            for (let i = 0; i < len; i++) {
                const imgs = foundProducts[i].images.split(",");
                arrImg[i] = imgs[0];
            }
        }

        res.render("userprofile.ejs", { arr: arrTitle, arrImage: arrImg, user: req.session.user })

    })

})

app.get("/sellerBargain/:parameter1", isAuth, function (req, res) {
    let pId = req.params.parameter1;
    // console.log(pId);
    Product.findOne({ _id: req.params.parameter1, owner: req.session.user }).then((foundProduct) => {
        let accFlag = -1;
        pimage = []
        for (let i = 0; i < foundProduct.offersreceived.length; i++) {
            if (foundProduct.offersreceived[i].offerStatus === 1) {
                accFlag = i;
            }
        }

        let statusArraymsg = ["Sorry your Offer is declined", "Waiting for response from Seller", "Congratulation! Offer Accepted waiting for buyer's Response"]

        if (accFlag != -1) {
            res.render("sellerBargain", { offers: [foundProduct.offersreceived[accFlag]], statusMsg: statusArraymsg, user: req.session.user, id: pId });
        }
        else {
            res.render("sellerBargain", { offers: foundProduct.offersreceived, statusMsg: statusArraymsg, user: req.session.user, id: req.params.parameter1 })
        }
    })
})

app.post("/sellerBargain/:parameter1/:parameter2", isAuth, (req, res) => {
    const pId = req.params.parameter1;
    // console.log(pId);
    let offerId = req.params.parameter2;

    Product.findOne({ _id: pId }).then((foundProduct) => {
        for (let i = 0; i < foundProduct.offersreceived.length; i++) {
            if (foundProduct.offersreceived[i]._id == offerId) {
                foundProduct.offersreceived[i].offerStatus = 1
            }
            else {
                foundProduct.offersreceived[i].offerStatus = -1
            }
        }
        foundProduct.markModified('offersreceived')
        foundProduct.save()
        Offer.findOne({ _id: offerId }).then((foundOffer) => {
            foundOffer.offerStatus = 1
            foundOffer.save()
            res.redirect("/sellerBargain/" + pId)
        })

    })
})

app.post("/acceptOffer/:parameter", isAuth, (req, res) => {

})



app.get("/SavedAddress/:parameter", isAuth, function (req, res) {
    User.findOne({ uname: req.session.user })
        .then((docs) => {
            let num = docs.__v;
            res.render("SavedAddress.ejs", { user: req.session.user, Rows: docs })
        })
        .catch((err) => {
            console.log(err);
        });

})

app.post("/SavedAddress/:parameter", isAuth, function (req, res) {
    let addline1 = req.body.addlineone;
    let addlin2 = req.body.addlinetwo;
    let landm = req.body.landmark;
    let city = req.body.city;
    let new_addr = addline1 + "\n" + addlin2 + "\n" + landm + "\n" + city;
    User.findOne({ uname: req.session.user })
        .then((docs) => {
            docs.adress.push(new_addr);
            docs.save();
            res.render("SavedAddress.ejs", { user: req.session.user, Rows: docs });
        })
        .catch((err) => {
            console.log(err);
        });

})

app.get("/Myads/:parameter", isAuth, function (req, res) {

    Product.find({ owner: req.session.user }).then((foundProducts) => {
        pimage = []
        for (let i = 0; i < foundProducts.length; i++) {
            pimage.push(foundProducts[i].images.split(",")[0])

        }
        //console.log(pimage);
        res.render("Myads.ejs", { user: req.session.user, image: pimage, ProductList: foundProducts })
    })

})

app.get("/search/:parameter", isAuth, function (req, res) {
    res.render("aftersearch.ejs", { user: req.session.user })
})

app.post("/Myads/:parameter", isAuth, (req, res) => {

})
app.get("/checkout", isAuth, function (req, res) {
    res.render("checkout.ejs", { user: req.session.user })
})

app.get("/MyOffers/:parameters", isAuth, function (req, res) {
    const finalimgarr=[];

    Offer.find({ offerer: req.session.user }).then((offers) => {
        for (let j=0; j<offers.length; j++) {
            var pname = offers[j].productName;
            Product.findOne({title : pname}).then((foundUser) => {
                
                var imgs = foundUser.images;
                imgarr = imgs.split(",");
                finalimgarr[j]=imgarr[0];
                // console.log(imgarr[0]);
            })
        }
        // console.log(finalimgarr);
        let statusArraymsg = ["Sorry your Offer is declined", "Waiting for response from Seller", "Congratulation! Offer Accepted waiting for buyer's Response"]
        res.render("MyOffers.ejs", { user: req.session.user, statusMsg: statusArraymsg, offerList: offers, imgarr : finalimgarr })
            
        })

    })
        
        
app.get("/FAQ/:parameter", function (req,res) {
    res.render("FAQ.ejs", { user: req.session.user })
})   

app.get("/aboutUs", function (req, res) {
    res.render("aboutUs.ejs")
})

app.get("/sell/:parameter", isAuth, function (req, res) {
    res.render("Sellproduct.ejs", { user: req.session.user })
})

app.get("/RemoveUser", isAuth, function (req, res) {
    User.find({}).then((foundUsers) => {
        res.render("RemoveUser.ejs", { Rows: foundUsers });
    })
})

app.post("/RemoveUser", isAuth, (req, res) => {
    let username = req.body.searcheduser;
    User.find({ uname: new RegExp(username, 'i') }).then((foundUsers) => {
        res.render("RemoveUser.ejs", { Rows: foundUsers });
    })
})

app.post("/ConfirmRemoval", isAuth, (req, res) => {
    let username = req.body.username;
    User.deleteOne({ uname: username }).then(() => {
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

// app.post("/adminsignup", function (req, res) {
//     let uname = req.body.username;
//     let email = req.body.email;
//     let password = req.body.password;
//     bcrypt.hash(password, 12).then((encryptedPassword) => {
//         let admin = new Admin({
//             uname: uname,
//             email: email,
//             password: encryptedPassword
//         })
//         admin.save()
//         res.redirect("/admin");
//     })
// })

app.post("/adminsignin", function (req, res) {
    let userName = req.body.username
    let Password = req.body.password;

    Admin.findOne({ uname: userName }).then(function (foundUser) {

        bcrypt.compare(Password, foundUser.password).then((isMatch) => {
            if (isMatch) {
                req.session.isAuth = true
                req.session.user = userName
                res.redirect("/admin")
            }
            else {
                res.redirect("/failure")
            }
        })

    })


})


app.post("/help/:parameter", isAuth, function (req, res) {
    let queryStatement = req.body.query;
    let Querrier = req.params.parameter;

    let query1 = new Query({
        querrier: Querrier,
        query: queryStatement
    });
    query1.save()
    res.redirect("/help/" + Querrier)

});

app.get("/queries", isAuth, function (req, res) {
    Query.find({}).then((foundQueries) => {
        res.render("adminqueries", { Rows: foundQueries });
    })


})

app.post("/productdetails/:parameter", function (req, res) {
    let Title = req.body.title;
    let Description = req.body.description;
    let Howold = req.body.howold;
    let Setprice = req.body.setprice;
    let flat = req.body.flat;
    let street = req.body.street;
    let landmark = req.body.landmark;
    let city = req.body.city;
    let Frontview = req.body.images1;
    let Backview = req.body.images2;
    let Sideview = req.body.images3;
    let own = req.session.user;
    let tags = req.params.parameter;
    let productSch = new Product({
        title: Title,
        description: Description,
        howold: Howold,
        setprice: Setprice,
        address: flat + "," + street + "," + landmark + "," + city + ",",
        images: Frontview + "," + Backview + "," + Sideview + ",",
        owner: own,
        tags: tags
    })
    productSch.save()

    res.redirect("/Myads/" + req.session.user);
});

app.post("/search", isAuth, (req, res) => {
    searchString = req.body.searchString
    Product.find({ title: new RegExp(searchString, 'i') }).then((foundProducts) => {

        const finalimgarr = [];
        for (let i = 0; i < foundProducts.length; i++) {
            var img = foundProducts[i].images;
            const imgarr = img.split(",");
            finalimgarr[i] = imgarr[0];
        }

        res.render("aftersearch", { user: req.session.user, productList: foundProducts, imgs: finalimgarr })
    })
})

app.post("/uploadOffer", (req, res) => {
    let amount1 = req.body.amount;
    let id = req.query.param

    Product.findOne({ _id: id }).then((foundProduct) => {
        // console.log(amount1);
        // console.log(foundProduct.title)
        let offer = new Offer({
            offerer: req.session.user,
            productName: foundProduct.title,
            owner: foundProduct.owner,
            amount: amount1
        })
        // console.log(foundProduct.offersreceived)
        // console.log(offer)
        offer.save()
        foundProduct.offersreceived.push(offer);

        foundProduct.save()
    })
    User.find({ uname: req.session.user }).then((foundUser) => {
        res.redirect("/myOffers/" + req.session.user);
    })
})

app.get('/signupajax/:email',(req,res)=>{
    let mail = req.params.email;
    User.find({email : mail}).then(arr=>{
        let output = JSON.stringify({
            isNotpresent: arr.length == 0
        });
        res.send(output)
    })
    .catch(err=>{
        console.log(err.message)
        res.send('<h1>error</h1>')
    })

})

app.post('/username-avail',async(req,res)=>{
    let username=req.body.username;
    let foundUser=await User.find({uname:username},"uname");
    console.log(foundUser);
    res.json(foundUser);
})

app.listen(80, function () {
    console.log("server is up and running");
})
