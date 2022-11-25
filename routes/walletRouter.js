const Router = require('express')
const WalletControllers = require('../controllers/WalletControllers')
const router = new Router()



router.post('/create-pay', WalletControllers.freeKassa)
router.post('/create-payeer-pay', WalletControllers.payeer)
router.post('/create-withdraw', WalletControllers.withdraw)
router.get('/success', WalletControllers.redirectAndPay)
router.get('/error',WalletControllers.redirect)
router.get('/warning', WalletControllers.redirect)
router.post('/transfer', WalletControllers.transfer)



module.exports = router

