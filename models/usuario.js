const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  rol: {
    type: String,
    required: true,
    default: "USER_ROLE",
    emun: [
      "USER_ROLE",
      "DEV_ROLE",
    ],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  verificado: {
    type: Boolean,
    default: true,
  },

  fechaCreacion: {
    type: Date,
    default: () => moment.tz("America/Lima").toDate(),
  },
});

UsuarioSchema.methods.toJSON = function () {
  const { password, ...usuario } = this.toObject();
  usuario.fechaCreacion = moment
    .tz(usuario.fechaCreacion, "America/Lima")
    .format();
  return usuario;
};

module.exports = model("Usuario", UsuarioSchema);
