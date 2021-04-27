const express = require('express');
const router=express.Router();
const {middleware}=require('../middleware/middleware');
const orderList =require('../schema/order');
const productList=require('../schema/product');


// get all products
router.get('/', async (req, res, next) => {
    try{
        const allData= await productList.find();
        res.status(200).json(allData)
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
        const result= await productList.insertMany(tempArray);
        res.status(200).send(result);
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

 


// order products by user / client
router.post('/orderProducts', async (req, res) => {
    var {name,business,flat,house,road,city,phone,card,mail,savedCart}=req.body;
    if(!name || !business || !flat || !house || !road || !city || !phone || !card || !mail || !savedCart){
        console.log("err one")
        res.status(400).json({error:"Please fill up the form correctly"});
    }else{
        const existed=await orderList.find({mail:mail});
        if(existed[0]){
            var id=existed[0]._id;
            var temp=[...existed[0].savedCart,...savedCart]
            
            try{
                const data= await orderList.findByIdAndUpdate({_id:id},{
                    $set:{
                        savedCart: temp
                    }
                },{
                    new:true,
                    useFindAndModify:false
                });
                console.log(data);
                res.json(temp);
            }catch(err){
                console.log(err);
            }
        }else{
            try{
                
                const order = new orderList({name,business,flat,house,road,city,phone,card,mail,savedCart});
                const response=await order.save();
                res.status(200).send(response);
            }catch(err){
                res.status(400).send(err);
            }
        }   
    }
  })




module.exports=router;