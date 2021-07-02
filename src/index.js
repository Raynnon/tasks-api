const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
require("./db/mongoose");
require("dotenv").config();
const User = require("./models/user");

const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter");

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

//delete all anonymous accounts every day
cron.schedule(
  "* 2 * * *",
  async () => {
    await User.deleteMany({ email: RegExp("[@]anonymous[.]com$") });
  },
  {
    scheduled: true,
    timezone: "Europe/Madrid",
  }
);

app.listen(port, () => {
  console.log("Serveur running on port ", port);
});
