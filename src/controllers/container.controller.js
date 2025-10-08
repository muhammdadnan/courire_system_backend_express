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
          // Inside the loop: for (const s of shipments)

const shipQty = Math.min(s.RemainingPieces, toShip); 
s.RemainingPieces -= shipQty;

// ab sb sy phly find krain gy invoice ko tracking details ki iinvoice sy taky update krskain 
const findInvoice = s.tracking_details.find(detail => {
    return detail.invoiceId === invNo && 
           (detail.containerNumber === null || detail.containerNumber === 'N/A');
});

// double check kra ha 
const detailToUpdate = findInvoice || s.tracking_details[s.tracking_details.length - 1]; 

// agr details to update makxhha to phr
if (detailToUpdate) {
    s.tracking_history.push({
        invoiceId: detailToUpdate.invoiceId, 
        containerNumber: detailToUpdate.containerNumber || 'N/A',
        pieces: detailToUpdate.pieces, 
        oldStatusDate: detailToUpdate.currentStatusDate,
        oldStatus: detailToUpdate.currentStatus,
        // location: fromDestination, // Ya jo bhi purani location thi
        // remarks: `Pieces split/moved to Container ${containerNumber}. Shipped Qty: ${shipQty} pcs.`,
        // slNo: s.tracking_history.length + 1,
    });

    // agr us invice ky pieces bch jaty hain to phr hm us ko tracking details markhain gy with status shipment in godown
    const remainingInOldRecord = detailToUpdate.pieces - shipQty;
    
    if (remainingInOldRecord > 0) {
        // Purana record ab sirf bache hue pieces ko represent karega.
        detailToUpdate.pieces = remainingInOldRecord;
        
        // Aur naya shipped piece ka record push hoga.
        s.tracking_details.push({
            invoiceId: s.InvoiceNo,
            containerNumber: containerNumber,
            pieces: shipQty, 
            currentStatusDate: new Date(),
            currentStatus: status,
            location: toDestination, 
        });
        
    } else {
        // Agar saare pieces ship ho gaye (remainingInOldRecord <= 0), 
        // to isi record ko naye status se update kar do.
        detailToUpdate.containerNumber = containerNumber;
        detailToUpdate.pieces = shipQty; // Total pieces shipped (ya detailToUpdate.pieces)
        detailToUpdate.currentStatusDate = new Date();
        detailToUpdate.currentStatus = status;
        detailToUpdate.location = toDestination;
    }
} else {
    // Agar tracking_details empty hai ya koi match nahi mila
    // Handle error or push new entry
    s.tracking_details.push({
        invoiceId: s.InvoiceNo,
        containerNumber: containerNumber,
        pieces: shipQty,
        currentStatusDate: new Date(),
        currentStatus: status,
        location: toDestination, 
    });
}

// 4. Save the top-level document
await s.save();

