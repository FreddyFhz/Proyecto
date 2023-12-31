const Producto = require("./producto.model");

async function createProduct(req, res) {
  try {
    const { name, description, price, category, restaurant } = req.body;
    const product = new Producto({
      name,
      description,
      price,
      category,
      restaurant,
    });
    const resultado = await product.save();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getProductbyId(req, res) {
  try {
    const { _id } = req.params;

    const resultado = await Producto.findById(_id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json("Error al obtener el producto: ", error);
  }
}

async function getProductsbyRestaurantAndCategory(req, res) {
  try {
    const { restaurant, category } = req.query;
    const filtro = {};
    if (restaurant) {
      filtro.restaurante = restaurant;
    }
    if (category) {
      filtro.category = category;
    }
    const productos = await Producto.find(filtro);
    res.status(200).json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}

async function updateProduct(req, res) {
  //Aquí opto por usar tanto params como body
  const { _id } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await Producto.findByIdAndUpdate(_id, updates, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error al actualizar el producto." });
  }
}

async function deleteProduct(req, res) {
  //Aquí uso params
  const { _id } = req.params;

  try {
    const deletedProduct = await Producto.findByIdAndUpdate(_id, {
      active: false,
    });
    if (!deletedProduct)
      return res.status(404).json({ message: "Producto no encontrado" });

    res.status(200).json({ message: "producto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
}

module.exports = {
  createProduct,
  getProductbyId,
  updateProduct,
  deleteProduct,
  getProductsbyRestaurantAndCategory,
};
