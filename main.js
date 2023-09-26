require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

// database connection
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});
db.once("open", () => {
  console.log("mongodb connection ");
});

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// session

app.use(
  session({
    secret: "secret-key",
    saveUninitialized: false,
    resave: true,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// static folder uploads
app.use(express.static("uploads"));

// set template engine
app.set("view engine", "ejs");

// routes prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`server started http://localhost:${PORT}`);
});
