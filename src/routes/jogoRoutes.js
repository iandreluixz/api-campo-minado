const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/jogoController');

router.post('/start',              controller.iniciarJogo);
router.post('/:gameId/reveal',     controller.revelarPosicao);
router.post('/:gameId/cashout',    controller.cashout);

module.exports = router;
