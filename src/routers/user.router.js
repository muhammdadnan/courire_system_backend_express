import express from 'express'
import { getUserController, userController } from '../controllers/user.controller.js'
import { authenticate_user } from '../middlewares/auth.middleware.js'


const router = express.Router();

router.get('/userInfo',authenticate_user, userController)
router.get('/all-users',authenticate_user, getUserController)

export default router