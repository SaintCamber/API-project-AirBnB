const router = require('express').Router()
const {Spot} = require('../../db/models')

const { setTokenCookie, restoreUser,requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// const validateLogin = [
//     check('credential')
//       .exists({ checkFalsy: true })
//       .notEmpty()
//       .withMessage('Please login to continue.'),
    
//     handleValidationErrors
//   ];
router.use(requireAuth)
router.get('/',async(req,res,next)=>{
    
    // validateLogin;
    let allSpots = await Spot.findAll({})
    return res.json(allSpots)
})


module.exports = router;
