import mongoose from 'mongoose'
const shipmentSchema = new mongoose.Schema({
    trackingId: {type:Number,required:true},
    invoiceNo: {type:Number,required: true},
}, {
    timestamps:true
}) 

const shipmentSchemaModel = mongoose.model('shipmentSchemas', shipmentSchema)

export default shipmentSchemaModel
// const shipmentSchema = new mongoose.Schema({
//     BookName: {type: String,required: true},
//     BiltyNo: {typStringrequired: true},
//     InvoiceNo: {typString,required: true},
//     SenderName: {type: String,required: true},
//     AddressDetail: {type: String,required: true},
//     Mobile: {type: Number,required: true},
//     City: {type: String,required: true},
//     OtherDetail: {type: String,required: true},
//     Mobile: {type: String,required: true},
//     ReceiverName: {type: String,required: true},
//     AddressDetail: {type: String,required: true},
//     Mobile: {type: Number,required: true},
//     City: {type: String,required: true},
//     OtherDetail: {type: String,required: true},
//     NoOfPieces: {type: Number,required: true},
//     DetailOfItems: {type: String,required: true},
//     BranchName: {type: String,required: true},
//     UnitRate: {type: Number,required: true},
//     TotalWeight: {type: Number,required: true},
//     TotalAmount: {type: Number,required: true},
//     Customs: {type: Number},
//     Packaging: {type: Number},
//     Shipping: {type: Number},
//     Clearance: {type: Number},
//     VAT: {type: Number},
//     Others: {type: Number},
//     TotalInvoiceAmount: {type: Number},
//   });