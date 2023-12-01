const Pedido = require("./pedido.model");

async function createDelivery(req, res) {
  try {
    const { client, restaurant, products } = req.body;
    const pedido = new Pedido({
      client,
      restaurant,
      products,
    });
    const resultado = await pedido.save();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getDeliveryById(req, res) {
  try {
    const { _id } = req.params;

    const resultado = await Pedido.findById(_id, { active: true });

    res.status(200).json(resultado);
  } catch (error) {
    console.log(error);
  }
}

async function getDeliveryByQuery(req, res) {
  try {
    const { client, restaurant, domiciliary, startDate, endDate } = req.query;
    let filtro = {};
    if (client) {
      filtro.client = client;
    }
    if (restaurant) {
      filtro.restaurant = restaurant;
    }
    if (domiciliary) {
      filtro.domiciliary = domiciliary;
    }
    if (startDate && endDate) {
      filtro.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const resultado = await Pedido.find(filtro);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getNotAcceptedDeliveries(res) {
  try {
    const resultado = await Pedido.find({
      sent: true,
      domiciliary: { $exists: false },
      active: true,
    });
    res.status(200).json(resultado);
  } catch (error) {
    console.log(error);
  }
}

async function updateDelivery(req, res) {
  const { _id } = req.params;
  const updates = req.body;

  try {
    let updatedDelivery = await Pedido.findByOneAndUpdate(
      { _id: _id, active: true },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (updatedDelivery.delivery_state == "Realizado") {
      updatedDelivery = await Pedido.findByIdAndUpdate(updatedDelivery._id, {
        $inc: { number_of_deliveries: 1 },
      });
    }
    res.status(200).json(updatedDelivery);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error al actualizar el usuario." });
  }
}

async function deleteDelivery(req, res) {
  const { _id } = req.params;

  try {
    const deletedDelivery = await Pedido.findByIdAndUpdate(_id, {
      active: false,
    });
    if (!deletedDelivery)
      return res.status(404).json({ message: "Pedido no encontrado" });

    res.status(200).json({ message: "Pedido inhabilitado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el pedido" });
  }
}

module.exports = {
  createDelivery,
  getDeliveryById,
  getDeliveryByQuery,
  getNotAcceptedDeliveries,
  updateDelivery,
  deleteDelivery,
};
