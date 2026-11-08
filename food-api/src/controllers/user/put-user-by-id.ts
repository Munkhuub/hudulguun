import { userModel } from "../../models/user.model";

// Fields a user may change on their own profile. role/password/email are not editable here.
const EDITABLE_FIELDS = ["name", "phoneNumber", "address", "image"] as const;

export const putUserById = async (req, res) => {
  const { id } = req.params;
  if (id !== req.userId && !req.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const update: Record<string, unknown> = { updatedAt: new Date() };
  for (const field of EDITABLE_FIELDS) {
    if (req.body[field] !== undefined) update[field] = req.body[field];
  }

  try {
    const user = await userModel
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
