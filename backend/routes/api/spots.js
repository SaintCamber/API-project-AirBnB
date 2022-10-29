const express = require("express");
const sequelize = require("sequelize");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, Review, SpotImage, ReviewImage, Booking } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { appendFile } = require("fs");
const { argv } = require("process");
// ...
const router = express.Router();

// const validateNewSpot = [
//   check("address").exists({ checkFalsy: true }).isLength({min:3,max:20}).withMessage('please add a valid address'),
//   check("city").exists({ checkFalsy: true }).isLength({min:3,max:20}).withMessage("please add a valid city"),
//   check("state").exists({ checkFalsy: true }).isLength({min:3,max:20}).withMessage("please add a valid state"),
//   check("country").exists({ checkFalsy: true }).isLength({min:3,max:20}).withMessage("please add a valid country"),
//   check("lat").exists({ checkFalsy: true }).isNumeric({min:-180,max:180}).withMessage("please add a valid lat "),
//   check("lng").exists({ checkFalsy: true }).isNumeric({min:-180,max:180}).withMessage("please add a valid lng"),
//   check("name").exists({ checkFalsy: true }).isLength({min:3,max:20}).withMessage("please add a valid name"),
//   check("description").exists({ checkFalsy: true }).isLength({min:3,max:500}).withMessage("please add a valid description"),
//   check("price").exists({ checkFalsy: true }).isNumeric().withMessage("please add a valid price"),
//   // handleValidationErrors
// ]

router.get("/", requireAuth, async (req, res, next) => {
  payLoad = [];
  let allSpots = await Spot.findAll();
  console.log(allSpots);
  if (allSpots)
    for (let spot of allSpots) {
      spotAvgReviews = await Review.findAll({
        where: { spotId: spot.id },
        attributes: [
          [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"],
        ],
      });
      previews = await SpotImage.findAll({
        where: { spotId: spot.id, preview: true },
        attributes: ["url"],
      });
      console.log(previews);

      spotData = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        name: spot.name,
        description: spot.description,
        price: spot.price,
      };
      if (spotAvgReviews.length) {
        spotData.AvgRating = spotAvgReviews[0].toJSON().avgRating;
      }

      if (previews.length) {
        spotData.previewImage = previews[0].url;
      }

      // console.log(spotAvgReviews[0].toJSON().avgRating);
      payLoad.push(spotData);
    }
  res.json({ Spots: payLoad });
});

router.post("/", requireAuth, async (req, res, next) => {
  console.log(Object.entries(req.body));

  let newSpot = await Spot.create({
    ownerId: req.user.id,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    lat: req.body.lat,
    lng: req.body.lng,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  });
  // validateNewSpot
  newSpot.save();
  let payLoaf = {
    id: newSpot.id,
    address: newSpot.address,
    city: newSpot.city,
    state: newSpot.state,
    country: newSpot.country,
    lat: newSpot.lat,
    lng: newSpot.lng,
    name: newSpot.name,
    description: newSpot.description,
    price: newSpot.price,
    createdAt: newSpot.createdAt,
    updatedAt: newSpot.updatedAt,
  };
  res.status(201);
  res.json(payLoaf);
});
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    res.status(404);
    let payLoaf = {
      message: "Spot couldn't be found",
      statusCode: 404,
    };
    res.json(payLoaf);
  }

  let newImage = await SpotImage.create({
    spotId: req.params.spotId,
    url: req.body.url,
    preview: req.body.preview,
  });

  const payLoaf = {
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  };

  res.json(payLoaf);
});

router.get("/current", requireAuth, async (req, res, next) => {
  let payLoaf = [];
  let user = req.user;
  currentUserSpots = await Spot.findAll({ where: { ownerId: user.id } });
  if (currentUserSpots)
    for (let spot of currentUserSpots) {
      spotAvgReviews = await Review.findAll({
        where: { spotId: spot.id },
        attributes: [
          [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"],
        ],
      });
      previews = await SpotImage.findAll({
        where: { spotId: spot.id, preview: true },
        attributes: ["url"],
      });

      spotData = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        name: spot.name,
        description: spot.description,
        price: spot.price,
      };
      if (spotAvgReviews.length) {
        spotData.AvgRating = spotAvgReviews[0].toJSON().avgRating;
      }

      if (previews.length) {
        spotData.previewImage = previews[0].url;
      }

      payLoaf.push(spotData);
    }
  res.json({ Spots: payLoaf });
});

