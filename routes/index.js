const router = require('express').Router();
const homeController = require('../controllers/homeControllers');

router.get('/',homeController.home);

router.use('/files',require('./files'));

module.exports = router;
