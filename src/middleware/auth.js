const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "passphrase");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    console.log(token);

    if (!user) {
      throw new Error();
    } else {
      req.user = user;
      next();
    }
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
