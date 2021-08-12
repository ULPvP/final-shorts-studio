import React, { useState, useEffect,useCallback } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import result from './PaymentResult';

import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

const OrderScreen = ( { match, history } ) => {
  const orderId = match.params.id
  const option = localStorage.getItem( 'option' )
  const [ sdkReady, setSdkReady ] = useState( false )
  const [ choiceJson, setChoiceJson ] = useState( [] )
  const dispatch = useDispatch()

  const orderDetails = useSelector( ( state ) => state.orderDetails )
  const { order, loading, error } = orderDetails

  const orderPay = useSelector( ( state ) => state.orderPay )
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector( ( state ) => state.orderDeliver )
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver
  const userLogin = useSelector( ( state ) => state.userLogin )
  const { userInfo } = userLogin
  const [ productArr, setProductArr ] = useState( [] )
  const [ productPrice, setProductPrice ] = useState( 100 )
  const [ productOption, setProduceOption ] = useState( "" )
  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
    
    const getInfos = () => {
      
      const discountPrice = order.totalPrice
      const productID = order.orderItems.map(item => item.product)
      axios.get( `/api/products/${ productID[0] }` ).then( res => {
        setChoiceJson( JSON.parse( res.data.choicesObj ) )
        if(choiceJson.length !== 0){
        setProductArr( choiceJson[ option ] )
        if (productArr ) {
  
          setProductPrice( Math.abs(((discountPrice - productArr.price )/ productArr.price) *100 ))
          setProduceOption( productArr.choice )
          
        }
        }
      } )
    }
    getInfos()
  }


    
      

// }
  useEffect( () => {

    
      
  
    
    if ( !userInfo ) {
      history.push( '/login' )
    }

  

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get( '/api/config/paypal' )
      const script = document.createElement( 'script' )
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${ clientId }`
      script.async = true
      script.onload = () => {
        setSdkReady( true )
      }
      document.body.appendChild( script )
    }

    if ( !order || successPay || successDeliver || order._id !== orderId ) {
      dispatch( { type: ORDER_PAY_RESET } )
      dispatch( { type: ORDER_DELIVER_RESET } )
      dispatch( getOrderDetails( orderId ) )
    } else if ( !order.isPaid ) {
      if ( !window.paypal ) {
        addPayPalScript()
      } else {
        setSdkReady( true )
      }
    }
  }, [ dispatch, orderId, successPay, successDeliver, order ] )
  
  

  const successPaymentHandler = ( paymentResult ) => {

    dispatch( payOrder( orderId, result ) )
  }

 
  const deliverHandler = () => {
    dispatch( deliverOrder( order ) )
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{ error }</Message>
  ) : (
    <>
      <h1>Order { order._id }</h1>
      <Row>
        <Col md={ 8 }>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h1 id="topic-guide">已收到你的訂單，請先開支付寶HK掃描QR-Code，我們會在確認你已經付款後立即進行代儲，感謝您的等待</h1>
              <img id="qr-code" src="https://cdn.discordapp.com/attachments/699134700547211274/870653607207378984/Screenshot_20210730-210612_AlipayHK.jpg"></img>
              <h2>Shipping</h2>

              <p>
                <strong>Name: </strong> { order.user.name }
              </p>
              <p>
                <strong>Email: </strong>{ ' ' }
                <a href={ `mailto:${ order.user.email }` }>{ order.user.email }</a>
              </p>
              <p>
                <strong>Address:</strong>
                { order.shippingAddress.address }, { order.shippingAddress.city }{ ' ' }
                { order.shippingAddress.postalCode },{ ' ' }
                { order.shippingAddress.country },{ '\n' }
                <br />
                <strong id="phone-text">Phone Numbers:</strong>
                { order.shippingAddress.phone },{ '\n' }
                <br />
                <strong id="acc-text">Account Details:</strong>
                <br />
                { order.shippingAddress.acc }{ '\n' }
              </p>

              { order.isDelivered ? (
                <Message variant='success'>
                  已發貨
                </Message>
              ) : (
                <Message variant='danger'>訂單尚未完成，並將在完成後在此顯示完成，如一段時間沒回應，請刷新本頁或者聯係工作室，謝謝</Message>
              ) }
            </ListGroup.Item>

            <ListGroup.Item>

            </ListGroup.Item>

            <ListGroup.Item>
              <h2>已購買貨品</h2>
              { order.orderItems.length === 0 ? (
                <Message>沒有貨品</Message>
              ) : (

                <ListGroup variant='flush'>
                  { order.orderItems.map( ( item, index ) => (
                    <ListGroup.Item key={ index }>
                      <Row>
                        <Col md={ 1 }>
                          <Image
                            src={ item.image }
                            alt={ item.name }
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={ `/product/${ item.product }` }>
                            { item.name }

                          </Link>
                          <p>選項:{ productOption }</p>
                        </Col>
                        <Col md={ 4 }>
                        
                          { item.qty } x ${ item.price } = ${ item.qty * item.price } 折扣:({ productPrice }%)
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ) ) }
                </ListGroup>
              ) }
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={ 4 }>
          <Card>


            <ListGroup.Item>
              <h2>訂單總結</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>貨品</Col>
                <Col>${ order.itemsPrice }</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>發貨方法</Col>
                <Col>${ order.shippingPrice }</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>稅</Col>
                <Col>${ order.taxPrice }</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>總計</Col>
                <Col>${ order.totalPrice }</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup variant='flush'>
              { !order.isPaid && (
                <ListGroup.Item>
                  { loadingPay && <Loader /> }
                  { !sdkReady ? (
                    <Loader />
                  ) : (
                    <div></div>
                  ) }
                </ListGroup.Item>
              ) }
              { loadingDeliver && <Loader /> }
              { userInfo &&
                userInfo.isAdmin &&

                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={ deliverHandler }
                    >
                      標示訂單已完成
                    </Button>
                  </ListGroup.Item>
                ) }

            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
