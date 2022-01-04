const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');
const loggedInGuard = require("../guard/loggedInGuard");

var multer = require('multer');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/image')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

router.get('/:id/update',loggedInGuard,adminController.update);
router.put('/:id/storeUpdate',loggedInGuard,adminController.storeUpdate);
router.delete('/:id/delete',loggedInGuard,adminController.delete);
router.get('/create',loggedInGuard,adminController.create);
router.post('/store',upload.single('image'),loggedInGuard,adminController.store);

router.get('/trending', loggedInGuard, adminController.getTrending);
router.get('/statistic', loggedInGuard, adminController.getStatistic);
router.get('/storedItems',loggedInGuard,adminController.storedItems);
router.get('/account',loggedInGuard,adminController.viewAllAccount);
router.get('/userAccounts/view',loggedInGuard,adminController.viewUserAccount);
router.get('/userAccounts',loggedInGuard,adminController.viewAllUserAccounts);
router.get('/update-account',adminController.updateAccount);
router.get('/storeUpdate',adminController.storeUpdateAccount);
router.get('/change-pass',adminController.changePassword);
router.get('/manageOrders',adminController.manageOrders);
router.post('/change-pass',adminController.postChangePassword);


//router.get('/',sitesController.home);
router.get('/profile',loggedInGuard,adminController.viewAccount);


module.exports = router;