const express = require("express");
const uuid = require("uuid");
const router = express.Router();
const dbHandler = require("../utils/db-handler");

/*
const express = require("express");
const router = express.Router();
const uuid = require("uuid");

const adminController = require("../controllers/admin.controller");

router.get("/admin", adminController.getAllUsers);
router.get("/admin/edit/:id", adminController.getUserById);
router.get("/admin/edit/:id", adminController.updateUser);
router.post("/admin/delete/:id", adminController.deleteUSer);
*/

router.get("/admin", async (req, res) => {
  /*  if (!req.session.isAdmin) {
    return res.status(401).render("401");
}*/
  try {
    const users = await dbHandler.getAllUsers();
    res.render("admin", { users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

router.post("/admin/delete/:id", async (req, res) => {
  try {
    await dbHandler.deleteUSer(req.params.id);
  } catch (error) {
    return res.status(500).render("500");
  }
  res.redirect("/admin");
});
router.get("/admin/edit/:id", async (req, res) => {
  try {
    const user = await dbHandler.getUserById(req.params.id);
    res.render("edit-user", { user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Error fetching user");
  }
});

router.post("/admin/edit/:id", async (req, res) => {
  try {
    const { username, about, profile_picture } = req.body;

    await dbHandler.updateUser(req.params.id, {
      username,
      about,
      profile_picture,
    });
    res.redirect("/admin");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});
module.exports = router;
