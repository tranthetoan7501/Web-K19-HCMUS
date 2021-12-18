const express = require('express');
const router = express.Router();
const productApiRouter = require('./admin');
router.use('/admin',productApiRouter) ;

module.exports = router;