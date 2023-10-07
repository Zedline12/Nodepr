const express=require('express');
const router=express.Router()
const db=require('../mysql/db')
const db2=require('../mysql/db2')
const cors=require('cors')
const date=require('date-and-time')
router.use(cors({
    origin:"*"
}))

router.get('/:table',(req,res)=>{
    let sql=`select * from ${req.params.table} `
    //req.body not json
    
    let query=db.query(sql,(err,result)=>{
        if(err)throw err;
        var objects=result
        objects.forEach(element => {
            db2.query('SET foreign_key_checks = 0')
           db2.query(`insert into ${req.params.table} set ?`,element,(err,result)=>{
            if(err) throw err
            console.log(result.insertId)
           })
        });
        res.send(result)
    })
})

router.get('/cart_items/:sessionid',(req,res)=>{
    let sql="select * from cart_item where session_id='"+req.params.sessionid+"'"
    //req.body not json
    
    let query=db.query(sql,(err,result)=>{
        if(err)throw err;
        res.send(result)
    })
})
router.get("/removecartitem/:cartid",(req,res)=>{
    let sql="delete from cart_item where id='"+req.params.cartid+"'"
    db.query(sql,(err,result)=>{
        if(err)throw err
        res.sendStatus(200)
    })
})
router.post('/create_session',(req,res)=>{
    db.query(`select * from cart_session where user_id=${req.body.user_id}`,(err,resu)=>{
        let cart_session=resu[0]
        if(err) throw err
        if(cart_session==undefined){
            console.log("Not Found")
            const now=new Date();
    const datetime=date.format(now,'YYYY-MM-DD hh:mm:ss')
    req.body.created_at=datetime
    let sql='INSERT INTO cart_session Set ?'
   
    let query=db.query(sql,req.body,(err,result)=>{
        if(err)throw err;
        console.log(result.insertId.toString())
        res.send(result.insertId.toString())
    })
        }
        else{
            console.log("Found")
            console.log(cart_session.id)
            res.send(cart_session.id.toString())
        }
    })
  
})
router.post('/create_cart_item',(req,res)=>{
    const now=new Date();
    const datetime=date.format(now,'YYYY-MM-DD hh:mm:ss')
    req.body.created_at=datetime
    let sql='INSERT INTO cart_item Set ?'
    //req.body not json
    
    let query=db.query(sql,req.body,(err,result)=>{
        if(err)throw err;
        res.sendStatus(200)
    })
  
})
module.exports=router