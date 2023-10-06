const express=require('express');
const router=express.Router()
const db=require('../mysql/db')
const cors=require('cors')
const nodemailer = require("nodemailer");
const uuid = require('uuid');
router.use(cors({
    origin:"*"
}))
router.use(function(req, res, next) {

    next();
});
router.get('/isvalid/:id',(req,res)=>{
    db.query(`select isvalid from customers where customerid=${req.params.id}`,(error,result)=>{
        if(error)throw error
        if(result[0]==undefined){
            res.send("User Not Registerd")
        }
        else{
            res.send(result[0].isvalid.toString())
        }
    })
})
router.get('/confirm/:uniquestring',(req,res)=>{
    db.query(`update customers set isvalid=true where uniquestring='${req.params.uniquestring}'`,(error,result)=>{
        if(error)throw error;
        if(result.affectedRows==1){
            const url =req.protocol+"://"+req.host+":4200";
            res.redirect(url);
        }
        else{
            res.send("401").send(result)
        }
       
    })
}) 
router.get('/',(req,res)=>{
    db.query("select * from customers",(error,result)=>{
        if(error)throw error;
        res.status(200).send(result)
    })
})
router.get('/check',(req,res)=>{
    db.query("select * from customers WHERE email="+db.escape(req.query.email)+" and pass="+db.escape(req.query.pass),(error,result)=>{
        
     if(result[0]==undefined || null){
        res.status(401).send("not found")
     }
     else{
        res.status(202).send(result[0].customerid.toString())
     }
    })
})
router.post('/saveaddress',(req,res)=>{
    let sql='INSERT INTO customer_address Set ?'
    //req.body not json
    let query=db.query(sql,req.body,(err,result)=>{
        if(err)throw err;
        res.send(result.insertId.toString())
    })
})
router.get("/address/:customerid",(req,res)=>{
    db.query("select * from customer_address WHERE customerid="+db.escape(req.params.customerid),(error,result)=>{
        if(result[0]==undefined || null){
           res.status(401).send("not found")
        }
        else{
           res.status(202).send(result[0])
        }
       })
})
router.get('/:id',(req,res)=>{
   db.query("select * from customers where customerid='"+req.params.id+"'",(error,result)=>{
    if(error)throw error
    res.send(result)
   })
})
router.get('/homepage/:customerid',(req,res)=>{
    var query="call homepage_customer(?)"
    var data=db.query(query,req.params.customerid,(error,result)=>{
        if(error) throw error;
        res.send(result[0][0])
    })
 })
router.post('/',async (req,res,next)=>{
    let sql='INSERT INTO customers Set ?'
    console.log("here")
    //req.body not json
    req.body.isvalid=false
    req.body.uniquestring=uuid.v1()
    var host=req.protocol + "://" +req.get("host")
   var url=`${host}/customers/confirm/${req.body.uniquestring}`
   console.log(url)
    try{
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
            port: 465, // Port for SMTP (usually 465)
            secure: true, // Usually true if connecting to port 465
            auth: {
              user: "bedomohamed307@gmail.com", // Your email address
              pass: "nxqryhbguflzlxkx", // Password (for gmail, your app password)
              // ⚠️ For better security, use environment variables set on the server for these values when deploying
            },
          });
          
          // Define and send message inside transporter.sendEmail() and await info about send from promise:
          const html=""
          let info = transporter.sendMail({
            from: 'bedomohamed307@gmail.com',
            to:req.body.email,
            subject: "Testing, testing, 123",
            html: `
            <html>
<head><meta charset="utf-8"><meta http-equiv="x-ua-compatible" content="ie=edge"><title>Email Confirmation</title><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css">@media screen {@font-face {font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    }
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 700;
      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    }
  }
  /**
   * Avoid browser level font resizing.
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
  body,
  table,
  td,
  a {
    -ms-text-size-adjust: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }
  /**
   * Remove extra space added to tables and cells in Outlook.
   */
  table,
  td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }
  /**
   * Better fluid images in Internet Explorer.
   */
  img {
    -ms-interpolation-mode: bicubic;
  }
  /**
   * Remove blue links for iOS devices.
   */
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }
  /**
   * Fix centering issues in Android 4.4.
   */
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }
  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  /**
   * Collapse table borders to avoid space between cells.
   */
  table {
    border-collapse: collapse !important;
  }
  a {
    color: #1a82e2;
  }
  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  </style>

</head>
<body style="background-color: #e9ecef;">

  <!-- start preheader -->
  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <a href="https://www.blogdesire.com" target="_blank" style="display: inline-block;">
                <img src="https://www.blogdesire.com/wp-content/uploads/2019/07/blogdesire-1.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
              </a>
            </td>
          </tr>
          <tr>
          <td align="center" valign="top" style="padding: 36px 24px;">
             <h1>Hello ${req.body.firstname}</h1>
            </a>
          </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href="https://blogdesire.com">Paste</a>, you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                          <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Confirm</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end button -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
              <p style="margin: 0;"><a href="https://blogdesire.com" target="_blank">https://blogdesire.com/xxx-xxx-xxxx</a></p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
              <p style="margin: 0;">Cheers,<br> Paste</p>
            </td>
          </tr>
          <!-- end copy -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end copy block -->

    <!-- start footer -->
    <tr>
      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start permission -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
              <p style="margin: 0;">You received this email because we received a request for [type_of_action] for your account. If you didn't request [type_of_action] you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end permission -->

          <!-- start unsubscribe -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
              <p style="margin: 0;">To stop receiving these emails, you can <a href="https://www.blogdesire.com" target="_blank">unsubscribe</a> at any time.</p>
              <p style="margin: 0;">Paste 1234 S. Broadway St. City, State 12345</p>
            </td>
          </tr>
          <!-- end unsubscribe -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end footer -->

  </table>
  <!-- end body -->

</body>
</html>
            `,
          });
           console.log(await info)
    }
   catch(err){
    console.log(err)
   }

   
    let query=db.query(sql,req.body,(err,result)=>{
        if(err)throw err;
       console.log("done")
        res.send(result.insertId.toString())
    })
})

router.post('/buy',(req,res)=>{

})
module.exports=router
