import {sendResponse} from '../helpers/sendResponse.js'
import containerNumberModel from '../models/containerNumber.model.js'

export const addContainerNumberController = async (req, res) => {
    try {
        const { 
            ContainerNumber,
            From,
            To
        } = req.body
        console.log(req.body);
        if (!ContainerNumber || !From || !To) {
            return sendResponse(res, 400, true, {general:"All Fields are required of Container Number Section"}, null)
        }
        const haveContainerNumber =await containerNumberModel.findOne({ ContainerNumber })
        if (haveContainerNumber) {
                    return sendResponse(res,409,true,{container:"Container Number already added"},null)
        }

        const newContainerNumber = new containerNumberModel({
            ContainerNumber,
            From,
            To
        }) 
        await newContainerNumber.save()
        return sendResponse(res, 200, false, {}, {
            containerNoData: {
                ContainerNumber,
                From,
                To
        },message:"Container Number Add Successfully"});
    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
}   

export const editContainerNumberController = async (req, res) => {
    try {
        const { 
            ContainerNumber,
            From,
            To
        } = req.body
        console.log(req.body);
        if (!ContainerNumber || !From || !To) {
            return sendResponse(res, 400, true, {general:"All Fields are required of Container Number Section"}, null)
        }
        const haveContainerNumber =await containerNumberModel.findOne({ ContainerNumber })
        if (!haveContainerNumber) {
                    return sendResponse(res,409,true,{container:"Container Number doesnot exist"},null)
        }
        
        
        await haveContainerNumber.updateOne({
            ContainerNumber,
            From,
            To    
        })
        return sendResponse(res, 200, false, {}, {
            containerNoData: {
                ContainerNumber,
                From,
                To
        },message:"Container Number Updated Successfully"});
    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
}


export const deleteContainerNumberController = async (req, res) => {
    try {
        const { ContainerNumber } = req.body
         // 1. Validate input
        if (!ContainerNumber) {
            return sendResponse(res, 400, true, { general: "Container Number is required" }, null);
        }
        
        // 2. Check if Builty exists
        const containerNumberRecord = await containerNumberModel.findOne({ ContainerNumber });

        if (!containerNumberRecord) {
            return sendResponse(res, 409, true, { general: "Container Number not found" }, null);
        }
         // 3. Delete Builty
        await containerNumberRecord.deleteOne();
        // 4. Success response
        return sendResponse(res, 200, false, {}, { message: "Container Number deleted successfully!" });

    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
} 
export const getallContainerNoList = async (req, res) => {
    try {
        const containerNumberRecord = await containerNumberModel.find({
            $or: [
                { Invoices: { $exists: false } },
                // { ContainerNumber: "JKL012" }
                { Invoices: { $eq: null } },
                // { ContainerNumber: "GHI789", Invoices: null },
                { Invoices: { $size: 0 } }
                // { ContainerNumber: "DEF456", Invoices: [] },
              ]
      });
      console.log(containerNumberRecord);
      
    //   if (!containerNumberRecord || containerNumberRecord.length === 0) {
    //     return sendResponse(res, 404, true, { general: "No empty containers found" }, null);
    //   }
  
      return sendResponse(res, 200, false, {}, {
          containerNumberRecord,
          message: "Empty container numbers fetched successfully!",
      });
  
    } catch (error) {
      return sendResponse(res, 500, true, { general: error.message }, null);
    }
  };
  