toShip -= shipQty;
            }
      }
      console.log(invoices);
      
         // ✅ Step 2: Check if containerNumberModel exists & Invoices is empty
    const containerRecord = await containerNumberModel.findOne({ 
      ContainerNumber: containerNumber });
    
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
export const updateSingleContainer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, true, { general: "Invalid Container ID" }, null);
    }

    const {
      containerNumber,
      fromDestination,
      toDestination,
      invoices,
      status,
      previousInvoices,
    } = req.body;

    if (
      !containerNumber || !fromDestination || !toDestination ||
      !Array.isArray(invoices) || invoices.length === 0 ||
      !status || !Array.isArray(previousInvoices)
    ) {
      return sendResponse(res, 400, true, { general: 'Missing required fields' }, null);
    }

    // Parse invoice strings like "INV001/10" into map { INV001: 10 }
    const parseInvoices = (arr) => {
      const map = {};
      for (const inv of arr) {
        const [invNo, qtyStr] = inv.split('/');
        const qty = parseInt(qtyStr);
        if (invNo && !isNaN(qty)) {
          map[invNo] = qty;
        }
      }
      return map;
    };

    const newInvoiceMap = parseInvoices(invoices);
    const previousInvoiceMap = parseInvoices(previousInvoices);

    const allInvoices = new Set([
      ...Object.keys(newInvoiceMap),
      ...Object.keys(previousInvoiceMap)
    ]);

    for (const invNo of allInvoices) {
      const newQty = newInvoiceMap[invNo] || 0;
      const oldQty = previousInvoiceMap[invNo] || 0;
      const diff = newQty - oldQty;

      if (diff === 0) continue;

      const shipments = await shipmentSchemaModel.find({
        InvoiceNo: { $regex: `^${invNo}/` },
      });

      let remainingDiff = Math.abs(diff);

      for (const s of shipments) {
        if (remainingDiff <= 0) break;

        const totalPieces = s.Pieces ?? s.NoOfPieces ?? 0;

        // Ensure valid RemainingPieces
        if (s.RemainingPieces === undefined || isNaN(s.RemainingPieces)) {
          s.RemainingPieces = totalPieces;
        }

        if (diff > 0) {
          // Invoice quantity INCREASED → subtract from remaining
          const reduceQty = Math.min(s.RemainingPieces, remainingDiff);
          s.RemainingPieces -= reduceQty;
          remainingDiff -= reduceQty;
        } else {
          // Invoice quantity DECREASED or REMOVED → add back to remaining
          const canAddBack = totalPieces - s.RemainingPieces;
          const addBackQty = Math.min(canAddBack, remainingDiff);
          s.RemainingPieces += addBackQty;
          remainingDiff -= addBackQty;
        }

        await s.save();
      }
    }

    // Sync containerNumberModel if previousInvoices match
    const containerRecord = await containerNumberModel.findOne({ ContainerNumber: containerNumber });

    if (containerRecord) {
      const existingInvoices = containerRecord.Invoices || [];
      const isMatching =
        Array.isArray(previousInvoices) &&
        previousInvoices.length === existingInvoices.length &&
        previousInvoices.every((inv, idx) => inv === existingInvoices[idx]);

      if (isMatching) {
        containerRecord.Invoices = invoices;
        await containerRecord.save();
        console.log('Invoices updated in containerNumberModel due to matching previousInvoices');
      }
    }

    const updatedContainer = await containerModel.findByIdAndUpdate(
      id,
      {
        ContainerNumber: containerNumber,
        Destination: {
          From: fromDestination,
          To: toDestination,
        },
        Invoices: invoices,
        Status: status,
      },
      { new: true }
    );

    return sendResponse(res, 200, false, {}, {
      updatedContainer,
      message: 'Container updated successfully',
    });

  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};





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
      { $set: { Status } },
      { new: true }
    );

    if (!updatedContainer) {
      return sendResponse(res, 404, true, { general: "No Container found to update" }, null);
    }

    // ✅ If status is Delivered, set Invoices to null in containerNumberModel
    if (Status.toLowerCase() === 'delivered') {
       await containerNumberModel.findOneAndDelete({
        ContainerNumber: updatedContainer.ContainerNumber
      });
    }

    return sendResponse(res, 200, false, {}, {
      updatedContainer,
      message: "Container updated successfully"
    });
  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};

export const updateBulkContainerStatus = async (req, res) => {
  try {
    const { containers } = req.body;
    // console.log(containers);
    
    if (!Array.isArray(containers) || containers.length === 0) {
      return sendResponse(res, 400, true, { general: "No containers provided" }, null);
    }

    const results = [];

    for (const container of containers) {
      const { id, status } = container;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        results.push({ id, success: false, error: "Invalid ID" });
        continue;
      }

      const updated = await containerModel.findByIdAndUpdate(
        id,
        { $set: { Status: status } },
        { new: true }
      );

      if (updated) {
         // ✅ Delete from containerNumberModel if status is 'delivered'
        if (status.toLowerCase() === 'delivered') {
          await containerNumberModel.findOneAndDelete({
            ContainerNumber: updated.ContainerNumber
          });
        }
        results.push({ id, success: true });
      } else {
        results.push({ id, success: false, error: "Not found" });
      }
    }

    return sendResponse(res, 200, false, {}, {
      message: "Bulk update completed",
      results
    });

  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};



// export const deleteSingleContainer = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return sendResponse(res, 400, true, { general: "Invalid Container ID" }, null);
//     }

