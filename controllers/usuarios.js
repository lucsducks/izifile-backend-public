const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const { Usuario, VerificationCode } = require("../models/");
const { generarJWT } = require("../helpers");


const listarPorRol = (rol) => {
  return async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { rol };

    try {
      const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query),
      ]);

      res.json({
        total,
        usuarios,
      });
    } catch (error) {
      res.status(500).json({
        message: `Error al listar usuarios con rol ${rol}`,
        error: error.message,
      });
    }
  };
};
const CrearUsuario = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({
    nombre,
    correo,
    password,
    rol: "USER_ROLE",
  });

  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  try {
    await usuario.save();

  

    const token = await generarJWT(usuario.id);
    res.json({
      usuario,
      token
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message,
    });
  }
};

const ActualizarUsuario = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, correo, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  try {
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

const actualizarPrivilegio = async (req, res = response) => {
  const { id } = req.params;
  const { rol } = req.body;

  try {
    const usuario = await Usuario.findByIdAndUpdate(id, { rol }, { new: true });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el privilegio",
      error: error.message,
    });
  }
};

const DesactivarUsuario = async (req, res = response) => {
  const { id } = req.params;

  try {
    const usuarioActual = await Usuario.findById(id);
    if (!usuarioActual) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    const nuevoEstado = !usuarioActual.estado;
    const cambios = { estado: nuevoEstado };
    const usuario = await Usuario.findByIdAndUpdate(id, cambios, { new: true });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message,
    });
  }
};

module.exports = {
  ListarUsuarios: listarPorRol("USER_ROLE"),
  ListarDev: listarPorRol("DEV_ROLE"),
  CrearUsuario,
  ActualizarUsuario,
  DesactivarUsuario,
  actualizarPrivilegio,
};
