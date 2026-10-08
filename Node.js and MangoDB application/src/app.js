require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err.message));

const productSchema = new mongoose.Schema({
  productId: { type: Number, required: true, unique: true },
  productName: { type: String, required: true },
  category: String,
  price: Number,
  stock: Number,
  brand: String,
});

const Product = mongoose.model("Product", productSchema, "products");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/products", async (req, res) => {
  try {
    res.json(await Product.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product inserted successfully", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/products/:productId", async (req, res) => {
  try {
    const result = await Product.deleteOne({
      productId: Number(req.params.productId),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Product Management System running successfully on port ${PORT}`)
);