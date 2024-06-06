const express = require("express");
const {
  checkinController,
  checkoutController,
} = require("../controllers/excel.controller");

const excelRoutes = express.Router();

// Route định tuyến chức năng checkin
excelRoutes.post("/checkin", checkinController);

// Route định tuyến chức năng checkout
excelRoutes.put("/checkout", checkoutController);

module.exports = excelRoutes;
