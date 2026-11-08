import { userModel } from "../../models/user.model";

export const getUserById = async (req, res) => {
  const { id } = req.params;
  if (id !== req.userId && !req.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  try {
    const user = await userModel.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
