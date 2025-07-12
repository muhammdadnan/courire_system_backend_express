import {sendResponse} from '../helpers/sendResponse.js'
import shipmentSchemaModel from '../models/shipmentSchema.model.js'
import containerModel from '../models/container.model.js'
import containerNumberModel from '../models/containerNumber.model.js'
import mongoose from 'mongoose'

export const addBookingController = async (req, res) => {
    try {
        console.log(req.body);
        
        const {
            SenderName,
            SenderMobile,
            SenderIdNumber,
            SenderAddress,
            SenderArea,

            ReceiverName,
            ReceiverMobile1,
            ReceiverMobile2,
            ReceiverAddress,
            ReceiverArea,

            ItemDetails,
            OtherDetails,

            NoOfPieces,
            Branch,
            BookingDate,

            Charges,
            Discount,
            SubTotal,
            Vat,
            VatTotal,

            AmountInWords,
            InvoiceTotal

        } = req.body
        // console.log(TotalWeight);
        // console.log(UnitRate);
        
        const trackingId = Math.floor(100000000000 + Math.random() * 900000000000);

        const haveTrackingId =await shipmentSchemaModel.findOne({ trackingId })
        if (haveTrackingId) {
                    return sendResponse(res,409,true,{container:"Tracking Id already registered"},null)
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
                SenderName,
                SenderMobile,
                SenderIdNumber,
                SenderAddress,
                SenderArea,
    
                ReceiverName,
                 ReceiverMobile1,
                 ReceiverMobile2,
                ReceiverAddress,
                ReceiverArea,
    
                 ItemDetails,
                 OtherDetails,
    
                NoOfPieces,
                 Branch,
                BookingDate,
    
                Charges,
                Discount,
                SubTotal,
                 Vat,
                VatTotal,
    
                AmountInWords,
                InvoiceTotal
            })
        
        await newBooking.save()
        return sendResponse(res, 200, false, {}, {
            bookingData: {
                BiltyNo:trackingId, InvoiceNo:invoiceNo,SenderName,
                SenderName,
                SenderMobile,
                SenderIdNumber,
                SenderAddress,
                SenderArea,
    
                ReceiverName,
                ReceiverMobile1,
                ReceiverMobile2,
                ReceiverAddress,
                ReceiverArea,
                
                ItemDetails,
                OtherDetails,
    
                NoOfPieces,
                Branch,
                BookingDate,
    
                Charges,
                Discount,
                SubTotal,
                Vat,
                VatTotal,
    
                AmountInWords,
                InvoiceTotal
        },message:"Booking Registered Succesfully"})

    } catch (error) {
        return sendResponse(res,500,true,{ general: error.message },null)
    }
}

export const editBookingController = async (req, res) => {
    try {
      const { id } = req.params;
  
      const {
        BiltyNo, InvoiceNo, SenderName, SenderMobile, SenderIdNumber, SenderAddress, SenderArea,
        ReceiverName, ReceiverMobile1, ReceiverMobile2, ReceiverAddress, ReceiverArea,
        ItemDetails, OtherDetails,
        NoOfPieces, Branch, BookingDate,
        Charges, Discount, SubTotal, Vat, VatTotal,
        AmountInWords, InvoiceTotal
      } = req.body;
  
      const updateData = {
        BiltyNo, InvoiceNo, SenderName, SenderMobile, SenderIdNumber, SenderAddress, SenderArea,
        ReceiverName, ReceiverMobile1, ReceiverMobile2, ReceiverAddress, ReceiverArea,
        ItemDetails, OtherDetails,
        NoOfPieces, Branch, BookingDate,
        Charges, Discount, SubTotal, Vat, VatTotal,
        AmountInWords, InvoiceTotal
      };
  
      let bookingDoc;
  
      if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return sendResponse(res, 400, true, { general: "Invalid ID" }, null);
        }
  
        bookingDoc = await shipmentSchemaModel.findById(id);
      } else {
        bookingDoc = await shipmentSchemaModel.findOne({ BiltyNo });
      }
  
      if (!bookingDoc) {
        return sendResponse(res, 409, true, { general: "Booking not found" }, null);
      }
  
      await bookingDoc.updateOne(updateData);
  
      return sendResponse(res, 200, false, {}, {
        bookingData: updateData,
        message: "Booking Updated Successfully"
      });
  
    } catch (error) {
      return sendResponse(res, 500, true, { general: error.message }, null);
    }
  };
  
