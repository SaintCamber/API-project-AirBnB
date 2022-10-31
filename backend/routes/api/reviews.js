const express = require("express");
const sequelize = require("sequelize");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, Review, ReviewImage, User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { appendFile } = require("fs");
const { argv } = require("process");
const { restoreUser } = require("../../utils/auth.js");

// ...
const router = express.Router();

router.use(restoreUser);
router.use(requireAuth);

router.get("/current", requireAuth, async (req, res) => {
  let currentUser = await Review.findAll({ where: { userId: req.user.id } });
  let reviewsOfCurrentUser = await Review.findAll({
    where: { userId: req.user.id },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      { model: Spot },
      { model: ReviewImage },
    ],
  });
  res.json(reviewsOfCurrentUser);
});

router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const review = await Review.findByPk(req.params.reviewId);

  if (!review) {
    res.status(404);
    let payLoaf = {
      message: "review couldn't be found",
      statusCode: 404,
    };
    res.json(payLoaf);
  }

  let newImage = await ReviewImage.create({
    spotId: req.params.spotId,
    url: req.body.url,
  });
  console.log(newImage)
  const payLoaf = {
    id: newImage.id,
    url: newImage.url,
  };

  res.json(payLoaf);
});

router.put('/:reviewId', requireAuth, async (req, res) => {
  let reviewToEdit = await Review.findByPk(req.params.reviewId)
  if (!reviewToEdit) {
    res.json({ message: 'review not found', statusCode: 404 })
  }
  reviewToEdit.review = req.body.review
  reviewToEdit.stars = req.body.stars
  reviewToEdit.save()
  res.json(reviewToEdit)
})


router.delete('/:reviewId', requireAuth, async (req, res) => {
  let reviewToDelete = await Review.findByPk(req.params.reviewId)
  if (!reviewToDelete) {
    res.json({ message: "review not found",statusCode:404 })
  }
  reviewToDelete.destroy()
  res.json({ message: "record deleted" ,statusCode:200})
})
module.exports = router;
module.exports = router;
