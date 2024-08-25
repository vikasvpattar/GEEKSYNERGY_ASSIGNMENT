const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware.js");
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  editUser,
  getUser,
} = require("../controllers/userController.js");
const router = Router();
// Register post
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.patch("/edit-user/:id", editUser);

module.exports = router;
