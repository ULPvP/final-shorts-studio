import React, { useEffect,setState,useState } from 'react'
// import { LinkContainer } from 'react-router-bootstrap'
import { Table,Col,Button,Row } from 'react-bootstrap'
import axios from 'axios'
import { useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listCouponDetails, deleteCoupon } from '../actions/couponActions'
import './Admin.css'

//

const CouponListScreen = ({ history }) => {
  const dispatch = useDispatch()
  const [coupons,setCoupons] = useState([]) 
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }


    axios.get("/api/coupons",config)
    .then(response => setCoupons(response.data))
  

const createCouponHandler = () =>{

  history.push("/admin/couponCreate")
}
 
    // console.log(allCoupons)
const removeCoupon = (coupon) =>{
  // console.log(coupon)
  if(window.confirm('Are you sure?')){
  axios.delete(`/api/coupons/${coupon._id}`,config)
 
  }
  
  // console.log(userInfo.token)
}
   


  return (
    
    <> 
    
    <Row className='align-items-center'>
        <Col>
          <h1>Coupons</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createCouponHandler}>
            <i className='fas fa-plus'></i> Create Coupon
          </Button>
        </Col>
      </Row>

        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Expiry</th>
              <th>Minium Consume Price</th>
              <th>Specific Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.reverse().map((coupon) => (
              <tr key={coupon.code}>
                <td>{coupon.code}</td>
                <td>{coupon.discount}</td>
                <td>{coupon.expiry}</td>
                <td>{coupon.minConsumeLimit}</td>
                <td>{coupon.specificCategory}</td> 
                <td> 
                  <button>
                  <i class="fas fa-trash-alt"  style={{color: 'red'}}onClick={() => removeCoupon(coupon)}></i> 
                  </button>
                   </td>
        
              </tr>
            ))}
          </tbody>
        </Table>
      
    </>
  )
}

export default CouponListScreen