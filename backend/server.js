const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { requireAuth } = require("./src/middleware/auth");
const dotenv = require("dotenv").config({path : '../.env'});

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  }),
);

// Visit counter route
app.get("/visits", (req, res) => {
    req.session.visits = req.session.visits ? req.session.visits + 1 : 1;
    res.json({ visits: req.session.visits });
});

// Read Cookie route
app.get("/read-cookie", (req, res) => {
    console.log(req.cookies);
    console.log(req.signedCookies);
    res.json({ cookies: req.cookies, signedCookies: req.signedCookies });
});

// Write Cookie route
app.get("/set-cookie", (req, res) => {
    res.cookie("key", "value", { signed: true });
    res.json("Cookies set!");
});

app.use("/auth", require("./src/controllers/auth"));
app.use("/employers", requireAuth, require("./src/controllers/employer"));

app.use("/jobs", requireAuth, require("./src/controllers/job"));
app.use("/applications", requireAuth, require("./src/controllers/application"));
app.use("/candidates", requireAuth, require("./src/controllers/candidate"));
app.use("/users", requireAuth, require("./src/controllers/user"));

const PORT = process.env.BACKEND_PORT || 3000; // Default port : 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});