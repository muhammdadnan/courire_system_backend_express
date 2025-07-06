import express from 'express'
import { BranchController,CityController } from '../controllers/country.controller.js'


const router = express.Router();

router.post('/addBranch', BranchController)
router.post('/addCity', CityController)

export default router