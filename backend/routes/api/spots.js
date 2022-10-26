const express = require('express');
const sequelize = require('sequelize')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot ,Review} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...
const router = express.Router();


router.get('/',requireAuth, async (req,res)=>{
    let allSpots = await Spot.findAll({
        include:{model:Review},
        attributes: {
          include: [
            [sequelize.fn('AVG', sequelize.col('stars')), 'AvgRating']
          ]
        }
      });

      res.json(allSpots)
})

module.exports = router;