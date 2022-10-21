const Router = require('express')
const matrixController = require('../controllers/MatrixControllers')
const router = new Router()



router.post('/create_count', matrixController.createCount)
router.post('/create_type', matrixController.createType)
router.get('/count', matrixController.getCount)
router.get('/type', matrixController.getType)
router.get('/structure', matrixController.structure)
router.get('/structure-upper', matrixController.structureUpper)


module.exports = router