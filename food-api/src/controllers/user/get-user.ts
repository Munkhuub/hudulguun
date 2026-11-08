import { userModel } from "../../models/user.model";

export const getUser = async (_req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    return res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
