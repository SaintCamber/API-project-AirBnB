const express = require("express");
const sequelize = require("sequelize");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, Review, ReviewImage, User ,Booking} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { appendFile } = require("fs");
const { argv } = require("process");
const { restoreUser } = require("../../utils/auth.js");

// ...
const router = express.Router();


router.get('/current',requireAuth,async (req,res,next)=>{
    const bookings = await Booking.findAll({where:{userId:req.user.id},include:{model:Spot}})
    if(!bookings.length){
        res.json({message:`couldn't find any current bookings`,statusCode:404})
    }
    res.json(bookings)
})


router.put("/:bookingId",requireAuth,async (req,res,next)=>{
    console.log(req.params.bookingId)
    let bookingToEdit = await Booking.findAll({where:{id:req.params.bookingId},include:{model:User}})
    let payLoaf = []
    if(!bookingToEdit.length){
        res.json({message:"no booking found with that id",statusCode:404})
    }
   console.log(bookingToEdit)
    
    
    if(req.user.id===bookingToEdit.ownerId){ 
        bookingToEdit.startDate = new Date(req.body.startDate)
        bookingToEdit.endDate = (req.body.endDate)
        res.json(bookingToEdit)
    }
    
else{
    res.json({id:bookingToEdit.id,
                startDate:bookingToEdit.startDate,
                endDate:bookingToEdit.endDate})

}

})

router.delete('/:bookingId',requireAuth,async (req,res)=>{
    let bookingToDelete = await Booking.findByPk(req.params.bookingId)
    if(!bookingToDelete){
        res.json({message:"image not found"})
    }
    bookingToDelete.destroy()
    res.json({message:"record deleted"})
})
module.exports = router;
module.exports = router;