import { sendResponse } from "../helpers/sendResponse.js";
import twilio from 'twilio'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
export const whatsappController = async (req, res) => {
    try {
        const { marketingImage, marketingFile } = req.files;
        // console.log("marketingImage",marketingImage);
        // console.log("marketingFile",marketingFile);
        // 
        const BASE_URL =
        process.env.NODE_ENV === "production"
          ? process.env.BASE_URL_PROD
                : process.env.BASE_URL_DEV;
        
        
        const uploaded = marketingImage?.[0] || marketingFile?.[0];
        // console.log("uploaded",uploaded);
        if (!uploaded) {
            return sendResponse(res, 400, true, { general: "No file uploaded." }, null);
        }
        // 🔁 Move file to /uploads
        const oldPath = uploaded.path; // temp folder
        const newPath = path.join('uploads', uploaded.originalname); // permanent
        // console.log("newPath",newPath); // Create uploads folder if not exist
        if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
        
        // ✅ Copy file to uploads
        fs.copyFileSync(oldPath, newPath);
        
        // ✅ Delete temp file
        fs.unlinkSync(oldPath);
        // Twilio credentials
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        
        
        const client = twilio(accountSid, authToken);
        const numbers = [
            'whatsapp:+923493445479',
            // 'whatsapp:+923004445566'
        ];
         // 📎 Create public file URL
        const fileUrl = `${BASE_URL}/uploads/${uploaded.originalname}`;
        console.log(fileUrl);
        
        for (const number of numbers) {
            await client.messages.create({
              from: 'whatsapp:+14155238886',
              to: number,
              body: 'Here is your file 📎',
            //   mediaUrl: [fileUrl]
                mediaUrl:[fileUrl]
            });
          }
        
          return sendResponse(res, 200, false, {}, {
            message: "File sent successfully!",
            fileUrl
          });
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
    }
}
