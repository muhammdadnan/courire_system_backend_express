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

export const getBookingController = async (req, res) => {
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