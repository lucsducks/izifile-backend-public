const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos,
  validarJWT,
  tieneRole,
} = require("../middlewares");

const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/");

const {
  CrearUsuario,
  ActualizarUsuario,
  DesactivarUsuario,
  actualizarPrivilegio,
  ListarUsuarios,
  ListarDev,
  verificarCorreo,
  reenviarEmail
} = require("../controllers/");

const router = Router();


router.get("/dev", [validarJWT, tieneRole("USER_ROLE", "DEV_ROLE"), validarCampos], ListarDev);
router.get("/user", [validarJWT, tieneRole("USER_ROLE", "DEV_ROLE"), validarCampos], ListarUsuarios);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    tieneRole("USER_ROLE", "DEV_ROLE"),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  ActualizarUsuario
);
router.put(
  "/pri/:id",
  [
    validarJWT,
    check("rol").custom(esRoleValido),
    tieneRole("DEV_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  actualizarPrivilegio
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(emailExiste),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  CrearUsuario
);


router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("DEV_ROLE", "DIRECTOR_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  DesactivarUsuario
);


module.exports = router;
