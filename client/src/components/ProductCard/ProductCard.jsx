import React, { useContext, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./productCard.scss";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import { Calendar, GeoAltFill, Heart, HeartFill } from "react-bootstrap-icons";
import axios from "axios";

export const ProductCard = ({ elem, prevLocation = "" }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(elem?.article_created);
  const monthIndex = date.getMonth();
  const monthText = months[monthIndex];
  const day = date.getDate();
  const year = date.getFullYear();

  const { user, likes, setLikes } = useContext(ClainbowContext);
  const navigate = useNavigate();
  const [like, setLike] = useState(false);
  const path = useLocation().pathname;

  const irApagina = () => {
    navigate(`/oneArticle/${elem?.article_id}`, {state: {from:prevLocation}})
    
  }

  useEffect(() => {
    setLike(likes?.some((e) => e.article_id === elem.article_id));
  }, [likes]);

  const initialState = {
    user_id: user?.user_id,
    article_id: elem?.article_id,
  };

  const [articleLikeInfo, setArticleLikeInfo] = useState(initialState);

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
        //.delete("http://localhost:3000/articles/deleteLike", stateInfoLike)
        .delete(
          `http://localhost:3000/articles/deleteLike/${user.user_id}/${elem.article_id}`
        )
        .then((res) => {
          setLikes(likes.filter((e) => e.article_id != elem.article_id));
        })
        .catch();
      setLike(false);
      setArticleLikeInfo();
    }
  };
  
  return (
    <Card className="imagenCard">
      <div onClick={irApagina}>
        {elem?.resource_name && elem?.resource_name.endsWith(".mp4") ? (
          <video className="imagenCard" width="100%" height="auto" controls>
            <source src={`http://localhost:3000/images/articles/${elem.resource_name}`} type="video/mp4" />
          </video>
        ) : (
          <Card.Img
            className="imagenCard"
            variant="top"
            src={`http://localhost:3000/images/articles/${elem?.resource_name || "default.png"}`}
          />
        )}
      </div>
      <Card.Body>
        <div className="name-icon">
          <Card.Title className="article_name">{elem?.article_name}</Card.Title>
          {user && <div onClick={giveLike}>{like ? <HeartFill /> : <Heart />}</div>}
        </div>
        <hr />
        <div className="user-cont">
          <div className="mt-0 user-box">
            {elem?.creator_user_img ? (
              <img
                src={
                  elem?.creator_user_img
                    ? `http://localhost:3000/images/users/${elem.creator_user_img}`
                    : "/assets/icons/default_user.png"
                }
                alt=""
              />
            ) : (
              <img
                src={
                  elem?.user_img
                    ? `http://localhost:3000/images/users/${elem.user_img}`
                    : "/assets/icons/default_user.png"
                }
                alt=""
              />
            )}
          </div>
          <div className="user-name">
            {elem &&
              <div>
                <Card.Text>{elem.creator_name} {elem.creator_last_name}</Card.Text>
                <Card.Text className="location">
                  <GeoAltFill />
                  {elem?.creator_city}, {elem?.creator_country}
                </Card.Text>
              </div>
            //  : 
            //   <div>
            //     <Card.Text className="name">{user?.name} {user?.last_name}</Card.Text>
            //     <Card.Text className="location">
            //       <GeoAltFill />
            //       {user?.city}, {user?.country}
            //     </Card.Text>
            //   </div>
            
            }
          </div>
        </div>
        <hr />
        <div className="price-city">
          <div>
            <Card.Text className="dolar">${elem?.price}</Card.Text>
          </div>
          <div className="created_date">
            <Card.Text>
              <Calendar />
              {` ${monthText}. ${day}, ${year}`}
            </Card.Text>
          </div>
          <div></div>
        </div>
      </Card.Body>
    </Card>
  );
};
