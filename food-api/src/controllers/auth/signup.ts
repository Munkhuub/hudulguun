import { userModel } from "../../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signup = async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable is not set");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const now = new Date();
    // Only whitelisted fields — never take role from the request body.
    const newUser = await userModel.create({
      email,
      password: await bcrypt.hash(password, 10),
      name: req.body?.name,
      phoneNumber: req.body?.phoneNumber,
      address: req.body?.address,
      role: "user",
      createdAt: now,
      updatedAt: now,
    });

    const { password: _pw, ...userWithoutPassword } = newUser.toObject();
    const token = jwt.sign(
      { userId: newUser._id, isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
