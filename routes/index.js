const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const matrixRouter = require('./matrixRouter')
const newsRouter = require('./newsRouter')
const structureRouter = require('./structureRouter')
const walletRouter = require('./walletRouter')
const tinkoffRouter = require('./tinkoffRouter')
const registrationRouter = require('./registrationRouter')
const settingsRouter = require('./settingsRouter')


   
router.use('/user', userRouter)
router.use('/matrix', matrixRouter)
router.use('/news', newsRouter)
router.use('/structure', structureRouter)
router.use('/wallet', walletRouter)
router.use('/tinkoff', tinkoffRouter)
router.use('/registration', registrationRouter)
router.use('/settings', settingsRouter)



module.exports = router 