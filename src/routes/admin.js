const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');
const loggedInGuard = require("../guard/loggedInGuard");


router.get('/:id/update',loggedInGuard,adminController.update);
router.put('/:id/storeUpdate',loggedInGuard,adminController.storeUpdate);
router.delete('/:id/delete',loggedInGuard,adminController.delete);
router.get('/create',loggedInGuard,adminController.create);
router.post('/store',loggedInGuard,adminController.store);
router.get('/storedItems',loggedInGuard,adminController.storedItems);

//router.get('/',sitesController.home);
router.get('/profile',loggedInGuard,adminController.viewAccount);


module.exports = router;