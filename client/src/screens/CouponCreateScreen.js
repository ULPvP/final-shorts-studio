import React, { useEffect,useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { Link } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import axios from 'axios'
import {createCoupon} from '../actions/couponActions'
// import {
//   listCouponDetails,
//   deleteCoupon,
//   createCoupon,
// } from '../actions/couponActions'
// import { COUPON_CREATE_RESET } from '../constants/couponConstants'

export default function CouponList() {

  const [code,setCode]= useState("")
    const [discount,setDiscount] = useState(0)
     const [expiry,setExpiry] = useState(new Date())
      const [minConsumeLimit,setMinConsumeLimit] = useState(0)
      const [specificCategory,setSpecificCategory] = useState("")
   
      const [infoMsg,setInfoMsg] = useState("")
      const [infoMsgColor,setInfoMsgColor] = useState("white")
      const dispatch = useDispatch()




  
    const userLogin = useSelector( ( state ) => state.userLogin )
    const { userInfo } = userLogin
   
    const config = {
      headers: {
        Authorization: `Bearer ${ userInfo.token }`,
      },
    }
    
    const submitHandler = (e) => {
      e.preventDefault()
      const couponArray = {
        code: code,
        discount: discount,
        expiry: expiry,
        minConsumeLimit: minConsumeLimit,
        specificCategory: specificCategory,
}   
      // console.log(couponArray)
    //   const requestOptions = {
    //     method: 'POST',
    //     headers: config,
    //     body: parser.json(couponArray)
    // };


    axios.post('/api/coupons/', couponArray,config)
    .then(response => response)
    setInfoMsgColor("green")
    setInfoMsg("創建成功")
  
}

    const handleCodeChange = ( event ) => {
      const target = event.target;
      const value = event.target.value
      

      setCode(value)
    }

    const handleDiscountChange = ( event ) => {
      const target = event.target;
      const value = event.target.value


      setDiscount(value)
    }

    const handleExpiryChange = ( event ) => {
      const target = event.target;
      const value = event.target.value
  

      setExpiry(value)
    }

    const handleMinConsumeLimitChange = ( event ) => {
      const target = event.target;
      const value = event.target.value


      setMinConsumeLimit(value)
    }

    const handleSpecificCategoryChange = ( event ) => {
      const target = event.target;
      const value = event.target.value


      setSpecificCategory(value)
    }

    return (
      <>
        <Link to='/admin/couponList' className='btn btn-light my-3'>
          Go Back
        </Link>
        <FormContainer>
          <h1 style={{backgroundColor:infoMsgColor}}>{infoMsg}</h1>
          <h1>Create Coupon</h1>

          <Form onSubmit={ submitHandler }>
            <Form.Group controlId='code'>
              <Form.Label>Coupon Discount Code</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Code'
                value={ code }
                onChange={ handleCodeChange }
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='discount'>
              <Form.Label>Discount(Percentage of discount)</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Discount'
                value={ discount }
                onChange={ handleDiscountChange }
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='expiry'>
              <Form.Label>Expire Date</Form.Label>
              <Form.Control
                type='date'
                placeholder='Enter the date for the coupon expiry'
                value={ expiry }
                onChange={ handleExpiryChange }
              ></Form.Control>

            </Form.Group>

            <Form.Group controlId='minConsumeLimit'>
              <Form.Label>Minium Consume Price</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Minium Consume Price'
                value={ minConsumeLimit }
                onChange={ handleMinConsumeLimitChange }
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='specificCategory'>
              <Form.Label>Specific Category(!!If NO,TYPE: 0!!)</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Specific Category'
                value={ specificCategory }
                onChange={ handleSpecificCategoryChange }
              ></Form.Control>
            </Form.Group>








            <Button type='submit' variant='primary'>
              Create
            </Button>
          </Form>

        </FormContainer>
      </>

    )
  }
