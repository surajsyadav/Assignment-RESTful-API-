//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const validator = require('validator') ;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/apiDB",{
    useNewUrlParser: true
  });
const customersSchema =new mongoose.Schema( {
name: {
        type: String,
        required: true
      },
email:{
    type: String,
    trim: true,
    lowercase: true,
    unique: [true,"Alredy exist"],
    required: 'Email address is required',
    
},
phone:Number,
city:{
    type:String,
    required:true
}
  });
const Customer = mongoose.model("Customer", customersSchema);


app.route("/customers")


.get(function(req, res){
  Customer.find(function(err, customers){
    if (customers) {
    //   const jsonArticles = JSON.stringify(customers);
      res.send(customers);
    } else {
      res.send("No customer currently in apiDB.");
    }
  });
})

.post(function(req, res){
  const newCustomer =new Customer({
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    city:req.body.city
  });

  newCustomer.save(function(err){
    if (!err){
      res.send("Successfully added a new customers.");
    } else {
      res.send(err);
    }
  });
})



/////////////////////////Individual A///////////////////////////////////

app.route("/customers/:customerName")

.get(function(req, res){
  const customerName = req.params.customerName;
  Customer.findOne({name: customerName}, function(err, customer){
    if (customer){
      //const jsonArticle = JSON.stringify(article);
      res.send(customer);
    } else {
      res.send("No Customer with that title found.");
    }
  });
})

.patch(function(req, res){
  const customerName = req.params.customerName;
  Customer.updateOne(
    {name: customerName},
    {$set:req.body},
    function(err){
      if (!err){
        res.send("Successfully updated selected Customer.");
      } else {
        res.send(err);
      }
    });
})



.delete(function(req, res){
  const customerName = req.params.customerName;
  Customer.findOneAndDelete({name: customerName}, function(err){
    if (!err){
      res.send("Successfully deleted selected article.");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});