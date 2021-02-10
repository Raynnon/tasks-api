require("../db/mongoose");
const User = require("../models/user");

// 60240492f94fea075b1bdf61

User.findByIdAndUpdate("60231d84605d1b031a50a40c", { age: 36 })
  .then((user) => {
    console.log(user);
    return User.countDocuments({ age: 36 });
  })
  .then((result) => {
    console.log(result);
  })
  .catch((e) => {
    console.log(e);
  });
