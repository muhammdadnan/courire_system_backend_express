import mongoose from 'mongoose'
const shipmentSchema = new mongoose.Schema({
    SenderName: { type: String, required: true },
    SenderMobile: { type: String, required: true },
    SenderIdNumber: { type: String, required: true },
    SenderAddress: { type: String, required: true },
    SenderArea: { type: String,required: true },

    ReceiverName: { type: String, required: true },
    ReceiverMobile1: { type: String, required: true },
    ReceiverMobile2: { type: String ,required: true},
    ReceiverAddress: { type: String, required: true },
    ReceiverArea: { type: String, required: true },

    ItemDetails: { type: String },
    OtherDetails: { type: String },

    NoOfPieces: { type: Number, required: true },
  RemainingPieces: {
    type: Number, required: true,
    default: function () {
      return this.NoOfPieces;
    }
  },

    Branch: { type: String, required: true },
    BookingDate: { type: String,required: true }, // format: YYYY-MM-DD

    Charges: {
        FreightCharges: {
            enabled: { type: Boolean, default: false },
            unitRate: { type: Number, default: 0 },
            qty: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
        },
        Insurance: {
            enabled: { type: Boolean, default: false },
            unitRate: { type: Number, default: 0 },
            qty: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
          },
          Packing: {
            enabled: { type: Boolean, default: false },
            unitRate: { type: Number, default: 0 },
            qty: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
        },
        Customs: {
            enabled: { type: Boolean, default: false },
            unitRate: { type: Number, default: 0 },
            qty: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
          },
          Clearance: {
            enabled: { type: Boolean, default: false },
            unitRate: { type: Number, default: 0 },
            qty: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
          },
          OtherCharges: {
            enabled: { type: Boolean, default: false },
            unitRate: { type: Number, default: 0 },
            qty: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
          },
          Discount: {
            enabled: { type: Boolean, default: false },
            unitRate: { type: Number, default: 0 },
            qty: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
          },
    },
    SubTotal: { type: Number,required: true },
    Vat: { type: Number },
    VatTotal: { type: Number },
    InvoiceTotal: { type: Number,required: true },
    
    AmountInWords: { type: String,required: true },
    
    BiltyNo: { type: String,required: true },
  InvoiceNo: { type: String,required: true },
    City:{type:String,required: true}
    
}, {
    timestamps:true
}) 

const shipmentSchemaModel = mongoose.model('shipmentSchemas', shipmentSchema)

export default shipmentSchemaModel
