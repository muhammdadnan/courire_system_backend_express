import { sendResponse } from '../helpers/sendResponse.js'
import BranchModel from '../models/branch.model.js'
import CityModel from '../models/city.model.js'
const BranchController = async (req, res) => {
    try {
        const { branch } = req.body
        const findBranch = await BranchModel.findOne({ branch })
        if (findBranch) {
             return sendResponse(res,409,true,{branchErr:"Branch already  added"},null)
        }

        const newBranch = new BranchModel({ branch })
        await newBranch.save()

        return sendResponse(res, 200, false, {}, {message:"Branch added Succesfully"})
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
    }
}
const CityController = async (req, res) => {
    try {
        const { city } = req.body
        const findCity = await CityModel.findOne({ city })
        if (findCity) {
             return sendResponse(res,409,true,{city:"City already  added"},null)
        }

        const newCity = new CityModel({ city })
        await newCity.save()

        return sendResponse(res, 200, false, {}, {message:"City added Succesfully"})
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
    }
}

export {BranchController,CityController}