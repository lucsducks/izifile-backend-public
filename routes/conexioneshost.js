const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos,
  validarJWT,
  tieneRole,
} = require("../middlewares");

const {
  direccionIPExiste,
  existeConexionPorId,
} = require("../helpers/");

const {
  listarPorUsuario,
  crearConexion,
  actualizarConexion,
  desactivarConexion,
  buscarPorId,
} = require("../controllers/conexioneshost");

const router = Router();

// Listar conexiones por usuario
router.get(
  "/listar/:owner",
  [validarJWT, check("owner", "No es un ID válido").isMongoId(), tieneRole("USER_ROLE", "DEV_ROLE"), validarCampos,],
  listarPorUsuario
);
router.get(
  "/hostpersonal/:id",
  [validarJWT, check("id", "No es un ID válido").isMongoId(), tieneRole("USER_ROLE", "DEV_ROLE"), validarCampos,],
  buscarPorId
);

// Crear una nueva conexión
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("usuario", "El usuario es obligatorio").not().isEmpty(),
    check("owner", "El owner es obligatorio").not().isEmpty(),
    check("direccionip", "La dirección IP es obligatoria").not().isEmpty(),
    check("port", "El puerto es obligatoria").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  crearConexion
);

// Actualizar una conexión
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    tieneRole("USER_ROLE", "DEV_ROLE"),
    validarCampos,
  ],
  actualizarConexion
);

// Desactivar una conexión
router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("USER_ROLE", "DEV_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  desactivarConexion
);

module.exports = router;
