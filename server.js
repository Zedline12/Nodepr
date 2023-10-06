
const express=require('express')
const app=express()
const productRoutes=require('./api/routes/products')
const customerRoutes=require('./api/routes/customers')
const suppliersRoutes=require('./api/routes/suppliers')
const categoriesRouters=require('./api/routes/categories')
const ordersRouters=require('./api/routes/orders')
const cartRouters=require('./api/routes/cart')
const bodyParser=require('body-parser')
const db=require('./api/mysql/db')
//
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers","*")
    next()
})
app.use('/images', express.static('./public/images'));
const cors=require('cors')
app.use(cors({
    origin:"*"
}))
//
app.get('/',(req,res)=>{
    db.query("select * from product_category",(error,result)=>{
        if(error)throw error;
        res.send(result)
    })
})
app.use('/products',productRoutes)
app.use('/customers',customerRoutes)
app.use('/suppliers',suppliersRoutes)
app.use('/categories',categoriesRouters)
app.use('/cart',cartRouters)
app.use('/orders',ordersRouters)
app.listen(3000, '0.0.0.0',function(){
    
});

module.exports=app