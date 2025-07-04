import UserModel from '../models/user.model.js'
import {sendResponse} from '../helpers/sendResponse.js'
import bcrypt from 'bcrypt'
import { generateAccessToken } from '../lib/tokens/generate.token.js'
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        // console.log(email);
        // console.log(password);
        
        // find user
        const user = await UserModel.findOne({email})
        if (!user) {
            return sendResponse(res,409,true,{email:"User is not registered"},null)
        }
        
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if (!isPasswordValid) return sendResponse(res, 401, true, { email: "Invalid email or password" }, null);
        
        const accessToken = generateAccessToken({ id: user._id, email: user.email })
        
        const userData = {
            email:user.email,accessToken
        }

        return sendResponse(res,200,false,{},{userData,message:"User Login Successfully"})
          
    } catch (error) {
          return sendResponse(res, 500, true, { general: error.message }, null);
    }
}