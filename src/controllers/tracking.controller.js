import shipmentSchema from '../models/shipmentSchema.model.js'
import {sendResponse} from '../helpers/sendResponse.js'
export const getTrackingController = async (req, res) => {
    try {
        const { trackingId } = req.params
        const foundTrackingId = await shipmentSchema.findOne({ BiltyNo: trackingId })
        if (!foundTrackingId) {
              return sendResponse(res, 404, true, { general: "No tracking Id found" }, null);
        }
        return sendResponse(res, 200,false,{}, {foundTrackingId,message:"Tracking Id Found Successfully"});
            
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
            
    }
}