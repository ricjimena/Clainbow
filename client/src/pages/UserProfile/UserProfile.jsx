import React, { useContext, useEffect, useState } from "react";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import axios from "axios";
import { Button, Col, Row } from "react-bootstrap";
import "./userProfile.scss";
import {
  BoxSeam,
  CashStack,
  Envelope,
  GeoAlt,
  Passport,
  Telephone,
} from "react-bootstrap-icons";
import { UserProductsGallery } from "../../components/UserProductsGallery/UserProductsGallery";
import { UserLikedArticlesGallery } from "../../components/UserLikedArticlesGallery/UserLikedArticlesGallery";
import { UserCloset } from "../../components/UserCloset/UserCloset";
import { ModalAddProduct } from "../../components/ModalAddProduct/ModalAddProduct";
import { Footer } from "../../components/Footer/Footer";

export const UserProfile = ({
  isPublic,
  setIsPublic,
  isChecked,
  setIsChecked,
  screenWidth,
}) => {
  const { user, likes, setLikes } = useContext(ClainbowContext);
  //Array vacío para meter AllArticles
  const [userArticles, setUserArticles] = useState([]);
  //Array vacío para meter LikedArticles
  const [likedArticles, setLikedArticles] = useState([]);
  //Array vacío para meter artículos comprados (Closet)
  const [orderedArticles, setOrderedArticles] = useState([]);
  //Booleano para mostrar el modal de AddArticle
  const [show, setShow] = useState(false);
  //Booleano para mostrar los AllArticles
  const [userAllArticles, setUserAllArticles] = useState(false);
  //Booleano para mostrar los likedArticles
  const [userLikedArticles, setUserLikedArticles] = useState(false);
  //Booleano para mostrar el Closet
  const [userCloset, setUserCloset] = useState(false);
  // Estado para controlar la privacidad del Closet

  useEffect(() => {
    if (user) {

      if (user?.public_closet === 0){
        setIsChecked(false);
        setIsPublic(false);
      } else {
        setIsChecked(true);
        setIsPublic(true);
      }
      axios
        .get(`http://localhost:3000/articles/getUserArticles/${user.user_id}`)
        .then((res) => {
          let prueba = res.data.map((e) => {
            return {
              ...e,
              last_name: user.last_name,
              name: user.name,
              city: user.city,
              country: user.country
            };
          });
          setUserArticles(prueba);
          setUserAllArticles(true); //para mostrar la galeria de todos los articulos
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  const showUserAllArticles = () => {
    setUserAllArticles(true);
    setUserLikedArticles(false);
    setUserCloset(false);
  };

  const showCloset = () => {
    setUserLikedArticles(false);
    setUserAllArticles(false);
    setUserCloset(true);
    axios
      .get(`http://localhost:3000/articles/orderedArticles/${user.user_id}`)
      .then((res) => {
        setOrderedArticles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showUserLikedArticles = () => {
    setUserLikedArticles(true);
    setUserAllArticles(false);
    setUserCloset(false);
    axios
      .get(
        `http://localhost:3000/articles/getUserLikedArticles/${user.user_id}`
      )
      .then((res) => {
        setLikedArticles(res.data);
        setLikes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showModal = () => {
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    onSubmitPrivacy();
  };

  const onSubmitPrivacy = () => {
    if (isChecked === false) {
      axios
        .put(`http://localhost:3000/users/setPublicCloset/${user.user_id}`)
        .then((res) => {
          setIsPublic(true);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .put(`http://localhost:3000/users/setPrivateCloset/${user.user_id}`)
        .then((res) => {
          setIsPublic(false);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="sectionProfile p-0">
      <Row className="headerProfile">
        <Col></Col>
      </Row>

      <Row className="barCategories">
        <Col
          xs={6}
          md={3}
          className="d-flex justify-content-center  align-items-center"
        >
          <button
            onClick={showUserAllArticles}
            className="marcaCategoria d-flex flex-column align-items-center"
          >
            <img src="/assets/icons/icon01.png" alt="" />
            <h3>Articles</h3>
          </button>
        </Col>
        <Col
          xs={6}
          md={3}
          className="d-flex justify-content-center align-items-center"
        >
          <button className="marcaCategoria d-flex flex-column align-items-center">
            <img src="/assets/icons/icon02.png" alt="" />
            <h3>Collections</h3>
          </button>
        </Col>
        <Col
          xs={6}
          md={3}
          className="d-flex justify-content-center align-items-center"
        >
          <button
            onClick={showCloset}
            className="marcaCategoria d-flex flex-column align-items-center"
          >
            <img src="/assets/icons/icon03.png" alt="" />
            <h3>Closet</h3>
          </button>
        </Col>
        <Col
          xs={6}
          md={3}
          className="d-flex justify-content-center align-items-center"
        >
          <button
            onClick={showUserLikedArticles}
            className="marcaCategoria d-flex flex-column align-items-center"
          >
            <img src="/assets/icons/icon06.png" alt="" />
            <h3>Favourites</h3>
          </button>
        </Col>
      </Row>
      <Row className="rowProfile d-flex justify-content-center h-100">
        {screenWidth < 700 && (
          <Col xs={12} className="profilecol3-Mobile h-100">
            <div className="messageMetaverse m-0">
              {userAllArticles && (
                <>
                  <img src="/assets/icons/icon04.png" alt="" />
                  <h4>All Articles</h4>
                </>
              )}

              {userCloset && (
                <>
                  <img src="/assets/icons/icon08.png" alt="" />
                  <h4>Closet</h4>
                </>
              )}

              {userLikedArticles && (
                <>
                  <img src="/assets/icons/icon07.png" alt="" />
                  <h4>Liked Articles</h4>
                </>
              )}

              {userCloset && (
                <>
                  <div className="checkbox-wrapper-36">
                    <input
                      id="toggle-36"
                      type="checkbox"
                      onChange={handleCheckboxChange}
                      checked={isChecked}
                    />
                    <label htmlFor="toggle-36"></label>
                    <p> {isPublic ? "Public" : "Private"}</p>
                  </div>
                </>
              )}
            </div>
            
            <Button
          
          style={{
            backgroundColor: "#B88D19",
            color: "white",
            borderRadius: "20px",
            width: "200px",
            transition: "transform 0.3s",
            border: "none",
            padding: "8px",
            marginTop: "15px",
            marginLeft: "80px"
            
          }}
                  className="d-flex justify-content-center align-items-center gap-2"
                  onClick={showModal}
                >
                  {" "}
                  <BoxSeam />
                  Add Article
                 </Button>
          </Col>
        )}

        {screenWidth > 700 && (
          <Col className="profilecol1 h-100">
            <div className="profileMetaverseDesplazar">
              <div className="profileMetaverse">
                <img
                  src={
                    user?.user_img
                      ? `http://localhost:3000/images/users/${user.user_img}`
                      : "/assets/icons/default_user.png"
                  }
                  alt="UserProfilepic"
                />
                <h2>
                  {user?.name} {user?.last_name}
                </h2>

                <p>
                  <GeoAlt />{" "}
                  <em>
                    {user?.address}, {user?.city}, {user?.country}
                  </em>
                </p>
                <p>
                  <Envelope /> {user?.email}
                </p>
                <p>
                  <Telephone /> {user?.phone_number}
                </p>
                <p>
                  <Passport /> {user?.passport}
                </p>
              </div>

              <Button
          
          style={{
            backgroundColor: "#B88D19",
            color: "white",
            borderRadius: "20px",
            width: "200px",
            transition: "transform 0.3s",
            border: "none",
            padding: "8px",
            marginLeft: "70px",
            gap: "10px"
          }}
                  className="d-flex justify-content-center align-items-center"
                  onClick={showModal}
                >
                  {" "}
                  <BoxSeam />
                  Add Article
                 </Button>
              
            </div>
          </Col>
        )}

        <Col xs={7} className="profilecol2 d-flex justify-content-center">
          {userAllArticles && (
            <UserProductsGallery userArticles={userArticles} />
          )}

          {userLikedArticles && (
            <UserLikedArticlesGallery likedArticles={likedArticles} />
          )}
          {userCloset && <UserCloset orderedArticles={orderedArticles} />}
        </Col>

        {screenWidth > 700 && (
          <Col className="profilecol3">
            <div className="messageMetaverse">
              {userAllArticles && (
                <>
                  <img src="/assets/icons/icon04.png" alt="" />
                  <h4>All Articles</h4>
                </>
              )}

              {userCloset && (
                <>
                  <img src="/assets/icons/icon08.png" alt="" />
                  <h4>Closet</h4>
                </>
              )}

              {userLikedArticles && (
                <>
                  <img src="/assets/icons/icon07.png" alt="" />
                  <h4>Liked Articles</h4>
                </>
              )}

              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Incidunt, sapiente ullam? Recusandae, provident ad? Repellat
                consequatur reprehenderit ad, explicabo, quis numquam veritatis
                fuga sint deserunt libero magni ratione. Aspernatur fuga
                suscipit eaque facilis.
              </p>

              {userCloset && (
                <>
                  <div className="checkbox-wrapper-36">
                    <input
                      id="toggle-36"
                      type="checkbox"
                      onChange={handleCheckboxChange}
                      checked={isChecked}
                    />
                    <label htmlFor="toggle-36"></label>
                    <p> {isPublic ? "Public" : "Private"}</p>
                  </div>
                </>
              )}
            </div>
          </Col>
        )}
      </Row>
      <ModalAddProduct
        show={show}
        showModal={showModal}
        userArticles={userArticles}
        setUserArticles={setUserArticles}
        closeModal={closeModal}
      />
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
