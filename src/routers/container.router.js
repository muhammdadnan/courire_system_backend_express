import express from 'express'
import {addContainerController,getallContainersList, getSinglelContainer, updateSinglelContainerStatus,updateSingleContainer} from "../controllers/container.controller.js";
const router = express.Router() 
router.post('/addContainer', addContainerController)
router.get('/allContainersList', getallContainersList)
router.get('/container/:id', getSinglelContainer) //get container
router.post('/update-container/:id', updateSinglelContainerStatus)
router.post('/updateSingleContainer/:id', updateSingleContainer)

export default router