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


router.put("/:BookingId",requireAuth,async (req,res,next)=>{
    let bookingToEdit = await Booking.findAll({where:{id:req.params.BookingId},include:{model:User}})
    let payLoaf = []
    if(!bookingToEdit.length){
        res.json({message:"no booking found with that id",statusCode:404})
    }
    bookingToEdit.startDate = req.body.startDate
    bookingToEdit.endDate = req.body.endDate
    
    
    if(req.user.id===bookingToEdit.ownerId){
        res.json(bookingToEdit)
    }
    payLoaf.push({id: bookingToEdit.id,
                startDate: bookingToEdit.startDate,
                endDate:bookingToEdit.endDate})

    res.json({Bookings:payLoaf})

})
module.exports = router;