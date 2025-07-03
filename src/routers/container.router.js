import express from 'express'
import {addContainerController,getallContainersList} from "../controllers/container.controller.js";
const router = express.Router() 
router.post('/addContainer', addContainerController)
router.get('/allContainersList', getallContainersList)

export default router