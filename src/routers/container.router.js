import express from 'express'
import {addContainerController,getallContainersList, getSinglelContainer, updateSinglelContainer} from "../controllers/container.controller.js";
const router = express.Router() 
router.post('/addContainer', addContainerController)
router.get('/allContainersList', getallContainersList)
router.get('/container/:id', getSinglelContainer) //get container
router.post('/update-container/:id', updateSinglelContainer)

export default router