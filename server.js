const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db = require("./localdb");
const { requireAuth } = require("./src/auth/authMiddleware");
const registerAuthModule = require("./src/auth/authModule");

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

registerAuthModule(app);

app.use("/jobs", requireAuth, require("./src/jobs/jobController"));
app.use("/applications", requireAuth, require("./src/applications/applicationController"));
app.use("/candidates", requireAuth, require("./src/candidates/candidateController"));
app.use("/users", requireAuth, require("./src/user/userController"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});