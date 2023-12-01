const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      inmutable: true,
      validate: {
        validator: async function (v) {
          const user = await mongoose.model("user").findById(v);
          if (!user || user.role !== "Cliente") {
            throw new Error("El usuario no es de tipo cliente");
          }
        },
      },
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurants",
      required: true,
      inmutable: true,
      validate: {
        validator: async function (value) {
          const restaurant = await mongoose.model("restaurant").findOne({
            _id: value,
          });
          return restaurant !== null;
        },
        message: "restaurante no encontrado",
      },
    },
    domiciliary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      validate: {
        validator: async function (v) {
          const user = await mongoose.model("user").findById(v);
          if (!user || user.role !== "Domiciliario") {
            throw new Error("El usuario no es de tipo domiciliario");
          }
        },
      },
    },
    products: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
          inmutable: true,
          validate: {
            validator: async function (value) {
              const restaurant = await mongoose.model("product").findOne({
                _id: value,
              });
              return restaurant !== null;
            },
            message: "restaruante no encontrado",
          },
        },
        amount: {
          type: Number,
          inmutable: true,
          default: 1,
        },
      },
    ],
    sent: { type: Boolean, default: false },
    delivery_state: {
      type: String,
      enum: [
        "Creado",
        "Enviado",
        "Aceptado",
        "Recibido",
        "En Dirección",
        "Realizado",
      ],
      default: "Enviado",
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "deliveries" }
);

module.exports = mongoose.model("deliveries", deliverySchema);
