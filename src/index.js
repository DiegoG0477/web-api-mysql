require("dotenv").config();
require("./configs/db.config")
const express = require("express");
const app = express();

const PORT = process.env.PORT
const usersRouter = require("./routes/users.routes");
const authRouter = require("./routes/auth.routes");

app.use(express.json());
app.use("/v1/auth", authRouter);
app.use("/v1/users", usersRouter);

app.listen(PORT, () => {
  console.log("corriendo en el puerto " + PORT);
});