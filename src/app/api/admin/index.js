const express = require('express');
const router = express.Router();
const adminApiController = require('./adminApiController');

router.post('/:productId/comments',adminApiController.postComment);
router.get('/:category',adminApiController.getPagination);
router.get('/updateAccount/:name',adminApiController.updateUserAccount);

module.exports = router;