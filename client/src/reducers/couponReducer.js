import {
    
  } from '../constants/couponConstants'
  
  export const couponCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case COUPON_CREATE_REQUEST:
        return {
          loading: true,
        }
      case COUPON_CREATE_SUCCESS:
        return {
          loading: false,
          success: true,
          coupon: action.payload,
        }
      case COUPON_CREATE_FAIL:
        return {
          loading: false,
          error: action.payload,
        }
      case COUPON_CREATE_RESET:
        return {}
      default:
        return state
    }
  }
  
export const couponDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case COUPON_DELETE_REQUEST:
        return { loading: true }
      case COUPON_DELETE_SUCCESS:
        return { loading: false, success: true }
      case COUPON_DELETE_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
  }
  
  export const couponDetailsReducer = (
    state = { loading: true, couponItems: [], shippingAddress: {} },
    action
  ) => {
    switch (action.type) {
      case COUPON_DETAILS_REQUEST:
        return {
          ...state,
          loading: true,
        }
      case COUPON_DETAILS_SUCCESS:
        return {
          loading: false,
          coupon: action.payload,
        }
      case COUPON_DETAILS_FAIL:
        return {
          loading: false,
          error: action.payload,
        }
      default:
        return state
    }
  }
  

  
  
  export const couponListMyReducer = (state = { coupons: [] }, action) => {
    switch (action.type) {
      case COUPON_LIST_MY_REQUEST:
        return {
          loading: true,
        }
      case COUPON_LIST_MY_SUCCESS:
        return {
          loading: false,
          coupons: action.payload,
        }
      case COUPON_LIST_MY_FAIL:
        return {
          loading: false,
          error: action.payload,
        }
      case COUPON_LIST_MY_RESET:
        return { coupons: [] }
      default:
        return state
    }
  }
  
  export const couponListReducer = (state = { coupons: [] }, action) => {
    switch (action.type) {
      case COUPON_LIST_REQUEST:
        return {
          loading: true,
        }
      case COUPON_LIST_SUCCESS:
        return {
          loading: false,
          coupons: action.payload,
        }
      case COUPON_LIST_FAIL:
        return {
          loading: false,
          error: action.payload,
        }
      default:
        return state
    }
  }
  