const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs");

// upload image

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

// add user
router.post("/add", upload.single("image"), (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
  });

  user
    .save()
    .then(() => {
      req.session.message = {
        type: "success",
        message: "User added successfully",
      };
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
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

router.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let user = await User.findByIdAndRemove(id);
    if (user.image != "") {
      try {
        fs.unlinkSync("./uploads/" + user.image);
      } catch (err) {
        console.log(err);
      }
    }
    req.session.message = {
      type: "info",
      message: "User deleted successfully",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});
module.exports = router;
