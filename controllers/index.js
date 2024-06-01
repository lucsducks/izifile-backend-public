const auth = require("../controllers/auth");
const usuario = require("../controllers/usuarios");

module.exports = {
    ...auth,
    ...usuario,
}