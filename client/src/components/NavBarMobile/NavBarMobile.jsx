import React, { useContext, useEffect } from "react";
import "./navbarMobile.scss";
import { Col, Row } from "react-bootstrap";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import { PersonFill, Gear, BoxArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { deleteLocalStorage } from "../../../../server/utils/localStorageUtils";
import { ModalAddProduct } from "../ModalAddProduct/ModalAddProduct";

export const NavBarMobile = ({ resetCount }) => {
  const navigate = useNavigate();
  const [userArticles, setUserArticles] = useState([]);
  const { user, setUser, setToken, showCartFill, setShowCartFill } =
    useContext(ClainbowContext);
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [show, setShow] = useState(false);
  const [cartCount, setCartCount] = useState();
  const handleClose = () => setShowOffCanvas(false);
  const handleShow = () => setShowOffCanvas(true);
  const logOut = () => {
    deleteLocalStorage("token");
    setUser();
    setToken();
    navigate("/");
  };
  useEffect(() => {
    let cartArray = localStorage.getItem(`cart${user?.user_id}`);
    if (cartArray) {
      setShowCartFill(true);
      setCartCount(productCount(JSON.parse(cartArray)));
    } else {
      setShowCartFill(false);
    }
  }, [resetCount, user]);

  const productCount = (data) => {
    // Reduce: devuelve el acumulado de elementos de un array

    let res = data?.reduce((total, elem) => {
      return total + elem.amount;
    }, 0);
    return res;
  };
  const onClickCart = () => {
    if (showCartFill) {
      navigate("/cart");
    }
  };
  const showModal = () => {
    setShow(true);
  };
  const closeModal = () => {
    setShow(false);
  };
 
  return (
    

      <Row className="gran d-flex justify-content-center align-items-center gap-3
      ">
        {user ? (
           <>
        <Col className="p-0 d-flex justify-content-center align-items-center ">
       
          <button
            onClick={()=>navigate('/')}
            className="amor-modified"
          >
            <img className="casa" src="/assets/icons/casa.png" alt="" />
            <h3>Home</h3>
          </button>
        </Col>
        <Col className="p-0 d-flex justify-content-center align-items-center">
        <button
            onClick={()=>navigate('/allArticles')}
            className="amor-modified"
          >
            <img className="articles" src="/assets/icons/articles.png" alt="" />
            <h3>Articles</h3>
          </button>  
        </Col>
        <Col className="p-0 d-flex justify-content-center align-items-center position-relative">
          <button
            className="amor-modified"
            onClick={onClickCart}
          >
            { showCartFill ? (
              <img className="bag" src="/assets/icons/bolsaFill.png" alt="" />
            ) : (<img src="/assets/icons/bolsaCompra.png" alt="" />)}
         
            <h3>Cart</h3>
            
          </button>
            <p className="shopAmount">{cartCount}</p>
          
        </Col>
        <Col className=" p-0 d-flex justify-content-center align-items-center">
          <button className="amor-modified"
           onClick={handleShow}>
            <img
            className="rounded-circle"
             
             
              src={
                user?.user_img
                  ? `http://localhost:3000/images/users/${user.user_img}`
                  : "/assets/icons/default_user.png"
              }
              alt="UserProfilepic"
            />

            <h3>My profile</h3>
          </button>

          <Offcanvas show={showOffCanvas} onHide={handleClose} style={{ maxWidth: "80%", width: "300px" }}>
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body className="offbody">
              <div className="myprof" onClick={() =>{handleClose(); navigate("/userProfile");}}>
                <div className="myprof2">
                  <PersonFill />
                </div>
                <h4>My profile</h4>
              </div>
              <div className="myprof" onClick={() => {handleClose(); navigate("/settings"); }}>
                <div className="myprof2">
                  <Gear />
                </div>
                <h4>Settings</h4>
              </div>
              <div className="myprof" onClick={() => { logOut(); handleClose(); }}>
                <div className="myprof2">
                  <BoxArrowLeft />
                </div>
                <h4>LogOut</h4>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </Col>
     
      <ModalAddProduct
        show={show}
        showModal={showModal}
        userArticles={userArticles}
        setUserArticles={setUserArticles}
        closeModal={closeModal}
      />
      </>
        ) : (
          <>
          <Col className="p-0 d-flex justify-content-center align-items-center ">
          <button
            onClick={()=>navigate('/')}
            className="amor-modified"
          >
            <img className="casa" src="/assets/icons/casa.png" alt="" />
            <h3>Home</h3>
          </button>
        </Col>
          <Col className="p-0 d-flex justify-content-center align-items-center ">
          <button
            onClick={()=>navigate('/allArticles')}
            className="amor-modified"
          >
            <img className="articles" src="/assets/icons/articles.png" alt="" />
            <h3>Articles</h3>
          </button>  
        </Col>
          <Col className="p-0 d-flex justify-content-center align-items-center ">
          <button
            onClick={()=>navigate('/login')}
            className="amor-modified"
          >
            <img className="signins" src="/assets/icons/signin.png" alt="" />
            <h3>SignIn</h3>
          </button>  
        </Col>
          <Col className="p-0 d-flex justify-content-center align-items-center ">
          <button
            onClick={()=>navigate('/register01')}
            className="amor-modified"
          >
            <img className="signins" src="/assets/icons/signup.png" alt="" />
            <h3>SignUp</h3>
          </button>  
        </Col>
        </>
      
      )}
      </Row>
  );
};

