const { Usuario, Role } = require("../models/");


const esRoleValido = async (rol = "USER_ROLE") => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
};


const emailExiste = async (correo = "") => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya está registrado`);
    }
};

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida - permitidas son ${colecciones}`);
    }
    return true;
};

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    coleccionesPermitidas,
};
