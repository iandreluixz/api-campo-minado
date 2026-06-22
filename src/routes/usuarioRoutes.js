const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/usuarioController');

router.get('/dashboard',  controller.buscarDashboard);
router.get('/:id',        controller.buscarPerfil);
router.put('/:id',        controller.atualizarSaldo);
router.delete('/:id',     controller.deletarUsuario);

module.exports = router;
