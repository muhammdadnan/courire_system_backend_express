import {sendResponse} from '../helpers/sendResponse.js'
import containerModel from '../models/container.model.js'
export const addContainerController = async (req, res) => {
    try {
        const { containerNumber,
            supplierName,
            portName,
            fromDestination,
            toDestination,
            totalBuilty,
            containerShipmentNumber
        } = req.body
        console.log(req.body);
        
        const newContainer = new containerModel({
            ContainerNumber:containerNumber,
            SupplierName: supplierName,
            PortName: portName,
            Destination: {
                From:fromDestination,To:toDestination
            },
            ContainerShipmentNumber:containerShipmentNumber,
            TotalBuilty:totalBuilty
        }) 
        await newContainer.save()
        return sendResponse(res, 200,false,{}, {newContainer,message:"Container Add Successfully"});
    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
}