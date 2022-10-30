const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {ReviewImage} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...
const router = express.Router();



router.delete('/:reviewId',requireAuth,async (req,res)=>{
    let reviewToDelete = await ReviewImage.findByPk(req.params.reviewId)
    if(!reviewToDelete){
        res.json({message:"image not found"})
    }
    reviewToDelete.destroy()
    res.json({message:"record deleted"})
})
module.exports = router