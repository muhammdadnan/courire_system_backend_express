import shipmentSchema from '../models/shipmentSchema.model.js'
import {sendResponse} from '../helpers/sendResponse.js'
import containerModel from '../models/container.model.js'
export const getTrackingController = async (req, res) => {
    try {
        const { trackingId } = req.params
        const foundTrackingId = await shipmentSchema.findOne({ BiltyNo: trackingId })
        if (!foundTrackingId) {
              return sendResponse(res, 404, true, { general: "No tracking Id found" }, null);
        }
        let status = "";

        const invoicePrefix = foundTrackingId.InvoiceNo?.split('/')?.[0]; // Extract '101' from '101/5'

        if (!invoicePrefix) {
            return sendResponse(res, 400, true, { general: "Invalid InvoiceNo format" }, null);
        }
        
        //  If RemainingPieces > 0 → Shipment at Godown
        if (foundTrackingId.RemainingPieces > 0) {
            status = "Shipment at Godown";
          }else {
            const container = await containerModel.findOne({
                Invoices: {
                  $elemMatch: {
                    $regex: `^${invoicePrefix}/\\d+$`, // Matches like '101/2', '101/10', etc.
                  },
                },
              });
              console.log(container);
              
              if (container) {
                status = container.Status;
              } else {
                status = "Status not available";
              }
        }

        return sendResponse(res, 200,false,{}, {foundTrackingId,status,message:"Tracking Id Found Successfully"});
            
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
            
    }
}