export const getBookingInvoicesController = async (req, res) => {
    try {
        const bookingInvoices =
        await shipmentSchemaModel.find({ RemainingPieces:{ $gt: 0 }}, 'InvoiceNo RemainingPieces' )
        // console.log(bookingInvoices);
        
        // const checkRemainigInvoices = await shipmentSchemaModel
        return sendResponse(res, 200,false,{}, {bookingInvoices,message:"Get all booking Invoices"});
    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
}

export const getAllBookingController = async (req, res) => {
  try {
    const bookings = await shipmentSchemaModel.find();

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        let status = "Shipment in Godown";

        const invoice = booking?.InvoiceNo;
        const [invNo] = invoice?.split("/") || [];

        if (invNo) {
          const containers = await containerModel.find({
            Invoices: { $elemMatch: { $regex: `^${invNo}/` } }
          });

          const statusArray = containers.map((c) => c.Status).filter(Boolean);
          const uniqueStatuses = [...new Set(statusArray)];

          if (uniqueStatuses.length > 0) {
            status = uniqueStatuses.join(", ");
          }
        }

        return {
          ...booking._doc,
          status,
        };
      })
    );

    return sendResponse(
      res,
      200,
      false,
      {},
      { bookings: enrichedBookings, message: "Get all bookings" }
    );
  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};





export const getBookingSingleController = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, true, { general: "Invalid ID" }, null);
    }

    // 2. Find booking
    const builtyRecord = await shipmentSchemaModel.findById(id);

    if (!builtyRecord) {
      return sendResponse(res, 409, true, { general: "Booking not found" }, null);
    }

    // 3. Extract invoiceNo (e.g. "INV123" from "INV123/2")
    const [invoiceNo] = builtyRecord.InvoiceNo?.split("/") || [];

    let status = "Shipment in Godown"; // default

    if (invoiceNo) {
      // 4. Find containers that include this invoice
      const containers = await containerModel.find({
        Invoices: { $elemMatch: { $regex: `^${invoiceNo}/` } }
      });

      // 5. Extract and deduplicate statuses
      const statusArray = containers.map((c) => c.Status).filter(Boolean);
      const uniqueStatuses = [...new Set(statusArray)];

      if (uniqueStatuses.length > 0) {
        status = uniqueStatuses.join(", ");
      }
    }

    // 6. Return enriched result
    return sendResponse(res, 200, false, {}, {
      builtyRecord: {
        ...builtyRecord._doc,
        status,
      },
      message: "Builty fetched successfully!",
    });

  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};
 
export const deleteBookingController = async (req, res) => {
  try {
    const { BiltyNo } = req.body;

    // 1. Validate input
    if (!BiltyNo) {
      return sendResponse(res, 400, true, { general: "Bilty No is required" }, null);
    }

    // 2. Find the shipment
    const builtyRecord = await shipmentSchemaModel.findOne({ BiltyNo });

    if (!builtyRecord) {
      return sendResponse(res, 409, true, { general: "Bilty not found" }, null);
    }

    // 2.1 Check if this bilty has been partially shipped
    if (builtyRecord.Pieces !== builtyRecord.RemainingPieces) {
      return sendResponse(res, 400, true, { general: "This booking is already added to a container and cannot be deleted." }, null);
    }

    // // 3. Extract invoice number
    // const fullInvoice = builtyRecord.InvoiceNo;       // e.g. "INV001/3"
    // const invoiceNo = fullInvoice?.split('/')?.[0];   // e.g. "INV001"

    // if (!invoiceNo) {
    //   return sendResponse(res, 400, true, { general: "Invalid Invoice Number format" }, null);
    // }

    // // 4. Remove invoice from containerModel
    // await containerModel.updateMany(
    //   { Invoices: { $elemMatch: { $regex: `^${invoiceNo}/` } } },
    //   { $pull: { Invoices: { $regex: `^${invoiceNo}/` } } }
    // );

    // // 5. Remove invoice from containerNumberModel
    // await containerNumberModel.updateMany(
    //   { Invoices: { $elemMatch: { $regex: `^${invoiceNo}/` } } },
    //   { $pull: { Invoices: { $regex: `^${invoiceNo}/` } } }
    // );

    // 6. Delete the shipment itself
    await builtyRecord.deleteOne();

    return sendResponse(res, 200, false, {}, {
      message: "Bilty deleted successfully and removed from all containers.",
    });

  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};

