import React from "react";
import "./home.scss";
import { Row, Col } from "react-bootstrap";
import { Footer } from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { NavBarMobile } from "../../components/NavBarMobile/NavBarMobile";

export const Home = ({screenWidth}) => {
  const navigate = useNavigate();
  return (
    <>
        <Row className="homeSection">
      <Col md={6} xs={12} className="homeInfo">
        <div>
          <h1>We design the metaverse </h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo iure,
            saepe corporis similique totam reprehenderit.
          </p>
          <button onClick={()=>navigate("/allArticles")}>Shop now</button>
        </div>
      </Col>

      <Col md={6} xs={12} ></Col>
    </Row>
    {screenWidth  > 460 &&
   <footer>
   <Footer/>
</footer>

    }
 
    </>   
  );
};
