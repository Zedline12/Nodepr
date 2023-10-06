const express=require('express');
const router=express.Router()
const db=require('../mysql/db')
const cors=require('cors')
router.use(cors({
    origin:"*"
}))

router.get('/',(req,res)=>{
    var query="call adminstatus()"
    var data=db.query(query,(error,result)=>{
        if(error) throw error;
        res.send(result[0])
    })
})
router.get('/admindash_numbers/:supplierid',(req,res)=>{
    var query="call admindash_numbers(?)"
    var data=db.query(query,req.params.supplierid,(error,result)=>{
        if(error) throw error;
        res.send(result[0][0])
    })
 })
 router.get('/editpnumbers/:supplierid/:category',(req,res)=>{
    var query="call editpnumbers(?,?)"
   
    var data=db.query(query,[req.params.supplierid,req.params.category=='null'?null:req.params.category],(error,result)=>{
        if(error) throw error;
       res.send(result[0][0])
    })
 })
 router.get('/editproducts/:supplierid/:category',(req,res)=>{
    var query="call editproducts(?,?)"
   
    var data=db.query(query,[req.params.supplierid,req.params.category=='null'?null:req.params.category],(error,result)=>{
        if(error) throw error;
       res.send(result[0])
    })
 })
router.get("/check",(req,res)=>{
    db.query("select * from suppliers WHERE email="+db.escape(req.query.email)+" and pass="+db.escape(req.query.pass),(error,result)=>{
        if(result[0]==undefined || null){
            res.sendStatus(401)
        }
        else{
            res.status(202).send(result[0].supplierid.toString())
        }
    })
})
router.get("/name/:supplierid",(req,res)=>{
    db.query("select companyname from suppliers where supplierid="+req.params.supplierid,(error,result)=>{
        if(result[0]==undefined || null){
            res.sendStatus(401)
        }
        else{
            res.status(202).send(result[0]["companyname"])
        }
    })
})
module.exports=router