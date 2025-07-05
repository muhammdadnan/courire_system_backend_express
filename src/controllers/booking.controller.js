import {sendResponse} from '../helpers/sendResponse.js'
import shipmentSchemaModel from '../models/shipmentSchema.model.js'
export const addBookingController = async (req, res) => {
    try {
        const {
        //     // BiltyNo,
        //     // InvoiceNo,
            SenderName,
            ReceiverName,
            SenderAddressDetail,
            SenderMobile,
            SenderCity,
            SenderOtherDetails,
            ReceiverAddressDetail,
            ReceiverMobile,
            ReceiverCity,
            ReceiverOtherDetail,
            NoOfPieces,
            DetailOfItems,
            BranchName,
            UnitRate,
            TotalWeight,
            TotalAmount,
            Customs,
            Packaging,
            Shipping,
            Clearance,
            OtherCharges,
            VAT,
            VAT_Value,
            TotalInvoiceAmount
        } = req.body
        console.log(TotalWeight);
        console.log(UnitRate);
        
        const trackingId = Math.floor(100000000000 + Math.random() * 900000000000);

        const haveTrackingId =await shipmentSchemaModel.findOne({ trackingId })
        if (haveTrackingId) {
                    return sendResponse(res,409,true,{general:"Tracking Id already registered"},null)
        }

        const previouInvoiceNo = await shipmentSchemaModel.findOne().sort({ createdAt: -1  })
        let invoiceNo
        if (previouInvoiceNo) {
            const [invoice] = previouInvoiceNo.InvoiceNo.split("/");
            const invoiceInt = parseInt(invoice) + 1 
            invoiceNo = `${invoiceInt}/${NoOfPieces}`
            
        }
        else {
            invoiceNo = `101/${NoOfPieces}`
        }
        const newBooking = new shipmentSchemaModel(
            { BiltyNo:trackingId, InvoiceNo:invoiceNo,SenderName,
                ReceiverName,
                SenderAddressDetail,
                SenderMobile,
                SenderCity,
                SenderOtherDetails,
                ReceiverAddressDetail,
                ReceiverMobile,
                ReceiverCity,
                ReceiverOtherDetail,
                NoOfPieces,
                DetailOfItems,
                BranchName,
                UnitRate,
                TotalWeight,
                TotalAmount,
                Customs,
            Packaging,
            Shipping,
            Clearance,
            OtherCharges,
            VAT,
            VAT_Value,
            TotalInvoiceAmount
            })
        
        await newBooking.save()
        return sendResponse(res, 200, false, {}, {
            bookingData: {
                BiltyNo:trackingId, InvoiceNo:invoiceNo,SenderName,
                ReceiverName,
                SenderAddressDetail,
                SenderMobile,
                SenderCity,
                SenderOtherDetails,
                ReceiverAddressDetail,
                ReceiverMobile,
                ReceiverCity,
                ReceiverOtherDetail,
                NoOfPieces,
                DetailOfItems,
                BranchName,
                UnitRate,
                TotalWeight,
                TotalAmount,
                Customs,
            Packaging,
            Shipping,
            Clearance,
            OtherCharges,
            VAT,
            VAT_Value,
            TotalInvoiceAmount
        },message:"Booking Registered Succesfully"})

    } catch (error) {
        return sendResponse(res,500,true,{ general: error.message },null)
    }
}

export const editBookingController = async (req, res) => {
    try {
        const {
            BiltyNo,
            InvoiceNo,
            SenderName,
            ReceiverName,
            SenderAddressDetail,
            SenderMobile,
            SenderCity,
            SenderOtherDetails,
            ReceiverAddressDetail,
            ReceiverMobile,
            ReceiverCity,
            ReceiverOtherDetail,
            NoOfPieces,
            DetailOfItems,
            BranchName,
            UnitRate,
            TotalWeight,
            TotalAmount,
            Customs,
            Packaging,
            Shipping,
            Clearance,
            OtherCharges,
            VAT,
            VAT_Value,
            TotalInvoiceAmount
        } = req.body
        
        console.log(req.body);
        
        const haveTrackingId =await shipmentSchemaModel.findOne({ BiltyNo })
        if (!haveTrackingId) {
                    return sendResponse(res,409,true,{general:"Tracking Id not found"},null)
        }

        
        await haveTrackingId.updateOne({
            BiltyNo, InvoiceNo,SenderName,
                ReceiverName,
                SenderAddressDetail,
                SenderMobile,
                SenderCity,
                SenderOtherDetails,
                ReceiverAddressDetail,
                ReceiverMobile,
                ReceiverCity,
                ReceiverOtherDetail,
                NoOfPieces,
                DetailOfItems,
                BranchName,
                UnitRate,
                TotalWeight,
                TotalAmount,
                Customs,
            Packaging,
            Shipping,
            Clearance,
            OtherCharges,
            VAT,
            VAT_Value,
            TotalInvoiceAmount
        })
        return sendResponse(res, 200, false, {}, {
            bookingData: {
                BiltyNo, InvoiceNo,SenderName,
                ReceiverName,
                SenderAddressDetail,
                SenderMobile,
                SenderCity,
                SenderOtherDetails,
                ReceiverAddressDetail,
                ReceiverMobile,
                ReceiverCity,
                ReceiverOtherDetail,
                NoOfPieces,
                DetailOfItems,
                BranchName,
                UnitRate,
                TotalWeight,
                TotalAmount,
                Customs,
            Packaging,
            Shipping,
            Clearance,
            OtherCharges,
            VAT,
            VAT_Value,
            TotalInvoiceAmount
        },message:"Booking Updated Succesfully"})

    } catch (error) {
        return sendResponse(res,500,true,{ general: error.message },null)
    }
}

export const getBookingInvoicesController = async (req, res) => {
    try {
        const bookingInvoices = await shipmentSchemaModel.find({},'InvoiceNo')
        return sendResponse(res, 200,false,{}, {bookingInvoices,message:"Get all booking Invoices"});
    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
}
export const getAllBookingController = async (req, res) => {
    try {
        const bookings = await shipmentSchemaModel.find()
        return sendResponse(res, 200,false,{}, {bookings,message:"Get all booking "});
    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
}


export const deleteBookingController = async (req, res) => {
    try {
        const { BiltyNo } = req.body
         // 1. Validate input
        if (!BiltyNo) {
            return sendResponse(res, 400, true, { general: "Bilty No is required" }, null);
        }
        
        // 2. Check if Builty exists
        const builtyRecord = await shipmentSchemaModel.findOne({ BiltyNo });

        if (!builtyRecord) {
            return sendResponse(res, 409, true, { general: "Builty not found" }, null);
        }
         // 3. Delete Builty
        await builtyRecord.deleteOne();
        // 4. Success response
        return sendResponse(res, 200, false, {}, { message: "Builty deleted successfully!" });

    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
} 