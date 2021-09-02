import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card, InputGroup, FormControl } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart, } from '../actions/cartActions'
import { listProductDetails } from '../actions/productActions'
import axios from 'axios';
import { saveShippingAddress } from '../actions/cartActions'
import { listCouponByCodeDetails } from '../actions/couponActions'
import { compareSync } from 'bcryptjs'
const CartScreen = ( { match, location, history } ) => {




  const pre_url_id = window.location.pathname.split( 'cart/' )[ 1 ]
  const url_id = /*pre_url_id.split( "?" )[ 0 ]*/ match.params.id
  const [ choiceJson, setChoiceJson ] = useState( [] )
  const productId = match.params.id
  const pre_qty = location.search.split( '=' )[ 1 ]
  const qty = location.search ? Number( pre_qty.split( "?" )[ 0 ] ) : 1
  const optionURL = location.search.split( '=' )[ 2 ]
  const dispatch = useDispatch()
  const userLogin = useSelector( ( state ) => state.userLogin )
  const { userInfo } = userLogin
  const cart = useSelector( ( state ) => state.cart )
  const { cartItems } = cart
  const cartItems_productID = cartItems.map( item => item.product )
  const cartItems_productPrice = cartItems.map( item => item.price )

  const { shippingAddress } = cart
  const [ option, setOption ] = useState( shippingAddress.option )
  const [ activeDiscount, setActiveDiscount ] = useState( 100 )
  const [ couponExistsState, setCouponExistsState ] = useState( false )
  const [ couponDetailsState, setCouponDetailsState ] = useState( {} )
  const [ couponWarning, setCouponWarning ] = useState( "" )
  const [ allCartItems_Category, setAllCartItemsCategory ] = useState( [] )
  const accessibleProductID = cartItems.map( ( item ) => item.product )
  const accessibleOptionURL = cartItems.map( ( item ) => item )
  const cartPrice = cartItems.map( ( item ) => item.price )
  const [ coupon_use_count, setCoupon_use_count ] = useState( 0 )
  const [ inputCode, setInputCode ] = useState( "" )
  const [ discountFormula, setDiscountFormula ] = useState( "" )
  const [ warningColor, setWarningColor ] = useState( "white" )
  const [ finalCode, setFinalCode ] = useState( "" )

  const initDiscount = 100
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTI5YjUzZTRlYTY1MDAxNWIyOGJkYiIsImlhdCI6MTYzMDU4NjEyNCwiZXhwIjoxNjMzMTc4MTI0fQ.SXcWmAQrKCfofh8-imU9Pdn9ebEGQZP9m0aIP47lvkw" }`,
    },
  }

  useEffect( () => {



    if ( productId ) {

      dispatch( addToCart( productId, qty, optionURL, initDiscount ) )
      // let cartItemsArr = JSON.parse(localStorage.getItem( "cartItems" ))
      // let price = cartItemsArr.map(item => item.price)

      localStorage.setItem( "qty", qty )
      localStorage.setItem( "option", optionURL );



    }
  }, [ dispatch, productId, qty, optionURL, initDiscount ] )

  const removeFromCartHandler = ( id ) => {
    dispatch( removeFromCart( id ) )
    localStorage.removeItem( "cartItems" )

  }
  const checkoutHandler = () => {

    history.push( `/login?redirect=shipping` )
  }
  axios.get( `/api/products/${ url_id }` ).then( res => {
    setChoiceJson( JSON.parse( res.data.choicesObj ) )
  } )
  const qtyOnChange = ( e ) => {

    localStorage.setItem( "qty", e.target.value )
    history.push( `/cart/${ accessibleProductID }/?qty=${ localStorage.getItem( "qty" ) }?option=${ localStorage.getItem( "option" ) }` )
    const price_list = choiceJson.map( item => Object.values( item )[ 1 ] )
    const thePrice = price_list[ optionURL ]


  }

  // for ( let i = 0; i < cartItems_productID.length; i++ ) {
  //   allCartItems_Category1.push( productCategory( cartItems_productID[ i ] ) )


  const getInfos = useCallback( ( code ) => {
    axios.get( `/api/coupons/code/${ code }`, config ).then( res => setCouponDetailsState( res.data[ 0 ] ) ).
      catch( err => console.error( err ) );




    axios.get( `/api/coupons/valid/${ code }`, config )
      .then( res => setCouponExistsState( res.data ) )


  }, [ couponDetailsState, couponExistsState, allCartItems_Category ] )



  const couponOnChange = ( e ) => {
    setInputCode( e.target.value )

  }


  // }
  // console.log(allCartItems_Category)
  // for (let j = 0 ; j <cartItems.length -1 ; j++){
  //   findProductCategory(cartItems_productID[ j]).then(res => setAllCartItemsCategory([...allCartItems_Category,res.data]))

  //  }
  //Category Submission

  const couponSubmit = ( e ) => {
    e.preventDefault()
    // console.log()
    getInfos( inputCode )

    if ( couponExistsState === false || !couponDetailsState ) {
      console.log( couponExistsState )
      setWarningColor( "red" )

      setCouponWarning( "請輸入正確優惠碼" )

    }
    else if ( cartPrice < couponDetailsState.minConsumeLimit ) {
      setWarningColor( "red" )


      setCouponWarning( "你還沒達到最低消費金額" )
    }
    else if ( couponDetailsState.specificCategory !== "None"
      && couponDetailsState.specificCategory !== "0"
      && allCartItems_Category !== couponDetailsState.specificCategory ) {
      setWarningColor( "red" )

      setCouponWarning( "你目前沒有一個產品類別是可以用此優惠卷的" )


    }
    else if ( coupon_use_count >= 1 ) {
      setWarningColor( "red" )
      setCouponWarning( "每次限制用一次優惠卷" )
    }
    else {
      setCoupon_use_count( coupon_use_count + 1 )
      
      setWarningColor( "green" )
      setCouponWarning( "兌換成功，請等待以上金額轉了之後進行結賬" )
      setActiveDiscount( couponDetailsState.discount )


      dispatch( addToCart( productId, qty, optionURL, couponDetailsState.discount ) ).catch( err =>
        err instanceof TypeError ? console.error( "Type Error is current issue" ) : "" )

    }



  }
  //console.log(cartItems)
  return (

    <Row>


      <Col md={ 8 }>
        <h1>購物車</h1>
        { cartItems.length === 0 ? (
          <Message>
            你的購物車目前是空的 <Link to='/'>按此返回</Link>
          </Message>
        ) :

          location.pathname === "/cart" ? history.push( `/cart/${ accessibleProductID }/?qty=${ localStorage.getItem( "qty" ) }?option=${ localStorage.getItem( "option" ) }` ) :
            (
              <ListGroup variant='flush'>

                { cartItems.map( ( item ) => (
                  <ListGroup.Item key={ item }>
                    <Row>
                      <Col md={ 2 }>
                        <Image src={ item.image } alt={ item.name } fluid rounded />
                      </Col>
                      <Col md={ 3 }>
                        <Link to={ `/product/${ item.product }` }>{ item.name }</Link>
                      </Col>
                      <Col md={ 2 }>${ item.price }</Col>
                      <Col md={ 2 }>
                        <Form.Control
                          as='select'
                          value={ localStorage.getItem( "qty" ) }
                          onChange={ qtyOnChange
                          }
                        >
                          { [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ].map( ( x ) => (
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
        <form onSubmit={ couponSubmit } >
          <InputGroup className="mb-3"  >
            <InputGroup.Text id="inputGroup-sizing-default">優惠碼序號(如有)</InputGroup.Text>
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              // value={ inputCode }
              onChange={ couponOnChange }

            />
            <Button as="input" id="redeem-btn" type="submit" value="兌換" />{ ' ' }
          </InputGroup>
        </form>
        <p style={ { color: warningColor, fontWeight: 'bold', fontSize: '30px' } }>{ couponWarning }</p>
      </Col>
      <Col md={ 4 }>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                小計 ({ cartItems.reduce( ( acc, item ) => acc + item.qty, 0 ) })
                個貨品
              </h2>
              ${ cartItems
                .reduce( ( acc, item ) => acc + item.qty * item.price, 0 )
                .toFixed( 2 ) }
              <h2>
                優惠:{ activeDiscount === 100 ? "沒有" : activeDiscount + "折" }
                
              </h2>
         
              {/* <h2>{ discountFormula }</h2> */ }
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={ cartItems.length === 0 }
                onClick={ checkoutHandler }
              >
                進行結賬
              </Button>
            </ListGroup.Item>
          </ListGroup>

        </Card>

      </Col>
    </Row>
  )
}

export default CartScreen
