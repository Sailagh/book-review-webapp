const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const craeteSessionStore = () => {
  const sessionStore = new MySQLStore({
    host: "localhost",
    database: "portal",
    port: 3306,
    user: "root",
    password: "StudenT**10",
    database: "session_data",
  });
  return sessionStore;
};

const createSessionConfig = () => {
  return session({
    secret: "niktonetusi",
    resave: false,
    saveUninitialized: false,
    store: craeteSessionStore(),
  });
};

module.exports = createSessionConfig;
