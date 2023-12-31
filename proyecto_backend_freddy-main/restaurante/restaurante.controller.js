const Restaurante = require("./restaurante.model");

//Creación de restaurantes
async function createRestaurant(req, res) {
  try {
    const { name, phone_number, address, category } = req.body;
    const restaurant = new Restaurante({
      name,
      phone_number,
      address,
      category,
    });
    const resultado = await restaurant.save();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getRestaurantById(req, res) {
  try {
    const { _id } = req.params;
    const restaurant = await Restaurante.findOne({
      _id: _id,
      active: true,
    }).sort({ number_of_deliveries: -1 });
    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el restaurante" });
  }
}

async function getRestaurantByCategory(req, res) {
  try {
    const { category } = req.query;
    console.log(category);
    const restaurant = await Restaurante.find({
      category: { $all: category },
      active: true,
    }).sort({ number_of_deliveries: -1 });
    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el restaurante" });
  }
}

async function updateRestaurant(req, res) {
  const { _id } = req.params;
  const updates = req.body;

  try {
    const updatedRestaurant = await Restaurante.findByOneAndUpdate(
      { _id: _id, active: true },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error al actualizar el restaurante." });
  }
}

async function deleteRestaurant(req, res) {
  //Aquí uso params
  const { _id } = req.params;

  try {
    const deletedRestaurant = await Restaurante.findByOneAndUpdate(
      { _id: _id, active: true },
      {
        active: false,
      }
    );
    if (!deletedRestaurant)
      return res.status(404).json({ message: "Restaurante no encontrado" });

    res
      .status(200)
      .json({ message: "Restaurante inhabilitado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el restaurante" });
  }
}

module.exports = {
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantByCategory,
};
