import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ShoppingCart } from "../../components/ShoppingCart/ShoppingCart";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {Footer} from "../../components/Footer/Footer"
import("./cartApp.scss");

export const CartApp = ({resetCount, setResetCount}) => {

  const { setShowCartFill, user } = useContext(ClainbowContext);
  
  const [shoppingCart, setShoppingCart] = useState([])
  const [finalPrice, setFinalPrice] = useState(0)
  const [totalArticles, setTotalArticles] = useState(0)
  

  const navigate = useNavigate();

  useEffect(()=>{
    if(user){
      let cartArray = localStorage.getItem(`cart${user?.user_id}`);
      
      setShoppingCart(JSON.parse(cartArray));
      // setRefresh(true);
      if (cartArray){
        setFinalPrice(calculateTotals(JSON.parse(cartArray)).totalPrice)
        setTotalArticles(calculateTotals(JSON.parse(cartArray)).totalItems)
      }
     
    }
  
  },[resetCount, user]);  

  const onDelete = (id) => {
    let prueba = shoppingCart.filter((e)=> e.article_id != id);
    if (prueba.length !== 0){
      setShoppingCart(prueba);
      setResetCount(!resetCount);
      localStorage.setItem(`cart${user.user_id}`, JSON.stringify(prueba));
    }
    else {
      setShowCartFill(false);
      localStorage.removeItem(`cart${user.user_id}`);
      navigate(-1);      
    }
  }

  const calculateTotals = (arrayArticles) => {
    let totalPrice = 0;
    let totalItems = 0;

    arrayArticles.forEach(element => {
      totalItems += element.amount;
      totalPrice += (element.price * element.amount);
    });

    totalPrice = totalPrice.toFixed(2);

    return {
      totalPrice,
      totalItems
    }
  }

  const onSubmit = () => {
    const {user_id} = user; 
    if (user_id) {
             
      axios
        .post(`http://localhost:3000/articles/orderArticles/${user_id}`, shoppingCart)
        .then((res)=>{
          localStorage.removeItem(`cart${user.user_id}`);
          setShowCartFill(false);
          navigate('/userProfile');
        })
        .catch((err)=>console.log(err))

     
    }
  }

  return (
    <>
    <Container className="cart-bg">
      <Row className="cart-div">
        <Col xs={12} md={8}>
        <h3 className="cart-title">Shopping Cart</h3>
          {shoppingCart?.map((elem, i)=> (
            <div key={i}>
              <ShoppingCart 
                onDelete = {onDelete}
                article_id = {elem?.article_id}
                amount = {elem?.amount}/>
               
            </div>
            
          ))}
          
        </Col>
        <Col xs={12} md={4}className="right-cart">
          <div>
            <h4>Summary</h4>
            <hr />
            <div className="summary">
              <div>
                <h5>Total articles:</h5>
                <h5>{totalArticles}</h5>
              </div>
               <div>
                <h5>Total Price:</h5>
                <h5>$ {finalPrice}</h5>
              </div>
              <div className="d-flex flex-column pay-cond">
                <p><strong>Payment Conditions</strong></p>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iure tempora esse beatae sapiente deleniti rerum voluptatem hic, dolore ab voluptatum quasi. Qui sed temporibus perferendis dolores distinctio officia, exercitationem voluptatibus dolorem unde et esse dignissimos amet aspernatur cupiditate repudiandae ipsum. Officia temporibus debitis possimus autem excepturi ipsa ab exercitationem mollitia!</p>
              </div>
              <Button 
              
              className="mt-2 confirm"
              style={{
                backgroundColor: "#B88D19",
                color: "white",
                borderRadius: "20px",
                width: "80%",
                transition: "transform 0.3s",
                border: "none",
                alignSelf: "center"
              }}
              onClick={onSubmit}            
              onMouseEnter={(e) => (e.target.style.transform = "scale(0.95)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >Confirm Payment</Button>
            </div>
            
          </div>
        
        </Col>
      </Row>
    </Container>
    <footer><Footer/></footer>
 
    </>
  );
};
