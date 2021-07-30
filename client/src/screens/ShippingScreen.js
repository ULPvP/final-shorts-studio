import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart
  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)
  const [acc,setAcc] = useState(shippingAddress.acc)
  const [phone,setPhone] = useState(shippingAddress.phone)
  const dispatch = useDispatch()
  
  const submitHandler = (e) => {


    e.preventDefault()
    dispatch(saveShippingAddress({address, city, postalCode, country,acc,phone }))
    history.push('/payment')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping（沒有的填0則可）</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>


        <Form.Group controlId='acc'>
          <Form.Label>賬號資料/附加資訊</Form.Label>
          <Form.Control
            type='text'
            placeholder='請輸入基本的賬號登入資料，例如密碼以及賬號名稱、電郵等等'
            value={acc}
            required
            onChange={(e) => setAcc(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='phone'>
          <Form.Label>電話號碼</Form.Label>
          <Form.Control
            type='text'
            placeholder='例如：+852 55558888'
            value={phone}
            required
            onChange={(e) => setPhone(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter country'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
