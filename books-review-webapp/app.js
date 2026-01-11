const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const defaultRoutes = require("./routes/default");
const routesBooks = require("./routes/books");
const reviewRoutes = require("./routes/reviews");
const publicModule = require("./routes/public");
const adminRoutes = require("./routes/admin");
const { initDB } = require("./utils/db-handler");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const options = {
  host: "localhost",
  database: "portal",
  port: 3306,
  user: "root",
  password: "mock_password",
  database: "session_data",
};
const sessionStore = new MySQLStore(options);

app.use(
  session({
    secret: "mock_secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use((req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return next();
  }
  res.locals.isAuth = true;
  res.locals.isAdmin = req.session.isAdmin;
  res.locals.user = { ...user };
  next();
});

app.use("/", defaultRoutes);
app.use("/", routesBooks);
app.use("/", reviewRoutes);
app.use("/", publicModule);
app.use("/", adminRoutes);

app.use((req, res) => {
  res.status(404).render("404");
});

app.use((error, req, res, next) => {
  console.log(error.message);
  res.status(500).render("500");
});

const start = async () => {
  try {
    await initDB();
  } catch (error) {
    console.log(error);
    return;
  }
  app.listen(3000);
};
start();
