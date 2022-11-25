const Router = require('express')
const TinkoffControllers = require('../controllers/tinkoffControllers')
const router = new Router()



router.get('/success', TinkoffControllers.success)




module.exports = router