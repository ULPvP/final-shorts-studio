import express from 'express'
const router = express.Router()
import {
    getCouponByCode,
    createCoupon,
    deleteCoupon,
    getCoupons,
    isValidCoupon,
    findCodeDetails
} from '../controllers/couponController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect,createCoupon).get(protect,admin,getCoupons )
// router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect,getCouponByCode).delete(protect,admin,deleteCoupon)
router.route('/valid/:id').get(protect,admin,isValidCoupon)
router.route('/code/:id').get(protect,admin,findCodeDetails)
// router.route('/:id/pay').put(protect, updateOrderToPaid)
// router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

export default router