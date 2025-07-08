import shipmentSchema from '../models/shipmentSchema.model.js'
import {sendResponse} from '../helpers/sendResponse.js'
export const getTrackingController = async (req, res) => {
    try {
        const { trackingId } = req.params
        const foundTrackingId = await shipmentSchema.findOne({ BiltyNo: trackingId })
        if (!foundTrackingId) {
              return sendResponse(res, 404, true, { general: "No tracking Id found" }, null);
        }
        let status = "";

        //  If RemainingPieces > 0 → Shipment at Godown
        if (foundTrackingId.RemainingPieces > 0) {
          status = "Shipment at Godown";
        } 
        return sendResponse(res, 200,false,{}, {foundTrackingId,status,message:"Tracking Id Found Successfully"});
            
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
            
    }
}