const express = require("express");
const {
  createOrder,
  createKhaltiOrder,
  capturePaymentAndFinalizeOrder,
  verifyPayment,
  khaltiOrder
} = require("../../controllers/student-controller/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/create-khalti", createKhaltiOrder);
router.post("/verify-payment", verifyPayment);
router.post("/capture", capturePaymentAndFinalizeOrder);

module.exports = router;
