const Router = require('express')
const structureControllers = require('../controllers/StructureControllers')
const router = new Router()



router.get('/', structureControllers.structure)



module.exports = router