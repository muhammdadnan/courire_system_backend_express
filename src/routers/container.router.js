import express from 'express'
import {addContainerController} from "../controllers/container.controller.js";
const router = express.Router() 
router.post('/addContainer', addContainerController)

export default router