const express = require('express');
const router=express.Router();
const {middleware}=require('../middleware/middleware');
const orderList =require('../schema/order');
const productList=require('../schema/product');
const {getTimes}=require('./time');

// get all products
router.get('/', async (req, res, next) => {
    try{
        const allData= await productList.find();
        res.status(200).json(allData)
    }catch(err){
        res.status(202).json({message:err})
    }
    
  })

//   get individual products
  router.get('/product/:key', async (req, res, next) => {
    try{
        const productOne= await productList.find({key:key});
        res.json(productOne)
    }catch(err){
        res.status(202).json({message:err})
    }
    
  })


  router.post('/productsByKeys', async (req,res)=>{
    const productKeys=req.body;
    try{
        var result=await productList.find({key:{$in: productKeys}})
        res.send(result);
    }catch(err){
        res.send({"message":err})
    }
  })



  //get all product
  router.get('/allOrders', async (req, res, next) => {
    try{
        const existed=await orderList.find();
        res.status(200).json(existed)
    }catch(err){
        res.status(202).json({message:err})
    }
    
})


// get individual order
router.get('/orderProducts', async (req, res, next) => {
    const {mail}=req.body;
    try{
        const existed=await orderList.find({mail:mail});
        res.status(200).json(existed)
    }catch(err){
        res.status(202).json({message:err})
    }
    
})


//adding single products by admin
  router.post('/addProducts',middleware,async (req, res, next) => {
    console.log(req.body);
    var {category,img,key,name,price,seller,stock}=   req.body;
    if(!category  || !img || !key || !name|| !price || !seller ||  !stock){
        res.status(400).json({error:"Please fill up the form correctly"});
      }else{
        const similar=await productList.find({key:key})
        console.log(similar.length)
        if(similar.length>0){
            res.status(201).json({error:"similar product is been saved"})
        }else{
            try{
                const product = new productList({category,img,key,name,price,seller,stock});
                console.log(product._id);
                const response= await product.save();
                res.status(200).send(response);
            }catch(err){
                res.status(400).send(err);
            }
        } 
      }
  })


//post chunk of data
router.post('/chunkProducts', async (req,res)=>{
    console.log("entered");
    try{
        var tempArray=[];
        req.body.map(iterator=>{
            const datas=new productList({
                category:iterator.category,
                img:iterator.img,
                key:iterator.key,
                name:iterator.name,
                price:iterator.price,
                seller:iterator.seller,
                stock:iterator.stock
            })
            tempArray.push(datas);
        })
        console.log("entered before");
        const result= await productList.insertMany(tempArray);
        console.log("entered after");
        res.send({"message":"Ok"});
    }catch(err){
        res.status(400).send({"message":err})
    }
})


// delete all product from the product list
router.delete('/deleteAllProducts', async (req,res)=>{
    try{
        var result= await productList.deleteMany({});
        res.send(result)
    }catch(err){
        res.status(200).send({'message':err})
    }
})




// delete one order
router.delete('/deleteOrder', async (req,res)=>{
    console.log(req.body.id);
    try{
        var result= await orderList.findByIdAndDelete({_id:req.body.id});
        res.send(result)
    }catch(err){
        res.status(200).send({'message':err})
    }
    // res.status(302).json({"Message":"Found"})
})



// get individual order
router.get('/detailOrder/:id', async (req,res)=>{
    console.log(req.params);
    console.log(req.body.id);
    try{
         var result= await orderList.findById({_id:req.params.id});
         res.send(result)
     }catch(err){
         res.status(200).send({'message':err})
     }
    
})


// get individual order by email for user/customer
router.get('/order/:email', async (req,res)=>{
    console.log(req.params);
    // console.log(req.body.id);
    const mail=req.params.email;
    console.log(mail);
    try{
         var result= await orderList.find({mail:mail});
         res.send(result)
     }catch(err){
         res.status(200).send({'message':err})
     }
    
})

 


// post order products by user / client
router.post('/orderProducts', async (req, res) => {
    var time= getTimes();
    console.log(time)
    var {name,business,flat,house,road,city,phone,card,mail,savedCart}=req.body;
    if(!name || !business || !flat || !house || !road || !city || !phone || !card || !mail || !savedCart || !time){
        console.log("err one")
        res.status(400).json({error:"Please fill up the form correctly"});
    }else{
        try{
            const order = new orderList({name,business,flat,house,road,city,phone,card,mail,savedCart,time});
            const response=await order.save();
            res.status(200).send(response);
        }catch(err){
            res.status(400).send(err);
        }   
    }
  })




module.exports=router;