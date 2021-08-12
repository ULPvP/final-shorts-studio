import asyncHandler from 'express-async-handler'
import Coupon from '../models/couponModel.js'
const getCouponByCode = asyncHandler( async ( req, res ) => {
    const coupon = await Coupon.findById( req.params.id )

    if ( coupon ) {
        res.json( coupon )
    } else {
        res.json( { message: "Coupon Not Found" } )
        throw new Error( 'Coupon not found' )
    }
} )
const isValidCoupon = asyncHandler( async ( req, res ) => {
    const CouponObject = await Coupon.find( {} )

    const reqCode = req.params.id

    const allCouponCode = []
    CouponObject.filter( coupon => allCouponCode.push( coupon.code ) )
    // const couponID= coupon.map(item => Object.values(item)[0])[0]._id
    res.json( allCouponCode.includes( reqCode ) )
    // res.json(reqCode)

} )
const findCodeDetails = asyncHandler( async ( req, res ) => {
    const reqCode = req.params.id
    const CouponObject = await Coupon.find( { code: reqCode } )


    res.json( CouponObject )


} )
const deleteCoupon = asyncHandler( async ( req, res ) => {
    const coupon = await Coupon.findById( req.params.id )

    if ( coupon ) {
        await coupon.remove()

        await res.json( { message: 'Coupon removed' } )
    } else {
        res.status( 404 )
        await res.json( { message: 'Coupon not found' } )
    }
} )

const getCoupons = asyncHandler( async ( req, res ) => {
    await Coupon.find( {} )
        .then( items => res.json( items ) )
} )

const createCoupon = asyncHandler( async ( req, res ) => {

    const {
        code,
        discount,
        expiry,
        minConsumeLimit,
        specificCategory
    } = req.body
    const coupon = await Coupon.findOne( { code: req.params.code } )
    if ( coupon ) {
        await res.json( { message: 'Coupon Is Already Exist' } )
    } else {


        const newCoupon = new Coupon( {
            code: code,
            discount: discount,
            expiry: expiry,
            minConsumeLimit: minConsumeLimit,
            specificCategory: specificCategory,

        } )
        const JSONCoupon = newCoupon
        const createdCoupon = await JSONCoupon.save()
        res.status( 201 ).json( createdCoupon )
        console.log( createdCoupon )

    }
} )
export {
    getCouponByCode,
    createCoupon,
    deleteCoupon,
    isValidCoupon,
    getCoupons,
    findCodeDetails,
}