const express = require("express");
const router = express.Router();
const { orderModel, validateOrder } = require("../models/order");

router.get("/", async (req, res) => {
  try {
    const orders = await orderModel.find().populate("user products payment delivery");
    res.send(orders);
  } catch (error) {
    res.send("Error retrieving orders");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id).populate("user products payment delivery");
    if (!order) return res.status(404).send("Order not found");
    res.send(order);
  } catch (error) {
    res.send("Error retrieving order");
  }
});

router.post("/", async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const order = new orderModel(req.body);
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.send("Error creating order");
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const order = await orderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).send("Order not found");
    res.send(order);
  } catch (error) {
    res.send("Error updating order");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const order = await orderModel.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).send("Order not found");
    res.send(order);
  } catch (error) {
    res.send("Error deleting order");
  }
});

module.exports = router;
