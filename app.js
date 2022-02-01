//jshint esversion:6
const express=require('express');
const bodyParser=require('body-parser');
const { get } = require("http");
const _ =require("lodash");
const { title } = require("process");
const events=require("events");
const { EventEmitter } = require("events");
const mongoose=require("mongoose");
const { includes } = require('lodash');
// const myincludes = require(__dirname+'/public/js/RegisterForm.js'); 

const app=express();
var orderItem=[];

let msg="Registration is fast, easy and free";
let msg2="Track your order by using order number";

mongoose.connect('mongodb://localhost:27017/foodOrderingDB',{useNewUrlParser:true,useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set("view engine","ejs");

const foodSchema=new mongoose.Schema({
    title:String,
    restaurantName:String,
    content:String,
    price:Number,
    date:String

}
);
const orderSchema=new mongoose.Schema({
    foodDetail:[foodSchema],
    flatNo:Number,
    streetName:String,
    area:String,
    landMark:String,
    city:String
});
const regSchema=new mongoose.Schema({
    fname:String,
    lname:String,
    password:String,
    re_password:String,
    mobile:String,
    email:String
})
const Food=new mongoose.model('AddFood',foodSchema);
const Sfood=new mongoose.model("StoreFood",foodSchema);
const Ofood=new mongoose.model("OrderFood",orderSchema);
const Reg=new mongoose.model("Regiseration",regSchema);


app.post("/AddfoodBox",function(req,res){
    const dish=new Food({
        title:req.body.itemName,
        restaurantName:req.body.resturantName,
        content:req.body.itemContent,
         price:req.body.itemPrice,
        date:req.body.O_date
    })
    dish.save();
    console.log("Data is succesfully saved");
    res.redirect("foodmenu");
})
app.post("/cart",function(req,res){
  const addr=new Ofood({
      flatNo:req.body.flatNo,
      streetName:req.body.streetName,
      area:req.body.area,
      landMark:req.body.landMark,
      city:req.body.city
  })  
  addr.save();
  console.log("saved successfully");
  res.redirect("cart");
})
app.post("/foodBox",function(req,res){
    let rqName=req.body.itemName;
    let id=req.body.id;
    Food.findOne({_id:id},function(err,foods){
        if(err){
            console.log(err);
        }else{
            const cdish=new Sfood({
                title:foods.title,
                restaurantName:foods.restaurantName,
                content:foods.content,
                 price:foods.price,
                date:foods.date
            })
            cdish.save();
            console.log("Item save sucessfully");
        }
    })
    res.redirect("cart");
})
app.post("/delete",function(req,res){
    id=req.body.id;
    Sfood.findByIdAndRemove({_id:id},function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("item is been removed");
            res.redirect("cart");
        }
    })
    // List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundlist){
    //     if(!err){
    //       res.redirect("/"+listName);
    //     }
    //   })
})
// Registeration form ...................................................
app.post("/register",function(req,res){
    const newReg=new Reg({
        fname:req.body.fname,
        lname:req.body.lname,
        password:req.body.password,
        re_password:req.body.password,
        mobile:req.body.mobile,
        email:req.body.email
    })
    newReg.save(function(err){
        if(!err){
            console.log("Registeration saved succesfully");
            
        }
        else{
            console.log(err);
        }
    });
   res.redirect("sigup");
})
//Registration Ends here................................
// LoginStart Here..................................
app.post("/login",function(req,res){
    let email=req.body.email;
    let password=req.body.password;
    Reg.findOne({},function(err,regs){
        if(!err){
            if(email === regs.email && password === regs.password){
                console.log("Login was Sucessful");
            }else{console.log("Incorrect Password or Email");}
        }else{
            console.log(err);
        }  
    })
    res.redirect("sigin");
    
})
app.get("/cart",function(req,res){
    Sfood.find({},function(err,foods){
        if(!err){
            if(!foods){
                document.querySelector("#cart-empty").style.visibility = "show";
            }else{
                res.render("cart",{rootTitle:"Cart",items:foods});
            }
        }
});
})
app.get("/postFood/:name",function(req,res){
    const rootName=_.lowerCase(req.params.name);
    items.forEach(item => {
        const foodname=_.lowerCase(item.title);
        if(rootName === foodname){
            res.render("postFood",{
                rootTitle:item.title,
                title:item.title,
                content:item.content,
                price:item.price
            })
        }
    });
})

app.get("/foodmenu",function(req,res){
    Food.find({},function(err,foods){
        console.log(foods.id);
        res.render("foodmenu",{rootTitle:"Menu",items:foods});
    })
});
app.get("/",function(req,res){
    Food.find({},function(err,foods){
        console.log(foods.id);
        res.render("home",{rootTitle:"Home",items:foods});
    })  
})
app.get("/sigin",function(req,res){
    res.render("sigin",{rootTitle:"Sigin",imgMsg:msg});
})
app.get("/sigup",function(req,res){
    res.render("sigup",{rootTitle:"Sigup",imgMsg:msg}); 
});
app.get("/AddfoodBox",function(req,res){
    res.render("AddfoodBox",{rootTitle:"Add New item"});
})
app.get("/trackOrder",function(req,res){
    res.render("trackOrder",{rootTitle:"Track Order",imgMsg:msg2});
})
app.get("/myOrder",function(req,res){
    res.render("myOrder",{rootTitle:"My Order"});
})

app.get("/profile",function(req,res){
    res.render("profile",{rootTitle:"Profile",imgMsg:"Update Profile"});
})

app.listen(3000,function(){
    console.log("Server is running on port 3000 !")
})