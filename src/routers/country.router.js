import express from 'express'
import { BranchController,CityController, GetAllBranchController, GetAllCityController } from '../controllers/country.controller.js'


const router = express.Router();

router.get('/allBranch', GetAllBranchController)
router.get('/allCity', GetAllCityController)

router.post('/addBranch', BranchController)
router.post('/addCity', CityController)

export default router