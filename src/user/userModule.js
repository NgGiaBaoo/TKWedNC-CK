module.exports = function registerUserModule(app) {
  const userRouter = require("./userController");
  app.use("/users", userRouter);
};