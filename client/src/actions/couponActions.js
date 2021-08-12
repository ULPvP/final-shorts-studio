import axios from 'axios'

import {
  COUPON_LIST_REQUEST,
  COUPON_LIST_SUCCESS,
  COUPON_LIST_FAIL,
  COUPON_DETAILS_REQUEST,
  COUPON_DETAILS_SUCCESS,
  COUPON_DETAILS_FAIL,
  COUPON_DELETE_SUCCESS,
  COUPON_DELETE_REQUEST,
  COUPON_DELETE_FAIL,
  COUPON_CREATE_REQUEST,
  COUPON_CREATE_SUCCESS,
  COUPON_CREATE_FAIL,
 
} from '../constants/couponConstants'
import { logout } from './userActions'

export const listCouponByCodeDetails = ( code ) => async ( dispatch,getState ) => {
  try {
    dispatch( { type: COUPON_DELETE_REQUEST } )

    const { data } = await axios.get( `/api/coupons/code/${ code }` )

    dispatch( {
      type: COUPON_DETAILS_SUCCESS,
      payload: data,
    } )
  } catch ( error ) {
    dispatch( {
      type: COUPON_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    } )
  }
}

export const deleteCoupon = ( id ) => async ( dispatch, getState ) => {
  try {
    dispatch( {
      type: COUPON_DELETE_REQUEST,
    } )

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${ userInfo.token }`,
      },
    }

    await axios.delete( `/api/coupons/${ id }`, config )

    dispatch( {
      type: COUPON_DELETE_SUCCESS,
    } )
  } catch ( error ) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if ( message === 'Not authorized, token failed' ) {
      dispatch( logout() )
    }
    dispatch( {
      type: COUPON_DELETE_FAIL,
      payload: message,
    } )
  }
}

export const createCoupon = (data2) => async ( dispatch, getState ) => {
  try {
    dispatch( {
      type: COUPON_CREATE_REQUEST,
    } )

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${ userInfo.token }`,
      },
    }

    const { data } = await axios.post( `/api/coupons`, JSON.stringify(data2) , config )
    .then(res => res.data.id)
    
    dispatch( {
      type: COUPON_CREATE_SUCCESS,
      payload: data,
    } )
  } catch ( error ) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if ( message === 'Not authorized, token failed' ) {
      dispatch( logout() )
    }
    dispatch( {
      type: COUPON_CREATE_FAIL,
      payload: message,
    } )
  }
}

