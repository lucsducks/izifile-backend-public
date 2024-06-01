const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const ConexionHostSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: [true, "El usuario es obligatorio"],
    ref: "Usuario",
    emun: ["USER_ROLE", "DEV_ROLE"],
  },
  usuario: {
    type: String,
    required: [true, "El usuario es obligatorio"],
  },
  direccionip: {
    type: String,
    required: [true, "La direccion ip es obligatorio"],
  },
  port: {
    type: Number,
    required: [true, "La direccion ip es obligatorio"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
    default: "assets/icons/server.svg",
  },
  estado: {
    type: Boolean,
    default: true,
  },
  fechaCreacion: {
    type: Date,
    default: () => moment.tz("America/Lima").toDate(),
  },
});

ConexionHostSchema.methods.toJSON = function () {
  const { fechaCreacion, ...usuario } = this.toObject();
  usuario.fechaCreacion = moment
    .tz(usuario.fechaCreacion, "America/Lima")
    .format();
  return usuario;
};

module.exports = model("ConexionHost", ConexionHostSchema);
