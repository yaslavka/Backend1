const Router = require('express')
const WalletControllers = require('../controllers/WalletControllers')
const router = new Router()



router.post('/create-pay', WalletControllers.freeKassa)
router.post('/create-payeer-pay', WalletControllers.payeer)
router.get('/success', WalletControllers.redirectAndPay)
router.get('/error',WalletControllers.redirect)
router.get('/warning', WalletControllers.redirect)



module.exports = router

