import mongoose from 'mongoose'

const containerSchema = new mongoose.Schema({
    ContainerNumber: { type: String, required: true },
    SupplierName: { type: String, required: true },
    PortName: { type: String, required: true },
    Destination: {
        From: {
            type: String,
            required: true,
          },
          To: {
            type: String,
            required: true,
          },
    },
    TotalBuilty:{ type: Number, required: true },
}, {
    timestamps:true
})

const containerModel = mongoose.model('containerBookings', containerSchema)

export default containerModel