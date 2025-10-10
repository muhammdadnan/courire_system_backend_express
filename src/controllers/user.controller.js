import {sendResponse} from '../helpers/sendResponse.js'
import UserModel from '../models/user.model.js';
export const userController = async (req, res) => {
    try {
        console.log(req.user);
        
     const {email} = req.user
    sendResponse(res, 200, false, {},{email})       
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
    }
}
export const getUserController = async (req, res) => {
    try {
        const users = await UserModel.find().select('-password') 
        
        sendResponse(res, 200, false, {},{users,message:"Users fetch successfully"})       
} catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);       
    }
}