const Router = require('express')
const SettingsControllers = require('../controllers/SettingsControllers')
const router = new Router()



router.post('/fin-password', SettingsControllers.finPass)




module.exports = router