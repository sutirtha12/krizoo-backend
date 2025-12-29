const express=require("express")
const router=express.Router()
const {newcart,deletecart,updatecart,fetchcart}=require('../controllers/cart-controllers')
const authmiddleware=require("../middlewares/authmiddleware")

router.post('/newcart', authmiddleware, newcart);
router.get('/fetch', authmiddleware, fetchcart);
router.put('/update', authmiddleware, updatecart);
router.delete('/delete/:itemId', authmiddleware, deletecart);


module.exports=router