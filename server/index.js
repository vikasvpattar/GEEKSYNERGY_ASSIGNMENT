const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes.js");
const port = process.env.PORT || 5000;
const app = express();
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
mongoose
  .connect(`${process.env.MONGO_URL}`)
  .then(() =>
    app.listen(port, () => console.log(`Server started on port ${port}`))
  )
  .catch((err) => console.log(err));
