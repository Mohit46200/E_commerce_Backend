const express = require("express");
const flower = require("./Routes/flower")
const plant = require("./Routes/plant")
const cors = require("cors")
const connectMongoDb = require("./Connection/connection.js")
const dotenv = require("dotenv");
const authRoutes = require("./Routes/auth");
const cartData = require("./Routes/cartData")
const checkout = require("./Routes/checkout")

const app = express()
const PORT = 8000

dotenv.config();


connectMongoDb("mongodb+srv://mohit22600:dpXsejSe31ILy41F@cluster0.dlnt1ti.mongodb.net/")


app.use(cors());
app.use(express.json());

app.use("/",flower)
app.use("/",plant)
app.use("/auth", authRoutes)
app.use("/data", cartData)
app.use("/check",checkout)


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})