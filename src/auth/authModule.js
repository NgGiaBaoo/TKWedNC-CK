module.exports = function registerAuthModule(app) {
  const authRouter = require("./authController");
  app.use("/auth", authRouter);
};
