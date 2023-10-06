const express=require('express')
const router=express.Router()
const db=require('../mysql/db')
const cors=require('cors')
router.use(cors({
    origin:"*"
}))
router.get('/',(req,res)=>{
    db.query("select * from product_category",(error,result)=>{
        if(error)throw error;
        res.status(200).send(result)
    })
})
module.exports=router