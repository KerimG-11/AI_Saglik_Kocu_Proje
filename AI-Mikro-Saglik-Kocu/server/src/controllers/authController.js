const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Bu email zaten kayitli." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser({ name, email, password: hashedPassword });
    const token = signToken({ id: userId, email });

    return res.status(201).json({
      message: "Kayit basarili.",
      token,
      user: { id: userId, name, email }
    });
  } catch (error) {
    return res.status(500).json({ message: "Kayit sirasinda hata olustu." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Email veya sifre hatali." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email veya sifre hatali." });
    }

    const token = signToken(user);
    return res.json({
      message: "Giris basarili.",
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: "Giris sirasinda hata olustu." });
  }
}

module.exports = { register, login };
