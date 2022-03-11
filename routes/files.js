const router = require('express').Router();
const filesController = require('../controllers/filesControllers');

router.post('/upload',filesController.upload);
router.get('/:uuid',filesController.downloadPage);
router.get('/download/:uuid',filesController.download);
router.post('/send-mail/:uuid',filesController.sendMail);

module.exports = router;