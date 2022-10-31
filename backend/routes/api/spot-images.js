const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {SpotImage} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...
const router = express.Router();



router.delete('/:spotImageId',requireAuth,async (req,res)=>{
    let spotImageToDelete = await SpotImage.findByPk(req.params.spotImageId)
    if(!spotImageToDelete){
        res.json({message:"image not found",statusCode:404})
    }
    spotImageToDelete.destroy()
    res.json({message:"record deleted",statusCode:200})
})
module.exports = router