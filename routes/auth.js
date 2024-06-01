const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos, validarJWT } = require("../middlewares/");

const { login, validarTokenUsuario } = require("../controllers/");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);


router.get("/", [validarJWT], validarTokenUsuario);

module.exports = router;
