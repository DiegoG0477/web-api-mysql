require("dotenv").config();
require("./configs/db.config")
const express = require("express");
const app = express();

const PORT = process.env.PORT
const usersRouter = require("./v1/routes/users.routes");
const authRouter = require("./v1/routes/auth.routes");

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);


app.listen(PORT, () => {
  console.log("corriendo en el puerto " + PORT);
});