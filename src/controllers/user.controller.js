import {sendResponse} from '../helpers/sendResponse.js'
export const userController = async (req, res) => {
    try {
        console.log(req.user);
        
     const {email} = req.user
    sendResponse(res, 200, false, {},{email})       
    } catch (error) {
        
    }
}