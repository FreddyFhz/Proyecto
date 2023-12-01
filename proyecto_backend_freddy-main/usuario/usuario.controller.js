const Usuario = require("./usuario.model");

async function createUser(req, res) {
  try {
    const { name, password, email, phone_number, address, role } = req.body;
    const user = new Usuario({
      name,

      password,

      email,
      phone_number,
      address,
      role,
    });
    const resultado = await user.save();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getUserById(req, res) {
  try {
    const { _id } = req.params;

    const user = await Usuario.findOne({ _id: _id, active: true });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
}

async function getUserByEmailAndPassword(req, res) {
  try {
    const { email, password } = req.query;

    const user = await Usuario.findOne({ email, active: true });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Contraseña incorrecta");

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
}

async function updateUser(req, res) {
  const { _id } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await Usuario.findByOneAndUpdate(
      { _id: _id, active: true },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error al actualizar el usuario." });
  }
}

async function deleteUser(req, res) {
  const { _id } = req.params;

  try {
    const deletedUser = await Usuario.findByOneAndUpdate(
      { _id: _id, active: true },
      { active: false }
    );
    if (!deletedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json({ message: "Usuario inhabilitado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
}

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmailAndPassword,
};
