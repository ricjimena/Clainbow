import React, { useContext, useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.scss";
import {
  ArrowRight,
  Bag,
  BagFill,
  BoxArrowLeft,
  BoxSeam,
  Gear,
  House,
  InfoCircle,
  PersonFill,
  Send,
} from "react-bootstrap-icons";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import { deleteLocalStorage } from "../../../../server/utils/localStorageUtils";

export const NavbarApp = ({ resetCount, setPrivacy, screenWidth }) => {
  const { user, setUser, token, setToken, showCartFill, setShowCartFill } =
    useContext(ClainbowContext);
  const [cartCount, setCartCount] = useState();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

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
      setShow(false);
    }
  };

  const logOut = () => {
    deleteLocalStorage("token");
    setUser();
    setToken();
    navigate("/");
    setShow(false);
  };

  return (
    <>

  

    
    
    <Navbar expand="lg" className="big fixed-top nav-ppal">
        <Container fluid>
          <Navbar.Brand className="logoNavbar" as={Link} to="/">
            <img src="./assets/images/IsologoClainbow.png" alt="" />
          </Navbar.Brand>

          {screenWidth > 1000 &&

            <>
                   <Navbar.Toggle
            onClick={() => setShow(!show)}
            aria-controls="basic-navbar-nav"
          />

          
<Navbar.Collapse
          in={show}
          /*  className="d-flex justify-content-between" */
          id="basic-navbar-nav"
        >
     
            <Nav className="navbarRutas d-flex">


              <Nav.Link onClick={() => setShow(false)} as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link
                onClick={() => setShow(false)}
                as={Link}
                to="/allArticles"
              >
                Articles
              </Nav.Link>
              <Nav.Link onClick={() => setShow(false)} as={Link} to="/about">
                About us
              </Nav.Link>
              <Nav.Link
                onClick={() => setShow(false)}
                as={Link}
                to="/contact"
              >
                Contacts
              </Nav.Link>



            </Nav>
     
        </Navbar.Collapse>


            </>
     



          }

          
         
          {user ? (
                  <div className="botonesLogged  d-flex gap-4">
                    <NavDropdown
                      drop="start"
                      className="dropdownNavbar"
                      title={
                        <img
                          src={
                            user?.user_img
                              ? `http://localhost:3000/images/users/${user.user_img}`
                              : "/assets/icons/default_user.png"
                          }
                          alt="UserProfilepic"
                        />
                      }
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Item
                        className="jaula"
                        onClick={() => setPrivacy()}
                        as={Link}
                        to="/userProfile"
                      >
                        <div>
                          <PersonFill />
                          <p>My profile</p>
                        </div>
                        <ArrowRight />
                      </NavDropdown.Item>

                      {screenWidth < 1000 &&
<>
<NavDropdown.Item
  className="jaula"
  onClick={() => setPrivacy()}
  as={Link}
  to="/"
  >
  <div>
    <House />
    <p>Home</p>
  </div>
  <ArrowRight />
  </NavDropdown.Item>
  
  <NavDropdown.Item
  className="jaula"
  as={Link}
  to="/allArticles"
  >
  <div>
    <BoxSeam />
    <p>Articles</p>
  </div>
  <ArrowRight />
  </NavDropdown.Item>

  <NavDropdown.Item
  className="jaula"
  as={Link}
  to="/about"
  >
  <div>
    <InfoCircle />
    <p>About us</p>
  </div>
  <ArrowRight />
  </NavDropdown.Item>

  <NavDropdown.Item
  className="jaula"
  as={Link}
  to="/contact"
  >
  <div>
    <Send />
    <p>Contact</p>
  </div>
  <ArrowRight />
  </NavDropdown.Item>



</>



                      }



                      <NavDropdown.Item
                        className="jaula"
                        as={Link}
                        to="/settings"
                      >
                        <div>
                          <Gear />
                          <p> Settings</p>
                        </div>
                        <ArrowRight />
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={logOut} className="jaula">
                        <div>
                          <BoxArrowLeft />
                          <p> LogOut</p>
                        </div>
                        <ArrowRight />
                      </NavDropdown.Item>






                    </NavDropdown>
                    <div onClick={onClickCart}>
                      {showCartFill ? (
                        <>
                          <div>
                            <BagFill className="imagenCarritoyFavs" />
                            <p className="shoppingAmount">{cartCount}</p>
                          </div>
                        </>
                      ) : (
                        <Bag className="imagenCarritoyFavs" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="botones d-flex gap-4">
                    <button onClick={() => navigate("/login")}>Sign In</button>
                    <button onClick={() => navigate("/register01")}>
                      Sign Up
                    </button>
                  </div>
                )}
           
        </Container>
      </Navbar>


 
     
 
    
    </>





  );
};
