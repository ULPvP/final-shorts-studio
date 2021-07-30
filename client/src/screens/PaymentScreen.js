import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  if (!shippingAddress.address) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('AlipayHK')

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>付款方式</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>選擇付款方式</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='AlipayHK(支付寶HK)'
              id='AlipayHK'
              name='paymentMethod'
              value='AlipayHK'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
           
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          繼續
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
