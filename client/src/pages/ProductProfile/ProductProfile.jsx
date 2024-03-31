import React, { useContext, useEffect } from "react";
import { Row, Col, Button, Carousel } from "react-bootstrap";
import { useState } from "react";
import "./productProfile.scss";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import { DashLg, GeoAltFill, Heart, HeartFill, PlusLg } from "react-bootstrap-icons";
import { ArticlesMayLike } from "../../components/ArticlesMayLike/ArticlesMayLike";
import { Footer } from "../../components/Footer/Footer";

export const ProductProfile = ({ resetCount, setResetCount }) => {

  const { user, setShowCartFill, likes, setLikes } = useContext(ClainbowContext);
  const [oneArticle, setOneArticle] = useState();
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState();
  const [images, setImages] = useState([]);
  const [like, setLike] = useState(false);
  const { id } = useParams();
  const [productsMayLike, setProductsMayLike] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const prevLocation = useLocation();
  const [prueba, setPrueba] = useState()

  const initialState = {
    user_id: user?.user_id,
    article_id: id,
  };
  const [articleLikeInfo, setArticleLikeInfo] = useState(initialState);



  useEffect(() => {

    axios
      .get(`http://localhost:3000/articles/oneArticle/${id}`)
      .then((res) => {
        const articleData = res.data[0];
        
        setOneArticle({
          user_name: res.data[0].name,
          article_id: id,
          user_last_name: res.data[0].last_name,
          user_img: res.data[0].user_img,
          city: res.data[0].city,
          country: res.data[0].country,
          article_creator: res.data[0].creator_user_id,
          article_name: res.data[0].article_name,
          price: res.data[0].price,
          description: res.data[0].description,
          resource_name: res.data[0].resource_name,
          category_id: res.data[0].category_id,
        });
        setPrueba(prevLocation.state.from)
        setTotalPrice((articleData.price * quantity).toFixed(2));
        setImages(res.data.map((e) => e.resource_name));
      })
      .catch((err) => console.log(err));
  }, [quantity, id]);

  const handleQuantity = (operation) => {
    if (operation === "restar") {
      if (quantity > 0) {
        setQuantity(quantity - 1);
      }
    } else if (operation === "sumar") {
      setQuantity(quantity + 1);
    }
  };

  const giveLike = () => {
    //objeto para el ciclo de vida de react
    let stateInfoLike = initialState;

    if (!like) {
      setArticleLikeInfo(stateInfoLike);
      axios
        .post("http://localhost:3000/articles/addLike", stateInfoLike)
        .then((res) => {
          setLikes([...likes, initialState]);
        })
        .catch();

      setLike(true);
    } else {
      axios
        .delete(
          `http://localhost:3000/articles/deleteLike/${user.user_id}/${id}`
        )
        .then((res) => {
          setLikes(likes.filter((e) => e.article_id != id));
        })
        .catch();
      setLike(false);
      setArticleLikeInfo();
    }
  };  

  const onSubmit = () => {
    let article_id = id;

    let amount = quantity;

    if (amount !== 0) {
      let cartArray = localStorage.getItem(`cart${user?.user_id}`);

      if (cartArray == null) {
        cartArray = [];
      } else {
        cartArray = JSON.parse(cartArray);
      }

      let found = false;

      for (let i = 0; i < cartArray.length && !found; i++) {
        if (cartArray[i].article_id == article_id) {
          cartArray[i].amount += amount;
          found = true;
        }
      }

      if (!found) {
        cartArray.push({
          article_id,
          price: oneArticle.price,
          amount,
        });
      }

      cartArray = JSON.stringify(cartArray);
      let nameCart = `cart${user.user_id}`
      localStorage.setItem(nameCart, cartArray);
      setResetCount(!resetCount);
      setShowCartFill(true);
      navigate("/allArticles");
    } else {
      setErrorMessage(
        "Please select the amount of articles to add to your cart"
      );
    }
  };

  useEffect(() => {
    if (oneArticle) {
      const { category_id, article_id } = oneArticle;

      if (productsMayLike) {
        axios
          .get(
            `http://localhost:3000/articles/getArticlesMayLike/${article_id}/${category_id}`
          )
          .then((res) => {
            setProductsMayLike(res.data);
          })
          .catch((err) => console.log(err));
      }
    }
  }, [oneArticle]);

  return (
    <>
      <Row className="product-bg">
        <Button
          className="m-4"
          style={{
            backgroundColor: "#B88D19",
            color: "white",
            borderRadius: "20px",
            width: "100px",
            transition: "transform 0.3s",
            border: "none",
            padding: "8px",
          }}
          onClick={()=>navigate(-1)}
          onMouseEnter={(e) => (e.target.style.transform = "scale(0.95)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          {" "}
          Back
        </Button>

        <div className="cont-bg d-flex p-0">
          <Col xs={12} sm={6} className="left-col">
     
          <Carousel slide={false} className="h-100">
            {images?.map((e, index) => (
              <Carousel.Item key={index} className="h-100">
                {e?.endsWith(".mp4") ? ( // Verificar si el archivo es un video
                  <video className="h-100" autoPlay loop muted controls>
                    <source src={`http://localhost:3000/images/articles/${e}`} type="video/mp4" />
                  </video>
                ) : ( // Si no es un video, mostrar la imagen
                  <img className="h-100" src={`http://localhost:3000/images/articles/${e ? e : "default.png"}`} alt="" />
                )}
              </Carousel.Item>
            ))}
          </Carousel>
          
          </Col>
          <Col  xs={12} sm={6} className="right-col">
            <div className="cont-right-col h-100 d-flex flex-column justify-content-between ">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex img-user align-items-center gap-3">
                  <img
                    src={
                      oneArticle?.user_img
                        ? `http://localhost:3000/images/users/${oneArticle?.user_img  }`
                        : "/assets/icons/default_user.png"
                    }
                    alt=""
                  />
                  <div>
                     <p className="name">
                    {oneArticle?.user_name} {oneArticle?.user_last_name}
                  </p>
                  <p className="location">              
                    <GeoAltFill />
                    {user ?
                    <>{oneArticle?.city}, {oneArticle?.country}</>
                    :
                    <>{oneArticle?.city}, {oneArticle?.country}</>}              
                    </p>
                  </div>
                 
                </div>
                <div className="heart-icon" onClick={giveLike}>
                  {like ? <HeartFill /> : <Heart />}
                </div>
              </div>
              <div className="d-flex flex-column gap-3">
                <h3 className="article_name mt-2">{oneArticle?.article_name}</h3>
                <p className="price">$ {oneArticle?.price}</p>
                <h5 className="mb-0">Description</h5>
                <hr />
                <p className="description_oneArticle">{oneArticle?.description}</p>
                <hr />
              </div>
              
              {user && oneArticle?.article_creator !== user?.user_id ? 
                <>
                 {prueba !== '/userProfile' && <>        
                 
              <div className="d-flex justify-content-around gap-5">
                <div className="d-flex flex-column gap-3">
                  <h5>Quantity</h5>

                  <div className="d-flex cajita-negra">
                    <span
                      className="contador"
                      onClick={() => handleQuantity("restar")}
                    >
                      <DashLg/>
                    </span>
                    <span>{quantity}</span>
                    <span
                      className="contador"
                      onClick={() => handleQuantity("sumar")}
                    >
                      <PlusLg/>
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  <h5>Total Price</h5>

                  <div className="cajita-negra">${totalPrice}</div>
                </div>
              </div>
              <div>
                <p className="errorMessage">{errorMessage}</p>
                        
                <div className="d-flex justify-content-center">
                  <Button variant="warning down-but" onClick={onSubmit}>Add to Cart</Button>
                </div>          
              </div>
              </>}
              </> 
              :
              user?.user_id !== oneArticle?.article_creator ?
              <div className="text-center">
                <p>Are you interested in this article?</p>
                <p>Please sign into your account for further details</p>
                
                {prueba !== "/userProfile" &&
                <Button
               className="ms-1 me-1"
               style={{
                 backgroundColor: '#B88D19', 
                 color: 'white',          
                 borderRadius: '20px',  
                 width: '100px',  
                 transition: 'transform 0.3s',      
                 border: 'none',
                 padding:'8px'       
               }}
               onClick={()=>navigate('/login')}
               onMouseEnter={(e) => e.target.style.transform = 'scale(0.95)'} 
               onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} 
             > Sign in
                  </Button> }
              </div>
              : null
              }
             
            </div>
          </Col>    
    </div>
    </Row>

    {prueba !== '/userProfile' && <>
   
      <Row className="maylike-bg">
         <Col className="d-flex justify-content-center">
         <ArticlesMayLike
            productsMayLike={productsMayLike}
            setProductsMayLike={setProductsMayLike}
            />
        
         </Col>
      </Row>
      </> }
        <Footer/> 

    </>
  );
};
