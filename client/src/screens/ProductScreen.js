import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import Select from 'react-select'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


import { addToCart, addToPrice } from '../actions/cartActions'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import axios from 'axios'
import { bold } from 'colors'

const ProductScreen = ( { history, match } ) => {
  const [ qty, setQty ] = useState( 1 )
  const [ rating, setRating ] = useState( 0 )
  const [ comment, setComment ] = useState( '' )
  const [ cartLimit, setCartLimit ] = useState( '' )


  const dispatch = useDispatch()
  const [ equals0, setEquals0, ] = useState( "" )
  const productDetails = useSelector( ( state ) => state.productDetails )
  const { loading, error, product } = productDetails
  const [ option, setOption ] = useState( 0 );
  const userLogin = useSelector( ( state ) => state.userLogin )
  const { userInfo } = userLogin
  const [ orderPrice, setOrderPrice ] = useState( 0 )
  const productReviewCreate = useSelector( ( state ) => state.productReviewCreate )
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate
  const [ choiceJson, setChoiceJson ] = useState( [] )
  const options = [

  ]

  //
  const compareObject = ( x, y ) => {
    for ( let i = 0; i < x.length; i++ ) {
      if ( x[ i ].value === y.value ) {
        return i
      }
    }
  }
  const url_id = window.location.pathname.split( 'product/' )[ 1 ]

  axios.get( `/api/products/${ url_id }` ).then( res => {
    setChoiceJson( JSON.parse( res.data.choicesObj ) )
  } )
  const cart = useSelector( ( state ) => state.cart )
  const { cartItems } = cart
  const isMoreThanOne = cartItems.length >= 1


  const choice_list = choiceJson.map( item => Object.values( item )[ 0 ] )
  for ( let i = 0; i < choice_list.length; i++ ) {

    options.push( { value: choice_list[ i ], label: choice_list[ i ] } )
    //console.log(choice_list[i])
  }
  //price_list
  const price_list = choiceJson.map( item => Object.values( item )[ 1 ] )
  //console.log(price_list)
  const [ tempPrice, setTempPrice ] = useState( 0 )
  // .then((res) => { res.data } )

  //const choice_list = product.choicesObj
  const handleChange = ( option ) => {
    if ( option !== undefined ) {


      const price_index = compareObject( options, option )

      // ***
      setOption( price_index );
      const pre_tempPrice = price_list[ price_index ]
      setTempPrice( pre_tempPrice )
      // const compareIndex = options.findIndex(tempPrice.price)
    }



  }
  useEffect( () => {

    if ( successProductReview ) {
      setRating( 0 )
      setComment( '' )
    }


    if ( !product._id || product._id !== match.params.id ) {
      dispatch( listProductDetails( match.params.id ) )
      dispatch( { type: PRODUCT_CREATE_REVIEW_RESET } )
    }
  }, [ dispatch, match, successProductReview ] )

  const addToCartHandler = () => {
    if ( tempPrice === 0 ) {
      setEquals0( "請先選擇選項，再加入購物車" );

    }
    else if(isMoreThanOne){
      setCartLimit("每次限買一項產品，如果想結賬或刪除，請至購物車")
    }
    else {

      console.log( tempPrice )
      history.push( `/cart/${ match.params.id }?qty=${ qty }?option=${ option }` )
      //setTempPrice( tempPrice )
    }
  }
  const submitHandler = ( e ) => {
    e.preventDefault()
    dispatch(
      createProductReview( match.params.id, {
        rating,
        comment,
      } )
    )
  }






  //const result = Object.assign([1], JSON.parse(product_choice));


  return (
    <>

      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      { loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{ error }</Message>
      ) : (
        <>
          <Meta title={ product.name } />
          <Row>
            <Col md={ 6 }>
              <Image src={ product.image } alt={ product.name } fluid />
            </Col>
            <Col md={ 3 }>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{ product.name }</h3>

                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={ product.rating }
                    text={ `${ product.numReviews } reviews` }
                  />
                </ListGroup.Item>

                <ListGroup.Item>Price: ${ tempPrice }</ListGroup.Item>
                <ListGroup.Item>
                  Description: { product.description }
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={ 3 }>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <strong id="equals0" style={ { color: 'red', fontWeight: 'bold' } } >{ equals0 }</strong>
                      <strong id="moreThanOne" style={ { color: 'red', fontWeight: 'bold' } } >{ cartLimit }</strong>

                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${ tempPrice }</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        { product.countInStock > 0 ? 'In Stock' : 'Out Of Stock' }
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  { product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={ qty }
                            onChange={ ( e ) => setQty( e.target.value ) }
                          >
                            { [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ].map(
                              ( x ) => (
                                <option key={ x + 1 } value={ x + 1 }>
                                  { x + 1 }
                                </option>
                              )
                            ) }
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ) }


                  <ListGroup.Item>
                    <Row>
                      <Col>選項</Col>
                      <Col>
                        <Dropdown options={ options } onChange={ handleChange } value={ tempPrice } placeholder="請選擇" />;

                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Button
                      onClick={ addToCartHandler }
                      className='btn-block'
                      type='button'
                      disabled={ product.countInStock === 0 }
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={ 6 }>
              <h2>Reviews</h2>
              { product.reviews.length === 0 && <Message>No Reviews</Message> }
              <ListGroup variant='flush'>
                { product.reviews.map( ( review ) => (
                  <ListGroup.Item key={ review._id }>
                    <strong>{ review.name }</strong>
                    <Rating value={ review.rating } />
                    <p>{ review.createdAt.substring( 0, 10 ) }</p>
                    <p>{ review.comment }</p>
                  </ListGroup.Item>
                ) ) }
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  { successProductReview && (
                    <Message variant='success'>
                      Review submitted successfully
                    </Message>
                  ) }
                  { loadingProductReview && <Loader /> }
                  { errorProductReview && (
                    <Message variant='danger'>{ errorProductReview }</Message>
                  ) }
                  { userInfo ? (
                    <Form onSubmit={ submitHandler }>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={ rating }
                          onChange={ ( e ) => setRating( e.target.value ) }
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={ comment }
                          onChange={ ( e ) => setComment( e.target.value ) }
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={ loadingProductReview }
                        type='submit'
                        variant='primary'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review{ ' ' }
                    </Message>
                  ) }
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      ) }

    </>

  )
}

export default ProductScreen
