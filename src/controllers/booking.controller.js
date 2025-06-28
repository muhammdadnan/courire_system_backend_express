import {sendResponse} from '../helpers/sendResponse.js'
import shipmentSchemaModel from '../models/shipmentSchema.model.js'
export const addBookingController = async (req, res) => {
    try {
        // 12 digit ka number hota hai:
        // 100000000000 se le kar 999999999999 tak.
        // Math.random()
        // Yeh function 0 se 1 ke beech random number deta hai.

        // Jaise: 0.2345678, 0.9992, 0.0012, etc.

        // Math.random() * 900000000000
        // Iska matlab: 0 se le kar 899999999999 ke beech random number.

        // 100000000000 + ...
        // Hum 100000000000 add kar dete hain taake minimum value 100000000000 ho jaye.

        // Maximum value: 100000000000 + 899999999999 = 999999999999.

        // Math.floor(...)
        // Decimal hata deta hai. Sirf integer deta hai.
        const trackingId = Math.floor(100000000000 + Math.random() * 900000000000);

        const haveTrackingId =await shipmentSchemaModel.findOne({ trackingId })
        // console.log("haveTrackingId",haveTrackingId);
        
        if (haveTrackingId) {
                    return sendResponse(res,409,true,{general:"Tracking Id already registered"},null)
        }

        const previouInvoiceNo = await shipmentSchemaModel.findOne().sort({ invoiceNo: -1 })
        console.log(previouInvoiceNo);
        const invoiceNo = previouInvoiceNo ? previouInvoiceNo.invoiceNo + 1 : 101 
        const newBooking = new shipmentSchemaModel({ trackingId,invoiceNo })
        
        await newBooking.save()
                return sendResponse(res,200,false,{},{trackingId,invoiceNo,message:"Booking Registered Succesfully"})

    } catch (error) {
        return sendResponse(res,500,true,{ general: error.message },null)
    }
}

export const getSingleBooking = async (req, res) => {
    try {
        const { trackingId } = req.body
        const findBooking = await shipmentSchemaModel.findOne({ trackingId })
        if (!findBooking) {
              return sendResponse(res, 404, true, { general: "No Booking Found" }, null);
        }
        return sendResponse(res, 200,false,{}, {findBooking,message:"Booking Found Successfully"});
    } catch (error) {
        return sendResponse(res,500,true,{ general: error.message },null)
        
    }
}