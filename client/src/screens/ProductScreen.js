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
import initReactFastclick from 'react-fastclick';


import { addToCart, addToPrice } from '../actions/cartActions'
import {
  listProductDetails,
  createProductReview,
  deleteProductReview
} from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import axios from 'axios'
import { bold } from 'colors'

const ProductScreen = ( { history, match } ) => {
  initReactFastclick();
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
  const compareReviews = ( x, y ) => {
    for ( let i = 0; i < x.length; i++ ) {
      if ( x[ i ] === y ) {
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

  const CommentDelete = ( review ) => {

    const review_index = compareReviews( product.reviews, review )

    dispatch( deleteProductReview( product._id, review_index ) )



  }
  const addToCartHandler = () => {
    if ( tempPrice === 0 ) {
      setEquals0( "請先選擇選項，再加入購物車" );

    }
    else if ( isMoreThanOne ) {
      setEquals0( "目前購物車只能買一項產品，請你到購物車刪除貨品，或進行付款" )
    }

    // else if(isMoreThanOne){
    //   setCartLimit("每次限買一項產品，如果想結賬或刪除，請至購物車")
    // }
    else {


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
        返回
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
                    text={ `${ product.numReviews } 評價` }
                  />
                </ListGroup.Item>

                <ListGroup.Item>Price: ${ tempPrice }</ListGroup.Item>
                <ListGroup.Item>
                  簡介: { product.description }
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
                      <Col>價錢:</Col>
                      <Col>
                        <strong>${ tempPrice }</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>銷售狀態:</Col>
                      <Col>
                        { product.countInStock > 0 ? '有貨' : '售罄' }
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  { product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>數量</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={ qty }
                            onChange={ ( e ) => setQty( e.target.value ) }
                          >
                            { [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ].map(
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
                        <Select
                          optionRenderer={ option => <div className="needsclick">{ option.label }</div> }
                          defaultValue={ options[ 0 ] }
                          options={ options }
                          onChange={ handleChange }

                        />

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
                      新增至購物車
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>

              <div id="disclaimer" style={ { color: "red", fontWeight: 'bold', fontSize: '12px' } }>
                <h>聲明:</h>
                <p>

                  1.本網站所售遊戲點數卡均為官方卡，全部經正規渠道取貨，請顧客放心購買；
                </p>
                <p> 2.點數卡和遊戲幣、游戲商城商品等兌換比例請自行參照遊戲官網；
                </p>
                <p>  3.點數卡為一次性使用產品，若不是點數卡序號(及密碼)問題，恕不退換，請務必看清商品標題和描述。
                  購買前請確認此卡是否可充值到你的遊戲，如有疑問請到IG查詢或咨詢客服。
                </p>
                <p> 4.請慎防第三方詐騙，所有的聯繫方式均在我們的IG上公布為準，
                  若顧客與第三方交易所造成的損失，本公司將不會承擔。
                  為了確認該筆轉帳帳目為顧客本人操作轉賬，請提供相關資料給客服審核。
                </p>
                <p> 5.請勿將購買到的點數卡序號(及密碼)傳送給任何人，且勿於非官方網站內儲值該點數卡，避免受騙！</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={ 6 }>
              <h2>評價</h2>
              { product.reviews.length === 0 && <Message>No Reviews</Message> }
              <ListGroup variant='flush'>
                { product.reviews.map( ( review ) => (
                  <ListGroup.Item key={ review._id }>
                    <strong>{ review.name }</strong>
                    <Rating value={ review.rating } />
                    <p>{ review.createdAt.substring( 0, 10 ) }</p>
                    <p>{ review.comment }</p>
                    { userInfo &&
                      userInfo.isAdmin && (
                        <button onClick={ () => CommentDelete( review ) }>
                          <i className='fas fa-times' style={ { color: 'red' } }></i>
                        </button>
                      ) }
                  </ListGroup.Item>
                ) ) }
                <ListGroup.Item>
                  <h2>撰寫評論</h2>
                  { successProductReview && (
                    <Message variant='success'>
                      成功上傳
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
                          <option value=''>選擇</option>
                          <option value='1'>1 - 十分差勁</option>
                          <option value='2'>2 - 差勁</option>
                          <option value='3'>3 - 中等</option>
                          <option value='4'>4 - 優質</option>
                          <option value='5'>5 - 十分優質</option>
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
                        提交
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>請登入</Link> 再撰寫評論{ ' ' }
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