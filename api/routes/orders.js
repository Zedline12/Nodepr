const express=require('express');
const router=express.Router()
const db=require('../mysql/db')
const cors=require('cors')
const date=require('date-and-time')

router.use(cors({

    origin:"*"
}))
router.get("/lasttime/:supplierid/:date",(req,res)=>{
    let sql="call lasttime_orders(?,?)"
    db.query(sql,[req.params.supplierid,req.params.date],(err,result)=>{
        if(err)throw err;
        res.send(result[0])
    })
})
router.get("/:customerid",(req,res)=>{
    let sql="call get_orders(?)"
    db.query(sql,req.params.customerid,(err,result)=>{
        if(err)throw err;
        res.send(result[0])
    })
})
router.post("/saveorder",(req,res)=>{

    let sql='INSERT INTO orders Set ?'
    //req.body not json
    const now=new Date();
   const dateval=date.format(now,' YYYY-MM-DD ')
   req.body.orderdate=dateval
   now.setDate(now.getDate()+2)
   const reqdate=date.format(now,' YYYY-MM-DD ')
   req.body.requireddate=reqdate
    let query=db.query(sql,req.body,(err,result)=>{
        console.log("saveorder")
        if(err)throw err;
        res.send(result.insertId.toString())
    })
})
router.post("/saveorderdetails",(req,res)=>{
    console.log("saveorderdetail")
    let sql='INSERT INTO orderdetails Set ?'
    //req.body not json
    let query=db.query(sql,req.body,(err,result)=>{
        if(err)throw err;
        res.status(200)
    })
})
module.exports=router