router.get("/:spotId", requireAuth, async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId);
  let payLoaf = [];
  if (!spot) {
    res.status(404);
    let payLoaf = {
      message: "Spot couldn't be found",
      statusCode: 404,
    };
    res.json(payLoaf);
  }
  spotAvgReviews = await Review.findAll({
    where: { spotId: spot.id },
    attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
  });
  previews = await SpotImage.findAll({
    where: { spotId: spot.id },
    attributes: ["id", "url", "preview"],
  });

  spotData = {
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    name: spot.name,
    description: spot.description,
    price: spot.price,
  };
  if (spotAvgReviews.length) {
    spotData.AvgRating = spotAvgReviews[0].toJSON().avgRating;
  }

  if (previews.length) {
    spotData.spotImages = previews;
  }

  payLoaf.push(spotData);
  res.json({ Spots: payLoaf });
});

router.put("/:spotId", requireAuth, async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.json({ message: "spot not found", statusCode: 404 });
  }
  //  if(spot.ownerId === req.user.id){
  if (req.body.address) {
    spot.address = req.body.address;
  }
  if (req.body.city) {
    spot.city = req.body.city;
  }
  if (req.body.state) {
    spot.state = req.body.state;
  }
  if (req.body.country) {
    spot.country = req.body.country;
  }
  if (req.body.lat) {
    spot.lat = req.body.lat;
  }
  if (req.body.lng) {
    spot.lng = req.body.lng;
  }
  if (req.body.createdAt) {
    spot.createdAt = req.body.createdAt;
  }
  if (req.body.updatedAt) {
    spot.updatedAt = req.body.updatedAt;
  }
  if (req.body.name) {
    spot.name = req.body.name;
  }
  if (req.body.description) {
    spot.description = req.body.description;
  }
  if (req.body.price) {
    spot.price = req.body.price;
  }
  // }

  spot.save();
  res.json(spot);
});

router.post(
  "/:spotId/reviews",
  requireAuth,
  handleValidationErrors,
  async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId);
    let spotPreviousReviews = await Review.findAll({
      where: { spotId: req.params.spotId },
    });
    console.log(spotPreviousReviews);
    for (let review of spotPreviousReviews) {
      if (review.userId === req.user.id) {
        res.json({
          message: "User already has a review for this spot",
          statusCode: 403,
        });
      }
    }

    if (!spot) {
      res.json({ message: "spot couldn't be found", statusCode: 404 });
    }
    // create a review on the entry with spot id of spotId.
    let newReview = await Review.create({
      spotId: req.params.spotId,
      userId: req.user.id,
      review:
        "lorem ipsum blah blah blah comment goes here blah diddy blah diddy blah",
      stars: 5,
    });
    newReview.save();
    res.json(newReview);
  }
);

router.get("/:spotId/reviews", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    res.status(404);
    let payLoaf = {
      message: "Spot couldn't be found",
      statusCode: 404,
    };
    res.json(payLoaf);
  }

  let reviews = await Review.findAll({
    where: { spotId: spot.id, }, include: { model: ReviewImage }
  });

  res.json(reviews);
});


router.post('/:spotIdForBooking/bookings', requireAuth, async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotIdForBooking)
  if (!spot) {
    res.json({ message: 'spot not found', statusCode: 404 })
  }
  if (spot.ownerId === req.user.id) {
    res.json({ message: "you can't book your own spot" })
  }
  let available = true
  let bookings = await Booking.findAll({ where: { spotId: spot.id } })
  for (let i = 0; i < bookings.length; i++) {

    let booking = bookings[i]
    let bookingStart = new Date(booking.startDate)
    let bookingEnd = new Date(booking.endDate)
    let reqStart = new Date(req.body.startDate)
    let reqEnd = new Date(req.body.endDate)
    let errors = {}

    if (reqStart >= bookingStart && reqStart <= bookingEnd) {
      available = false
      errors.startDate = "Start date conflicts with an existing booking"
    }
if (reqEnd >= bookingStart && reqEnd <= bookingEnd) {
  available = false
  errors.endDate = "end date conflicts with an existing booking"

}
if (available === false) {
  return res.json({ message: "Sorry, this spot is already booked for the specified dates", statusCode: 403, "errors": errors })
}
  }

let newBooking = await Booking.create({
  spotId: req.params.spotIdForBooking,
  userId: req.user.id,
  startDate: new Date(req.body.startDate),
  endDate: new Date(req.body.endDate)
})


newBooking.save()
res.json(newBooking)
  
  })

  router.get('/:spotIdForBooking/bookings', requireAuth, async (req, res, next) => {
    let Allbookings = await Booking.findAll({where:{spotId:req.params.spotIdForBooking}})
    if(!Allbookings.length){
      res.json({message:'no current bookings found'})
    }
    let payLoaf = []

    for (let booking of Allbookings){
      let Data = {spotId:booking.spotId,startDate:booking.startDate,endDate:booking.endDate}
      payLoaf.push(Data)
    }
    res.json({Bookings:payLoaf})
  })
 
  
module.exports = router;
