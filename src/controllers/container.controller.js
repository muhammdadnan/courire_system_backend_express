import {sendResponse} from '../helpers/sendResponse.js'
import containerModel from '../models/container.model.js'
import shipmentSchemaModel from '../models/shipmentSchema.model.js';
import containerNumberModel from '../models/containerNumber.model.js';
import mongoose from 'mongoose'

export const addContainerController = async (req, res) => {
    try {
        const {
            containerNumber,
            fromDestination,
            toDestination,
            invoices,
            status
        } = req.body;
        console.log(req.body);
        
          
        if (!containerNumber || !fromDestination || !toDestination || !Array.isArray(invoices) || invoices.length === 0 || !status) {
            return sendResponse(res, 400, true, { general: 'Missing required fields' }, null);
        }
        
        for (const inv of invoices) {
            const [invNo, shippedStr] = inv.split("/");
            const shipped = parseInt(shippedStr);
          
            if (!invNo || isNaN(shipped)) continue;
          
            const shipments = await shipmentSchemaModel.find({
              InvoiceNo: { $regex: `^${invNo}/` },
            });
          
            let toShip = shipped;
          
            for (const s of shipments) {
              if (toShip <= 0) break;
          
              if (s.RemainingPieces === undefined) s.RemainingPieces = s.Pieces;
          
              const shipQty = Math.min(s.RemainingPieces, toShip); // 👈 correct calculation

    s.RemainingPieces -= shipQty;
    await s.save();

    toShip -= shipQty;
            }
      }
      console.log(invoices);
      
         // ✅ Step 2: Check if containerNumberModel exists & Invoices is empty
    const containerRecord = await containerNumberModel.findOne({ ContainerNumber: containerNumber });
    
    if (containerRecord && (!containerRecord.Invoices || containerRecord.Invoices.length === 0)) {
      // Assign new invoices
      containerRecord.Invoices = invoices;
      await containerRecord.save();
    }
            
        const newContainer = new containerModel({
            ContainerNumber: containerNumber,
            Destination: {
              From: fromDestination,
              To: toDestination,
            },
            Invoices: invoices,
            Status: status,
          });
        
        await newContainer.save();
        
         
          return sendResponse(
            res,
            200,
            false,
            {},
            { newContainer, message: 'Container added successfully' }
          );
    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
}

export const getallContainersList = async (req, res) => {
    try {
        const containersList = await containerModel.find()
        return sendResponse(res, 200,false,{}, {containersList,message:"Get all container "});
    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
} 

export const getSinglelContainer = async (req, res) => {
    try {
        const { id } = req.params 
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
              return sendResponse(res, 400, true, { general: "Invalid Container ID" }, null);
            }
        const foundContainer = await containerModel.findById(id)
        if (!foundContainer) {
            return sendResponse(res, 404, true, { general: "No Container found" }, null);
            
        }
        return sendResponse(res, 200,false,{}, {foundContainer,message:"Container Found Successfully"});
    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
} 
export const updateSinglelContainerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, true, { general: "Invalid Container ID" }, null);
    }

    const { Status } = req.body;

const updatedContainer = await containerModel.findByIdAndUpdate(
  id,
  { $set: { Status } }, // wrap Status inside an object
  { new: true }
);


    if (!updatedContainer) {
      return sendResponse(res, 404, true, { general: "No Container found to update" }, null);
    }

    return sendResponse(res, 200, false, {}, {
      updatedContainer,
      message: "Container updated successfully"
    });
  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};
 