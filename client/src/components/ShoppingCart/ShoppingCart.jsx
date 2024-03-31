import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BagFill, CurrencyDollar, XCircleFill } from 'react-bootstrap-icons'
import './shoppingCart.scss'

export const ShoppingCart = ({article_id, amount, onDelete}) => {

  const [orderArticle, setOrderArticle] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(()=>{
    axios
      .get(`http://localhost:3000/articles/shoppingCart/${article_id}`)
      .then((res)=>{
        setOrderArticle({
          article_id,
          article_name : res.data[0].article_name,
          resource_name : res.data[0].resource_name,
          description : res.data[0].description,
          price : res.data[0].price,
          amount});
        
      })
      .catch((err)=>console.log(err))
  },[refresh, article_id, amount])

  return (

    <div>
      <div>
        <br />
          </div>
          <div className="shopping-div">
            <div className="cart-container">
              <div className="img-cont">
                <img
                  className="cart-img"
                  src={`http://localhost:3000/images/articles/${
                  orderArticle?.resource_name ? orderArticle.resource_name : "default.png"}`} alt="Article Image"
                />
              </div>
            </div>
            <div className='d-flex flex-column gap-3 article'>
              <h3>{orderArticle?.article_name}</h3>
              <div className='shoppingQuantity'><BagFill/> x {orderArticle?.amount}</div>
              
              <h5 className="priced"><CurrencyDollar/> {orderArticle?.price}</h5>
            </div>
            <div className='description'>
              {orderArticle?.description}
            </div>
            <div className='deleteFromCart'>
              <XCircleFill 
                onClick={()=> onDelete(orderArticle?.article_id)}/>
            </div>
         
          </div>
    </div>

  )
}
