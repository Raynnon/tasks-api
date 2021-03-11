const mongoose = require("mongoose");

const connectionURL =
  "mongodb+srv://Raynnon:ypwd3j@organisemecluster.l0jnw.mongodb.net/test";

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
