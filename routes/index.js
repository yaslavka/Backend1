const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const matrixRouter = require('./matrixRouter')
const newsRouter = require('./newsRouter')
const structureRouter = require('./structureRouter')
const walletRouter = require('./walletRouter')


   
router.use('/user', userRouter)
router.use('/matrix', matrixRouter)
router.use('/news', newsRouter)
router.use('/structure', structureRouter)
router.use('/wallet', walletRouter)



module.exports = router 