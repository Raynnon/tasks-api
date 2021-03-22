const express = require("express");
const multer = require("multer");

const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save().catch((e) => console.log(e));
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    req.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(404).send({ error: "Invalid update" });
  } else {
    try {
      updates.forEach((update) => (req.user[update] = req.body[update]));

      await req.user.save();

      res.send(req.user);
    } catch (e) {
      res.status(400).send(e);
    }
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

const upload = multer({
  dest: "avatar",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must be a png or a jpg"));
    }

    cb(undefined, true);
  },
});

router.post("/users/me/avatar", [auth, upload.single("avatar")], (req, res) => {
  try {
    res.send("success");
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
