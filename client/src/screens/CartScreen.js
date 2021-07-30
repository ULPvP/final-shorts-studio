import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart, } from '../actions/cartActions'

import axios from 'axios';
import { saveShippingAddress } from '../actions/cartActions'
const CartScreen = ( { match, location, history } ) => {
  const pre_url_id = window.location.pathname.split( 'cart/' )[ 1 ]
  const url_id = pre_url_id.split( "?" )[ 0 ]
  const [ choiceJson, setChoiceJson ] = useState( [] )
  const productId = match.params.id
  const pre_qty = location.search.split( '=' )[ 1 ]
  const qty = location.search ? Number( pre_qty.split( "?" )[ 0 ] ) : 1
  const optionURL = location.search.split( '=' )[ 2 ]
  const dispatch = useDispatch()

  const cart = useSelector( ( state ) => state.cart )
  const { cartItems } = cart
  const { shippingAddress } = cart
  const [option,setOption] = useState(shippingAddress.option)

  useEffect( () => {
    if ( productId ) {

      console.log(optionURL)
      dispatch( addToCart( productId, qty,optionURL ) )
    }
  }, [ dispatch, productId, qty ] )

  const removeFromCartHandler = ( id ) => {
    dispatch( removeFromCart( id ) )
  }
  const checkoutHandler = () => {
    
    history.push( `/login?redirect=shipping` )
  }
  axios.get( `/api/products/${ url_id }` ).then( res => {
    setChoiceJson( JSON.parse( res.data.choicesObj ) )
  } )
  const price_list = choiceJson.map( item => Object.values( item )[ 1 ] )
  const thePrice = price_list[ optionURL ]



  return (
    <Row>
      <Col md={ 8 }>
        <h1>Shopping Cart</h1>
        { cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            { cartItems.map( ( item ) => (
              <ListGroup.Item key={ item.product }>
                <Row>
                  <Col md={ 2 }>
                    <Image src={ item.image } alt={ item.name } fluid rounded />
                  </Col>
                  <Col md={ 3 }>
                    <Link to={ `/product/${ item.product }` }>{ item.name }</Link>
                  </Col>
                  <Col md={ 2 }>${ thePrice }</Col>
                  <Col md={ 2 }>
                    <Form.Control
                      as='select'
                      value={ item.qty }
                      onChange={ ( e ) =>
                        dispatch(
                          addToCart( item.product, Number( e.target.value ) )
                        )
                      }
                    >
                      { [ ...Array( item.countInStock ).keys() ].map( ( x ) => (
                        <option key={ x + 1 } value={ x + 1 }>
                          { x + 1 }
                        </option>
                      ) ) }
                    </Form.Control>
                  </Col>
                  <Col md={ 2 }>
                    <Button
                      type='button'
                      variant='light'
                      onClick={ () => removeFromCartHandler( item.product ) }
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ) ) }
          </ListGroup>
        ) }
      </Col>
      <Col md={ 4 }>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({ cartItems.reduce( ( acc, item ) => acc + item.qty, 0 ) })
                items
              </h2>
              $
              { cartItems
                .reduce( ( acc, item ) => acc + item.qty * thePrice, 0 )
                .toFixed( 2 ) }
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={ cartItems.length === 0 }
                onClick={ checkoutHandler }
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
