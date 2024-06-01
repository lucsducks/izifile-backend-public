const { response, request } = require("express");
const { ConexionHost } = require("../models/");
const bcryptjs = require("bcryptjs");

const listarPorUsuario = async (req = request, res = response) => {

  const { limite = 5, desde = 0 } = req.query;
  const owner = req.params.owner;
  const query = { owner };

  try {
    const [total, conexiones] = await Promise.all([
      ConexionHost.countDocuments(query),
      ConexionHost.find(query)
    ]);

    res.json({
      total,
      conexiones,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error al listar conexiones para el owner ${owner}`,
      error: error.message,
    });
  }

};
const buscarPorId = async (req, res = response) => {
  const { id } = req.params;

  try {
    const conexion = await ConexionHost.findById(id);
    if (conexion) res.json(conexion);
    else res.status(404).json({ msg: "Conexión no encontrada" });
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar la conexión",
      error: error.message,
    });
  }
}




const crearConexion = async (req, res = response) => {
  const { nombre, owner, usuario, direccionip,port,img, password } = req.body;
  const conexion = new ConexionHost({
    nombre,
    owner,
    usuario,
    direccionip,
    port,
    img,
    password,
  });

  try {
    await conexion.save();
    res.json({
      conexion
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la conexión",
      error: error.message,
    });
  }
};

const actualizarConexion = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, ...resto } = req.body;

  if (password) {
    resto.password = password; // Considera encriptar la contraseña como lo hiciste para usuarios
  }

  try {
    const conexion = await ConexionHost.findByIdAndUpdate(id, resto, { new: true });
    res.json(conexion);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la conexión",
      error: error.message,
    });
  }
};

const desactivarConexion = async (req, res = response) => {
  const { id } = req.params;

  try {
    const conexionActual = await ConexionHost.findById(id);
    if (!conexionActual) {
      return res.status(404).json({
        msg: "Conexión no encontrada",
      });
    }

    const nuevoEstado = !conexionActual.estado;
    const conexion = await ConexionHost.findByIdAndDelete(id);
    res.json(conexion);
  } catch (error) {
    res.status(500).json({
      message: "Error al desactivar la conexión",
      error: error.message,
    });
  }
};

module.exports = {
  listarPorUsuario,
  buscarPorId,
  crearConexion,
  actualizarConexion,
  desactivarConexion,

};
