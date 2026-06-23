const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db = require("./localdb");
const registerJobModule = require("./src/jobs/jobModule");
const registerApplicationModule = require("./src/applications/applicationModule");
const registerCandidateModule = require("./src/candidates/candidateModule");
const registerUserModule = require("./src/user/userModule");

const app = express();

app.use(express.json());
app.use(cookieParser('your-secret-key'));
app.use(
  session({
    secret: 'my-secret',
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

// Job routes
registerJobModule(app);

// Application routes
registerApplicationModule(app);

// Candidate routes
registerCandidateModule(app);

// User routes
registerUserModule(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});