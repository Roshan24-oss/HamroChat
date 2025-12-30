import User from "../models/user.model.js";

/* ================= CURRENT USER ================= */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= OTHER USERS ================= */
export const getOtherUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.userId } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= EDIT PROFILE ================= */
export const editProfile = async (req, res) => {
  try {
    const updateData = {};

    if (req.body.name) updateData.name = req.body.name;

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
};
