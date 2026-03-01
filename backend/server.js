const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");

const db = require("./config/db");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: "secret-admin",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// TEST SERVER
app.get("/", (req, res) => {
    res.send("Backend jalan bro");
});

// REGISTER ADMIN PERTAMA
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO admins (username, password) VALUES (?,?)",
        [username, hash],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "Admin dibuat" });
        }
    );
});

app.listen(5000, () => {
    console.log("Server jalan di port 5000");
});