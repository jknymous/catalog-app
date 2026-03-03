const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");

const db = require("./config/db");

const app = express();

// MIDDLEWARE CEK LOGIN ADMIN
function isAdmin(req, res, next) {
    if (!req.session.adminId) {
        return res.status(401).send("Harus login dulu bro");
    }
    next();
}

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

// LOGIN ADMIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM admins WHERE username=?",
        [username],
        async (err, rows) => {
            if (err) return res.status(500).json(err);

            if (rows.length === 0) {
                return res.json({ message: "User tidak ditemukan" });
            }

            const admin = rows[0];

            const match = await bcrypt.compare(password, admin.password);

            if (!match) {
                return res.json({ message: "Password salah" });
            }

            // SIMPAN SESSION LOGIN
            req.session.adminId = admin.id;

            res.json({ message: "Login berhasil" });
        }
    );
});

// LOGOUT ADMIN
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.send("Gagal logout");
        res.send("Logout berhasil");
    });
});

// CEK APAKAH SUDAH LOGIN
app.get("/me", (req, res) => {
    if (!req.session.adminId) {
        return res.send("Belum login");
    }

    res.send("Sudah login sebagai admin ID: " + req.session.adminId);
});

// SETUP UPLOAD
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Biar folder uploads bisa diakses
app.use("/uploads", express.static("uploads"));

// Tambah Ikan
app.post("/add-fish", upload.single("photo"), (req, res) => {
    const { name, size, stock } = req.body;
    const photo = req.file ? req.file.filename : null;

    db.query(
        "INSERT INTO fishes (name, size, stock, photo) VALUES (?,?,?,?)",
        [name, size, stock, photo],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Fish berhasil ditambahkan" });
        }
    );
});

app.listen(5000, () => {
    console.log("Server jalan di port 5000");
});