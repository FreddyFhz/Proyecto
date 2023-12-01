const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./usuario/usuario.routes");
const restaurantRoutes = require("./restaurante/restaurante.routes");
const productRoutes = require("./producto/producto.routes");
const deliveryRoutes = require("./pedido/pedido.routes");

const app = express();

//conexion
const url =
  "mongodb+srv://" +
  process.env.MONGO_USER +
  ":" +
  process.env.MONGO_PASS +
  "@cluster.rl9g7wz.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(url).then(() => {
      console.log("DataBase Connected");
      app.listen(8080, () => {
        console.log("App Listened on port 8080");
      });
    });
  } catch (error) {
    console.log(error);
  }
}

connect();

app.use(cors());
app.use(express.json());


//rutas
app.use("/users", userRoutes);

app.use("/restaurants", restaurantRoutes);

app.use("/products", productRoutes);

app.use("/deliveries", deliveryRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Error 404." });
});
