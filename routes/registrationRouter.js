const Router = require('express')
const RegistrationControllers = require('../controllers/RegistrationControllers')
const router = new Router()



router.post('/restore-password', RegistrationControllers.restore)




module.exports = router