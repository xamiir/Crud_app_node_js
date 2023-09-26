const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const e = require("express");

// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("image");

// insert user database
router.post("/add", upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
  });

  // user.save((err) => {
  //   if (err) {
  //     res.json({ message: err.message, type: "danger" });
  //   } else {
  //     req.session.message = {
  //       type: "success",
  //       message: "User added successfully",
  //     };
  //     res.redirect("/");
  //   }
  // });
  user
    .save()
    .then((data) => {
      req.session.message = {
        type: "success",
        message: "User added successfully",
      };
      res.redirect("/");
    })
    .catch((err) => {
      res.json({ message: err.message, type: "danger" });
    });
});

router.get("/", (req, res) => {
  User.find()
    .then((data) => {
      res.render("index", { title: "User list", users: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/add", (req, res) => {
  res.render("add-users", { title: "Add users" });
});

module.exports = router;