//     const container = await containerModel.findById(id);
//     if (!container) {
//       return sendResponse(res, 404, true, { general: "Container not found" }, null);
//     }

//     // // ✅ Only allow delete if status is "Shipment In Container"
//     // if (container.Status !== "Shipment In Container") {
//     //   return sendResponse(res, 400, true, { general: `This container is no more deletable, Status :${container.Status}` }, null);
//     // }
//     // ✅ Allow delete only if status is "Shipment In Container" or "Delivered" (case-insensitive)
//     const statusLower = container.Status?.toLowerCase();
//     if (statusLower !== "shipment in container" && statusLower !== "delivered") {
//       return sendResponse(res, 400, true, {
//         general: `This container is not deletable. Current Status: ${container.Status}`
//       }, null);
//     }

//     // // ✅ Reset invoices in containerNumberModel
//     // await containerNumberModel.findOneAndUpdate(
//     //   { ContainerNumber: container.ContainerNumber },
//     //   { $set: { Invoices: null } }
//     // );

//      // ✅ Delete corresponding containerNumberModel
//     await containerNumberModel.findOneAndDelete({
//       ContainerNumber: container.ContainerNumber
//     });


//     // ✅ For each invoice, find all shipments with InvoiceNo like "123", "123/1", "123/2", etc.
//     for (const fullInvoice of container.Invoices) {
//       const baseInvoice = fullInvoice.split("/")[0];

//       const matchingShipments = await shipmentSchemaModel.find({
//         InvoiceNo: { $regex: `^${baseInvoice}(\\/\\d+)?$` }
//       });

//       for (const shipment of matchingShipments) {
//         shipment.RemainingPieces = shipment.NoOfPieces;
//         await shipment.save();
//       }
//     }

//     // ✅ Finally delete the container
//     await containerModel.findByIdAndDelete(id);

//     return sendResponse(res, 200, false, {}, {
//       message: "Container deleted, invoices reset, and remaining pieces updated successfully."
//     });

//   } catch (error) {
//     console.error("Error deleting container:", error);
//     return sendResponse(res, 500, true, { general: error.message }, null);
//   }
// };

export const deleteSingleContainer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, true, { general: "Invalid Container ID" }, null);
    }

    const container = await containerModel.findById(id);
    if (!container) {
      return sendResponse(res, 404, true, { general: "Container not found" }, null);
    }

    const statusLower = container.Status.toLowerCase();

    // ✅ Only allow deletion if status is either "shipment in container" or "delivered"
    if (
      statusLower !== "shipment in container" &&
      statusLower !== "delivered"
    ) {
      return sendResponse(res, 400, true, {
        general: `Container cannot be deleted. Status: ${container.Status}`,
      }, null);
    }

    // ✅ If container is not delivered, we need to return pieces to shipments
    if (statusLower === "shipment in container") {
      for (const fullInvoice of container.Invoices) {
        const baseInvoice = fullInvoice.split("/")[0];
        const containerInvoiceQty = parseInt(fullInvoice.split("/")[1] || "0");

        const matchingShipments = await shipmentSchemaModel.find({
          InvoiceNo: { $regex: `^${baseInvoice}(\\/\\d+)?$` },
        });

        for (const shipment of matchingShipments) {
          const totalPieces = shipment.NoOfPieces || 0;
          const currentRemaining = shipment.RemainingPieces || 0;
          const addBackQty = Math.min(containerInvoiceQty, totalPieces - currentRemaining);

          shipment.RemainingPieces += addBackQty;
          await shipment.save();
        }
      }
    }

    // ✅ Always delete the corresponding containerNumberModel record
    await containerNumberModel.findOneAndDelete({
      ContainerNumber: container.ContainerNumber,
    });

    // ✅ Finally delete the container itself
    await containerModel.findByIdAndDelete(id);

    return sendResponse(res, 200, false, {}, {
      message: `Container deleted successfully. ${
        statusLower === "shipment in container" ? "Shipments updated." : "Shipments untouched (delivered)."
      }`,
    });
  } catch (error) {
    console.error("Error deleting container:", error);
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};




 