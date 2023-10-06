const controllers = require('./controllers.js')
const router = require('express').Router()
const multer  = require('multer')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,"./public/images")
    },filename:function(req,file,cb){
        return cb(null,file.originalname)
    }
})
const upload = multer({storage})
module.exports = () => {
   router.get('/', controllers.allProducts)
   router.get('/types', controllers.getProduct)
   router.get('/avaoptions', controllers.createProduct)
   router.get('/variants/:productid', controllers.createProduct)
   router.get('/:id', controllers.createProduct)
   router.post('/',upload.single("image"), controllers.createProduct)
}