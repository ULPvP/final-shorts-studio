import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
const [choicesObj,setChoicesObj] = useState()

const [inputList, setInputList] = useState([{ choice: "", price: "" }]);
const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id
    const [choicesObj,setChoicesObj] = useState()
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
  
    const dispatch = useDispatch()
  
    const productDetails = useSelector((state) => state.productDetails)
    const { loading, error, product } = productDetails
  
    const productUpdate = useSelector((state) => state.productUpdate)
    const {
      loading: loadingUpdate,
      error: errorUpdate,
      success: successUpdate,
    } = productUpdate
  
    useEffect(() => {
      if (successUpdate) {
        dispatch({ type: PRODUCT_UPDATE_RESET })
        history.push('/admin/productlist')
      } else {
        if (!product.name || product._id !== productId) {
          dispatch(listProductDetails(productId))
        } else {
          setName(product.name)
          setPrice(product.price)
          setImage(product.image)
          setBrand(product.brand)
          setCategory(product.category)
          setCountInStock(product.countInStock)
          setDescription(product.description)
  
        }
      }
    }, [dispatch, history, productId, product, successUpdate])
// handle input change
const handleInputChange = (e, index) => {
  const { name, value } = e.target;
  const list = [...inputList];
  list[index][name] = value;
  setInputList(list);
  setChoicesObj(JSON.stringify(inputList))
};

// handle click event of the Remove button
const handleRemoveClick = index => {
  const list = [...inputList];
  list.splice(index, 1);
  setInputList(list);
};

// handle click event of the Add button
const handleAddClick = () => {
  setInputList([...inputList, { choice: "", price: "" }]);
};

{inputList.map((x, i) => {
    return (
      <div className="box" key="">
        <input
          name="choice"
          placeholder="選擇"
          value={x.choice}
          onChange={e => handleInputChange(e, i)}
        />
        <input
          className="ml10"
          name="price"
          placeholder="價錢"
          value={x.price}
          onChange={e => handleInputChange(e, i)}
        />
        <div className="btn-box">
          {inputList.length !== 1 && <button
            className="mr10"
            onClick={() => handleRemoveClick(i)}>Remove</button>}
          {inputList.length - 1 === i && <button onClick={handleAddClick}>Add</button>}
        </div>
      </div>
    );
  })}