const Router = require('express')

const UserControllers = require('../controllers/UserControllers')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()




router.post('/registration', UserControllers.registration)
// router.post('registration/restore-password', UserControllers.restorePassword)
router.post('/login', UserControllers.login)
router.post('/add_key', UserControllers.addKey)
router.post('/active_key', UserControllers.activeKey)
router.get('/inviter', UserControllers.inviter)
router.post('/fio', UserControllers.fio)
router.post('/links', UserControllers.links)
router.post('/description', UserControllers.description)
router.get('/', UserControllers.user)
router.post('/avatar', UserControllers.avatar)
// router.options('/', UserControllers.userOptions)

module.exports = router