import mongoose from 'mongoose'
const shipmentSchema = new mongoose.Schema({
    BiltyNo: {type: String,required: true},
    InvoiceNo: {type: String,required: true},
    SenderName: {type: String,required: true},
    SenderAddressDetail: {type: String,required: true},
    SenderMobile: {type: Number,required: true},
    SenderCity: {type: String,required: true},
    SenderOtherDetails: { type: String },
    ReceiverName: {type: String,required: true},
    ReceiverAddressDetail: {type: String,required: true},
    ReceiverMobile: {type: Number,required: true},
    ReceiverCity: {type: String,required: true},
    ReceiverOtherDetail: {type: String},
    NoOfPieces: {type: Number,required: true},
    BranchName: {type: String,required: true},
    DetailOfItems: { type: String },
    // cargo
    UnitRate: {type: Number,required: true},
    TotalWeight: {type: Number,required: true},
    TotalAmount: {type: Number,required: true},
    Customs: {type: Number},
    Packaging: {type: Number},
    Shipping: {type: Number},
    Clearance: {type: Number},
    VAT: {type: Number},
    VAT_Value: {type: Number},
    OtherCharges: {type: Number},
    TotalInvoiceAmount: {type: Number},
    PublishDate: { type: Date, default: Date.now, }
}, {
    timestamps:true
}) 

const shipmentSchemaModel = mongoose.model('shipmentSchemas', shipmentSchema)

export default shipmentSchemaModel
