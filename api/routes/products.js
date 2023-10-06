const express=require('express');
const router=express.Router()
const db=require('../mysql/db')
const cors=require('cors')
const date=require('date-and-time')
const multer  = require('multer')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,"./public/images")
    },filename:function(req,file,cb){
        return cb(null,file.originalname)
    }
})
const upload = multer({storage})
router.use(cors({
    origin:"*"
}))
router.use(function(req, res, next) {

    next();
});
router.get('/',(req,res)=>{
    db.query("select * from products",(error,result)=>{
        if(error)throw error;
        res.status(200).send(result)
    })
})
router.delete('/:id',(req,res)=>{
    db.query("SET FOREIGN_KEY_CHECKS=0;",(error,result)=>{
        if(error)throw error
    })
    db.query("delete from products where id='"+req.params.id+"'",(error,result)=>{
        if(error) throw error;
        res.sendStatus(200)
    })
})
router.get('/types',(req,res)=>{
    db.query("select * from producttypes",(error,result)=>{
        if(error)throw error;
        res.status(200).send(result)
    })
})
router.get('/avaoptions',(req,res)=>{
    db.query("select * from product_creation_options",(error,result)=>{
        if(error)throw error;
        res.status(200).send(result)
    })
})
router.get("/test/:pid",(req,res)=>{
    
    db.query("select * from productphone where productid='"+req.params.pid+"'",(error,result)=>{
        if(error)throw error;
        res.status(200).send(result.filter(x=>{return x!==null || undefined;}))
    })
})
router.get('/variants/:productid',(req,res)=>{
    var query="call get_variants(?)"
    var data=db.query(query,req.params.productid,(error,result)=>{
        if(error) throw error;
        res.send(result[0])
    })
})

router.get('/:id',(req,res)=>{
   var data= db.query("select * from products where id='"+req.params.id+"'",(error,result)=>{
    if (error) throw error;
    res.send(result[0])
   })
})
router.post('/',upload.single("image"),(req,res)=>{
   var host=req.protocol + "://" +req.get("host")
   var image=host+"/images/"+req.file.originalname
   var product=req.body
   product.image=image
   const now=new Date();
   const dateval=date.format(now,' YYYY-MM-DD ')
   product.created_at=dateval
   product.colors=JSON.parse(product.colors)
   product.memorystorages=JSON.parse(product.memorystorages)
   product.screensizes=JSON.parse(product.screensizes)
   //productphone only
    console.log(product.memorystorages[0])

   //inventory
   let inventory={quantity:product.quantity,created_at:dateval}
   let queryy=db.query("insert into product_inventory set ?",inventory,(err,result)=>{
    if(err)throw err
   
         //table products only
   var finalproduct={}
   finalproduct._name=product._name
   finalproduct._desc=product._desc
   finalproduct.producttype=product.producttype
   finalproduct.image=product.image
   finalproduct.category_id=product.category_id
   finalproduct.supplierid=product.supplierid
   finalproduct.inventory_id=product.inventory_id
   finalproduct.price=product.price
   finalproduct.discount_id=product.discount_id
   finalproduct.created_at=product.created_at
   finalproduct.inventory_id=result.insertId
   let query=db.query("insert into products set ?",finalproduct,(err,result)=>{
    if(err)throw err;
    //productphone table
    
    //
    // add multiple rows for options
    if(product.colors.length>product.memorystorages.length &&product.screensizes.length){
        for(let i=0;i<=product.colors.length-1;i++){
            var productphone={}
    productphone.productid=result.insertId
    productphone.brandname=product.brandname
    productphone.opersystem=product.opersystem
    productphone.memorystorage=product.memorystorages[i]
    productphone.color=product.colors[i]
    productphone.screensize=product.screensizes[i]


            let queryy=db.query("insert into productphone set ?",productphone,(err,result)=>{
                if(err)throw err
                
                })
        }
      }
      else if(product.memorystorages.length>product.colors.length && product.screensizes.length){
        for(let i=0;i<=product.memorystorages.length-1;i++){
            // assign for every option
            var productphone={}
    productphone.productid=result.insertId
    productphone.brandname=product.brandname
    productphone.opersystem=product.opersystem
    productphone.memorystorage=product.memorystorages[i]
    productphone.color=product.colors[i]
    productphone.screensize=product.screensizes[i]
//
              //query
             let queryy=db.query("insert into productphone set ?",productphone,(err,result)=>{
                if(err)throw err
                
                })
                //
        }
      }  
     else if(product.screensizes.length>product.memorystorages.length &&product.colors.length){
        for(let i=0;i<=product.screensizes.length-1;i++){
                  // assign for every option
                  var productphone={}
                  productphone.productid=result.insertId
                  productphone.brandname=product.brandname
                  productphone.opersystem=product.opersystem
                  productphone.memorystorage=product.memorystorages[i]
                  productphone.color=product.colors[i]
                  productphone.screensize=product.screensizes[i]
              //
            let queryy=db.query("insert into productphone set ?",productphone,(err,result)=>{
                if(err)throw err
                
                })
        }
      }
      else{
        for(let i=0;i<=product.colors.length-1;i++){
            var productphone={}
    productphone.productid=result.insertId
    productphone.brandname=product.brandname
    productphone.opersystem=product.opersystem
    productphone.memorystorage=product.memorystorages[i]
    productphone.color=product.colors[i]
    productphone.screensize=product.screensizes[i]


            let queryy=db.query("insert into productphone set ?",productphone,(err,result)=>{
                if(err)throw err
               
                })
        }
      }
     
    res.send("Done")
})
    
    })

   //
  
   
}

)
module.exports=router
