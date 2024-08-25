const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const HttpError = require("../utils/HttpError.js");

const registerUser = async (req, res, next) => {
  const { name, email, phone, profession, password } = req.body;
  if (!name || !email || !phone || !profession || !password) {
    return next(HttpError("Fill in all fields", 422));
  }
  try {
    const userExists = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (userExists) {
      if (userExists.email === email) {
        return next(HttpError("Email already exists", 409)); // 409 Conflict
      }
      if (userExists.phone === phone) {
        return next(HttpError("Phone number already exists", 409)); // 409 Conflict
      }
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      phone,
      profession,
      password: hashedPassword,
    });
    res.status(200).json(newUser);
  } catch (error) {
    return next(new HttpError("User registration failed", 422));
  }
};
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HttpError("Fill in all fields", 422));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new HttpError("User does not exist.", 422));
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return next(new HttpError("Password does not match", 422));
    }
    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(new HttpError(`User login failed due to ${error}`, 422));
  }
};

const editUser = async (req, res, next) => {
  const { id } = req.params; // Get user ID from route parameters
  const { name, email, phone, profession, newPassword } = req.body;

  if (!name || !email || !phone || !profession) {
    return next(new HttpError("Fill in all fields except password", 422));
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    // Prepare updated data
    const updateData = {
      name,
      email,
      phone,
      profession,
    };

    // Update password only if provided
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Perform update
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return next(new HttpError("Failed to update user.", 500));
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in editUser:", error);
    return next(new HttpError(`Error updating user: ${error.message}`, 500));
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    return next(new HttpError("User is not available.", 400));
  }
  await User.findByIdAndDelete(userId);
  res.status(200).json({ message: `User deleted successfully` });
};
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    return next(new HttpError(`No users found`, 422));
  }
};
const getUser = async (req, res, next) => {
  const { id } = req.params; // Get user ID from route parameters

  if (!id) {
    return next(new HttpError("User ID is required.", 400));
  }

  try {
    // Find the user by ID
    const user = await User.findById(id).select("-password"); // Exclude password field

    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    // Send the user data as the response
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(`Error retrieving user: ${error.message}`, 500));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  editUser,
  deleteUser,
  getUser,
};
