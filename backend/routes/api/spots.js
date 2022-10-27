const express = require("express");
const sequelize = require("sequelize");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, Review, SpotImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { appendFile } = require("fs");
const { argv } = require("process");
// ...
const router = express.Router();
validateNewSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("please give a valid address"),
  check("city").exists().isString().withMessage("city name invalid"),
];

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

router.post("/", requireAuth, validateNewSpot, async (req, res, next) => {
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
  newSpot.save();
  let payLoaf = {
    address: newSpot.address,
    city: newSpot.city,
    state: newSpot.state,
    country: newSpot.country,
    lat: newSpot.lat,
    lng: newSpot.lng,
    name: newSpot.name,
    description: newSpot.description,
    price: newSpot.price,
  };
  res.status(201);
  res.json(payLoaf);
});
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.errors = ["Spot couldn't be found"];
    return next(err);
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
  let payLoaf = []
  let user = req.user
  currentUserSpots = await Spot.findAll({ where: { ownerId: user.id } })
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

router.get('/:spotId', requireAuth, async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId)
  let payLoaf = []
  if (!spot) {
    res.status(404)
    let payLoaf = {
      message: "Spot couldn't be found",
      statusCode: 404
    }
    res.json(payLoaf)
  }
  spotAvgReviews = await Review.findAll({
    where: { spotId: spot.id },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"],
    ],
  });
  previews = await SpotImage.findAll({
    where: { spotId: spot.id },
    attributes: ["id", "url", "preview"]
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
    spotData.spotImages = previews
  }

  payLoaf.push(spotData);
  res.json({ Spots: payLoaf })
}
);



router.put('/:spotId', requireAuth, handleValidationErrors,async (req, res, next) => {
 let spot = await Spot.findByPk(req.params.spotId)
 if(!spot){
  res.json({message:"spot not found",statusCode: 404})
 }
 if(spot.ownerId === req.user.id){
  if (req.body.address) { spot.address = req.body.address }
if (req.body.city) { spot.city = req.body.city }
if (req.body.state) {spot.state = req.body.state}
if (req.body.country) {spot.country = req.body.country}
if (req.body.lat) {spot.lat = req.body.lat}
if(req.body.lng){spot.lng = req.body.lng}
if(req.body.createdAt){spot.createdAt = req.body.createdAt}
if(req.body.updatedAt){spot.updatedAt = req.body.updatedAt}
if(req.body.name){spot.name = req.body.name}
if(req.body.description){spot.description = req.body.description}
if(req.body.price){spot.price = req.body.price}}
 spot.save()
res.json(spot)
})



module.exports = router;

