const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema");
const bcrypt=require("bcryptjs");
const authenticate = require("../middleware/authenticate");
//api get
router.get("/getproducts", async (req, res) => {
  try {
    const productsdata = await Products.find();
    // console.log(productsdata);
    res.status(201).json(productsdata);
  } catch (error) {
    console.log("error" + error.message);
  }
});
//get individual data
router.get("/getproductsone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const individualdata = await Products.findOne({ id: id });
    //console.log(individualdata + "individual data");
    res.status(201).json(individualdata);
  } catch (error) {
    res.status(400).json(individualdata);
    console.log("error" + error.message);
  }
});

//register data
router.post("/register", async (req, res) => {
  //console.log(req.body);
  const { fname, email, mobile, password, cpassword } = req.body;
  if (!fname || !email || !mobile || !password || !cpassword) {
    res.status(422).json({ error: "fill all details" });
    console.log("no data available");
  }
  try {
    const preuser = await USER.findOne({ email: email });
    if (preuser) {
      res.status(422).json({ error: "this user is already present" });
    } else if (password !== cpassword) {
      res.status(422).json({ error: "password and cpassword not matched" });
    } else {
      const finalUser = new USER({
        fname,
        email,
        mobile,
        password,
        cpassword,
      });
      //password hashing process
      
      const storedata = await finalUser.save();
      console.log(storedata);
      res.status(201).json(storedata);
    }
  } catch (error) {}
});
//LoginUser API
router.post('/login',async(req,res)=>{
  const {email,password}=req.body;
  if(!email || !password){
    res.status(400).json({error:"Fill all the details"})
  };
  try {
    const userlogin=await USER.findOne({email:email});
    console.log(userlogin);
    if(userlogin){
      const isMatch=await bcrypt.compare(password,userlogin.password);
      console.log(isMatch);
     //token generate
     const token=await userlogin.generatAuthtoken();
     //console.log(token);
     res.cookie("Amazonweb",token,{
      expires: new Date(Date.now() + 2589000),
      httpOnly: true
     })
      if (!isMatch) {
        res.status(400).json({ error: "invalid crediential pass" });
    }
    else {            
      res.status(201).json(userlogin);
  }
}else{
  res.status(400).json({ error: "invalid crediential pass" });
}
} catch (error) {
    res.status(400).json({ error: "invalid crediential pass" });
  }
})
//adding data into the cart
router.post("/addcart/:id",authenticate,async(req,res)=>{
  try {
    const {id}=req.params;
    const cart=await Products.findOne({id:id});
    console.log(cart+"cart value");
    const UserContact = await USER.findOne({ _id: req.userID });
    console.log(UserContact + "user milta hain");
    if (UserContact) {
      const cartData = await UserContact.addcartdata(cart);
      await UserContact.save();
      console.log(cartData);
     //console.log(UserContact + "userjode save");
      res.status(201).json(UserContact);
  }
  else{
    res.status(401).json({error:"invalid user"});
  }
  } catch (error) {
    res.status(401).json({error:"invalid user"});
  }
})
//get cart details
router.get('/cartdetails',authenticate,async(req,res)=>{
try {
  const  buyuser=await USER.findOne({_id:req.userID});
  res.status(201).json(buyuser);
} catch (error) {
  console.log("error"+error);
}
})
//get valid user
router.get('/validuser',authenticate,async(req,res)=>{
  try {
    const  validuserone=await USER.findOne({_id:req.userID});
    res.status(201).json(validuserone);
  } catch (error) {
    console.log("error"+error);
  }
  })
  //remove data
  router.get("/remove/:id",authenticate,async(req,res)=>{
    try {
      const { id } = req.params;
      req.rootUser.carts = req.rootUser.carts.filter((currval) => {
        return currval.id != id
    });

    req.rootUser.save();
    res.status(201).json(req.rootUser);
    console.log("item remove");

    } catch (error) {
      console.log(error + "jwt provide then remove");
      res.status(400).json(error);
    }
  })
  //for user logout
  router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("Amazonweb", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});
module.exports = router;
 