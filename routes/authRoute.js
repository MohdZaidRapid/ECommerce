import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

//route object
const router = express.Router();

//routing
//Register|| Method POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController)

//test router
router.get("/test", requireSignIn, isAdmin, testController);

//protected user Route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true })
})

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true })
}
)

//update profile
router.put('/profile', requireSignIn, updateProfileController)

//orders
router.get("/orders", requireSignIn, getOrdersController)

//get all Orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController)


//order
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController)


export default router;
