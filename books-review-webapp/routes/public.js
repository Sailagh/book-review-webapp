const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const multer = require("multer");
const { fileFilter, storage } = require("../utils/fileUpload");
const dbHandler = require("../utils/db-handler");
let upload = multer({ storage, fileFilter, limits: { FileSize: "10MB" } });

/*
const express = require("express");

const publicController = require("../controllers/public.controller");

const = {getSignUp,signUp,getLogin,login,logout} = require(../controllers/public.controller);
const router = express.Router();

router.get("/signup", publicController.getSignUp);
router.get("/login", publicController.getLogin);
router.get("/my-page", publicController.getReviewByUserId);
router.get("/my-page-picture", publicController.updateUserProfilePicture);
router.get("/my-page-about", publicController.updateUserAbout);


router.post("/signup", publicController.signUp);
router.post("/login", publicController.getUserBy);
router.post("/logout", publicController.logout);
router.post("/signup", publicController.getUserBy);

*/

router.get("/signup", async (req, res) => {
  let inputData = req.session.inputData;
  if (!inputData) {
    inputData = {
      username: "",
      email: "",
      password: "",
      passwordrepeate: "",
    };
  }
  res.render("signup", { inputData });
});

router.post("/signup", async (req, res) => {
  const { username, email, password, passwordrepeate } = req.body;
  const inputData = { ...req.body };
  console.log(req.body);
  if (passwordrepeate.trim() !== password.trim()) {
    inputData.errorMessage = "Passwords do not match";

    req.session.inputData = inputData;
    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }

  const norepeate = await dbHandler.getUserBy("email", email);
  if (norepeate.length > 0) {
    inputData.errorMessage = "Email is already being used";
    return res.redirect("/signup");
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPass = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  try {
    await dbHandler.createUser([
      username.trim(),
      email.trim(),
      hashedPass,
      salt,
    ]);
    res.redirect("/login");
  } catch (error) {
    return res.status(500).render("500");
  }
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await dbHandler.getUserBy("email", email);
  if (user.length === 0) {
    return res.redirect("/login");
  }

  const hashedPass = crypto
    .pbkdf2Sync(password, user[0].salt, 1000, 64, "sha512")
    .toString("hex");

  if (user[0].password === hashedPass) {
    req.session.user = {
      id: user[0].user_id,
      email: user[0].email,
      username: user[0].username,
    };
    const book = await dbHandler.getBook();
    const type = await dbHandler.getTypes();
    req.session.save(() => {
      res.render("books", { book: book, type: type });
    });
    console.log("Login successful.");
  } else {
    console.log("Incorrect password.");
    return res.render("login");
  }
});

router.post("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

router.get("/my-page", async (req, res) => {
  try {
    const datacka = await dbHandler.getReviewByUserId(res.locals.user.id);
    //const picture = datacka[0].profile_picture;
    //const changetoPic = picture.replace(/\\/g, "/");
    //const imagecorrected = `http://localhost:3000/${changetoPic}`;
    //console.log(imagecorrected);
    res.render("my-page", { datacka });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

router.post("/my-page-about", async (req, res) => {
  try {
    const about = req.body.about;
    await dbHandler.updateUserAbout(res.locals.user.id, about);
    console.log(about);
    res.redirect("/my-page");
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Error updating profile");
  }
});

router.post("/my-page-picture", upload.single("image"), async (req, res) => {
  let profilePicture = "";
  if (req.file.path) {
    profilePicture = req.file.path.substr(req.file.path.indexOf("/") + 1);
  }
  try {
    await dbHandler.updateUserProfilePicture(
      res.locals.user.id,
      profilePicture
    );
    res.redirect("/my-page");
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).send("Error uploading profile picture");
  }
});
module.exports = router;
