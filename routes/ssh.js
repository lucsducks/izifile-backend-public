const express = require('express');
const sshController = require('../controllers/ssh');
const router = express.Router();

router.get('/listarconexiones', sshController.listarConexiones);
router.post('/conectar/:host/:username', sshController.conectar);
router.post('/comando/', sshController.execute);
router.delete('/deconectar/:host/:username', sshController.deconectar);

module.exports = router;
