const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/users.js");
const { newPackageRouter } = require("./routes/cigarettes.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/cigarettes", newPackageRouter);

mongoose.connect(
  "mongodb://localhost/smoking",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.listen(3001, () => console.log("Server started"));