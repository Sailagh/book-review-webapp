const express = require("express");
const uuid = require("uuid");
const router = express.Router();
const dbHandler = require("../utils/db-handler");
/*
const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book.controller");

router.get("/books", bookController.getBook,bookController.getTypes);
router.get("/book-details", bookController.getBook);
router.get("/add-book", bookController.getTypes);
router.get("/books/:id", bookController.getBooksById);
router.get("/books/:id/reviews", bookController.getRevforBooks);

router.post("/add-book", bookController.newBook);
router.post("/books/:id/reviews", bookController.insertReview);



*/

router.get("/books", async (req, res) => {
  try {
    const book = await dbHandler.getBook();
    const type = await dbHandler.getTypes();
    res.render("books", { book: book, type: type });
  } catch (error) {
    console.error("Error fetching reviews or types:", error);
    res.status(500).send("Error fetching reviews or types");
  }
});

router.get("/book-details", async (req, res) => {
  try {
    const boki = await dbHandler.getBook();
    res.render("book-details", { boki: boki });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Error fetching books");
  }
});
router.get("/add-book", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).render("401");
  }
  try {
    const type = await dbHandler.getTypes();
    res.render("add-book", { type: type });
  } catch (error) {
    console.error("Error fetching types:", error);
    res.status(500).send("Error fetching types");
  }
});

router.get("/books/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).render("401");
  }
  try {
    const records = await dbHandler.getBooksById(req.params.id);
    if (records.length > 0) {
      return res.render("book-details", {
        records: records[0],
      });
    }
    res.status(404).render("404");
  } catch (error) {
    return res.status(500).render("500");
  }
});
router.get("/books/:id/reviews", async (req, res) => {
  try {
    const records = await dbHandler.getRevforBooks(req.params.id);
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/add-book", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).render("401");
  }
  try {
    const { title, author, type_id, description, ISBN } = req.body;
    await dbHandler.newBook([title, author, description, ISBN, type_id]);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error adding new book");
  }
});

router.post("/books/:id/reviews", async (req, res) => {
  try {
    const { book_title, description, rating } = req.body;

    await dbHandler.insertReview(
      book_title,
      description,
      rating,
      res.locals.user.id,
      req.params.id
    );
    res.redirect(`/books/${req.params.id}`);
  } catch (error) {
    console.error("Error adding new review:", error);
    res.status(500).send("Error adding new review");
  }
});

module.exports = router;
