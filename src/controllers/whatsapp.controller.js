import { sendResponse } from "../helpers/sendResponse.js";
import twilio from 'twilio'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
export const whatsappController = async (req, res) => {
    try {
        // const { marketingImage, marketingFile } = req.files;
        const { whatsappNumbers } = req.body
        console.log(typeof whatsappNumbers);
        
        if (!Array.isArray(whatsappNumbers) || whatsappNumbers.length === 0) {
            return sendResponse(res, 400, true, { general: "No WhatsApp numbers provided." }, null);
          }
        const customMessage = `🟢 Hello from our backend! Here's a message sent directly via  WhatsApp at ${new Date().toLocaleString()}`;

        // console.log("marketingImage",marketingImage);
        // console.log("marketingFile",marketingFile);
        // 
        // const BASE_URL =
        // process.env.NODE_ENV === "production"
        //   ? process.env.BASE_URL_PROD
        //         : process.env.BASE_URL_DEV;
        
        
        // const uploaded = marketingImage?.[0] || marketingFile?.[0];
        // // console.log("uploaded",uploaded);
        // if (!uploaded) {
        //     return sendResponse(res, 400, true, { general: "No file uploaded." }, null);
        // }
        // // 🔁 Move file to /uploads
        // const oldPath = uploaded.path; // temp folder
        // const newPath = path.join('uploads', uploaded.originalname); // permanent
        // // console.log("newPath",newPath); // Create uploads folder if not exist
        // if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
        
        // // ✅ Copy file to uploads
        // fs.copyFileSync(oldPath, newPath);
        
        // // ✅ Delete temp file
        // fs.unlinkSync(oldPath);
        // Twilio credentials
        // const numbers = [
        //     'whatsapp:+923493445479',
        //     // 'whatsapp:+923004445566'
        // ];
        //  // 📎 Create public file URL
        // const fileUrl = `${BASE_URL}/uploads/${uploaded.originalname}`;
        // console.log(fileUrl);
        
        
        
          return sendResponse(res, 200, false, {}, {
            message: "Messages  sent successfully!",
            total: whatsappNumbers.length
          });
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
    }
}
