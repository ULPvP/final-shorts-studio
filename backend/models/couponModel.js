import mongoose from 'mongoose'
const couponSchema = mongoose.Schema(
    {
      code: { type: String, required: true },
      discount: { type: Number, required: true },
      expiry: { type: Date, required: true },
      minConsumeLimit: { type: Number, required: true },
      specificCategory: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )

const Coupon = mongoose.model( 'Coupon', couponSchema )
export default Coupon