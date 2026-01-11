const express = require("express");
const path = require("path");
const dbHandler = require("../utils/db-handler");
const router = express.Router();
/*
const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review.controller");

router.get("/reviews", reviewController.getReview);
router.get("/add-review", reviewController.getReview);
router.get("/add-review", reviewController.getReview);
router.get("/reviews/:id/edit", reviewController.getReviewById);

router.post("/add-review", reviewController.newReview);
router.post("/reviews/:id/edit", reviewController.updateReviewById);
router.post("//reviews/:id/delete", reviewController.deletereviewById); 
*/

router.get("/reviews", async (req, res) => {
  try {
    const review = await dbHandler.getReview();
    console.log(review[0].username);
    res.render("reviews", { review: review });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send("Error fetching reviews");
  }
});

router.get("/add-review", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).render("401");
  }
  try {
    const review = await dbHandler.getReview();
    res.render("add-review", { review: review });
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

router.post("/add-review", async (req, res) => {
  try {
    const { book_title, description, rating } = req.body;
    await dbHandler.newReview([
      book_title,
      description,
      rating,
      res.locals.user.id,
    ]);
    res.redirect("/reviews");
  } catch (error) {
    console.error("Error adding new review:", error);
    res.status(500).send("Create this book to start discussion");
  }
});

router.get("/reviews/:id/edit", async (req, res) => {
  try {
    const records = await dbHandler.getReviewById(req.params.id);
    if (records.length === 0) {
      return res.status(404).render("404");
    }
    res.render("review-edit", { revi: records[0] });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
});
router.post("/reviews/:id/edit", async (req, res) => {
  const { description, rating } = req.body;
  try {
    await dbHandler.updateReviewById(req.params.id, [description, rating]);
  } catch (error) {
    return res.status(500).render("500)");
  }
  res.redirect("/reviews");
});

router.post("/reviews/:id/delete", async (req, res) => {
  try {
    await dbHandler.deletereviewById(req.params.id);
  } catch (error) {
    return res.status(500).render("500)");
  }
  res.redirect("/reviews");
});
module.exports = router;
