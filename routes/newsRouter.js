const Router = require('express')
const NewsControllers = require('../controllers/NewsControllers')
const router = new Router()



router.get('/get-block', NewsControllers.getBlock)
router.get('/get', NewsControllers.get)
router.get('/get-one', NewsControllers.getOne)



module.exports = router