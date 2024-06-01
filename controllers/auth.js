const { response } = require("express");
const bcryptjs = require("bcryptjs");


const { Usuario } = require("../models/");
const { generarJWT } = require("../helpers/");


const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({

            value: correo,
            msg: "Credenciales no son correctas",
            param: "correo",
            location: "body",

      });
    }

    if (!usuario.estado) {
      return res.status(400).json({

            value: correo,
            msg: "El usuario esta deshabilitado del sistema, hable con el administrador",
            param: "estado",
            location: "body",

      });
    }

    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({

            value: password,
            msg: "Credenciales no son correctas",
            param: "password",
            location: "body",

      });
    }

    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(500).json({

          msg: "Hable con el administrador",
          location: "server",

    });
  }
};


const validarTokenUsuario = async (req, res = response) => {
  const token = await generarJWT(req.usuario._id);

  res.json({
    usuario: req.usuario,
    token: token,
  });
};

module.exports = {
  login,
  validarTokenUsuario,
};
