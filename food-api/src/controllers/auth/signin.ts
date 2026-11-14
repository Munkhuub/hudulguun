import { userModel } from "../../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signin = async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable is not set");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const user = await userModel.findOne({ email });
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) {
      return res.status(401).json({ message: "Email or password invalid" });
    }

    const { password: _pw, ...userWithoutPassword } = user.toObject();
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.role === "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
