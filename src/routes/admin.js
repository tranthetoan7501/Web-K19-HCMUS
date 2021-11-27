const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');


router.get('/:id/update',adminController.update);
router.put('/:id/storeUpdate',adminController.storeUpdate);
router.delete('/:id/delete',adminController.delete);
router.get('/create',adminController.create);
router.post('/store',adminController.store);
router.get('/storedItems',adminController.storedItems);

//router.get('/',sitesController.home);


module.exports = router;