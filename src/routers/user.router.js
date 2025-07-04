import express from 'express'
import { userController } from '../controllers/user.controller.js'
import { authenticate_user } from '../middlewares/auth.middleware.js'


const router = express.Router()

router.get('/userInfo',authenticate_user, userController)

export default router