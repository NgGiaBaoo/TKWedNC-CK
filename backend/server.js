const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { requireAuth, requireRole } = require("./src/middleware/auth");
const crypto = require("crypto");
const dotenv = require("dotenv").config({path : '../.env'});
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(cookieParser(process.env.COOKIE_SECRET));

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }
  }),
);

// Apply rate limiting to login and register only
app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);
app.use("/auth", require("./src/controllers/auth"));
app.use("/employers", requireAuth, requireRole("Admin"), require("./src/controllers/employer"));

app.use("/jobs", requireAuth, require("./src/controllers/job"));
app.use("/applications", requireAuth, requireRole("Admin"), require("./src/controllers/application"));
app.use("/candidates", requireAuth, requireRole("Admin"), require("./src/controllers/candidate"));
app.use("/users", requireAuth, requireRole("Admin"), require("./src/controllers/user"));

const PORT = process.env.BACKEND_PORT || 3000; // Default port : 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});