import React from "react";
import { Col, Row } from "react-bootstrap";
import "./footer.scss";
import {

  
  EnvelopeFill,
   TelephoneFill,
} from "react-bootstrap-icons";

export const Footer = () => {
  return (
    <Row className="footerSection">
      <Col>
        <div className="box">
          <Col className="info1 d-flex flex-column align-items-start">
          <img src="./assets/images/IsologoClainbow.png" alt="" />
            <h3>Subscribe now</h3>
            <span> <EnvelopeFill/>  Enter your email</span>
            <hr />
           
            <button>Subscribe</button>
          </Col>
          <Col className="info1 d-flex flex-column">
            <h2>Information</h2>
            <p>About Us</p>
            <p>MoreSearch</p>
            <p>Blog</p>
            <p>Testimonials</p>
            <p>Events</p>
          </Col>

          <Col className="info1 d-flex flex-column">
            <h2>HelpFul Links</h2>
            <p>Services</p>
            <p>Supports</p>
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
          </Col>
          <Col className="info1 d-flex flex-column">
            <h2>Our Services</h2>
            <p>Brands list</p>
            <p>Order</p>
            <p>Return & Exchange</p>
            <p>Fashion list</p>
            <p>Blog</p>
          </Col>
          <Col className="info1 d-flex flex-column">
            <h2>Contact Us</h2>
            <p><TelephoneFill/>  + 91 999 999 999</p>
            <p><EnvelopeFill/> youremail.com</p>
       
          </Col>
        </div>

        <div className="chiquita d-flex justify-content-between">
          <p></p>
          <p className="m-0">2024 companyLtd &copy; | All Right Reserved</p>
          <p className="m-0">FAQ Privacy Terms & Conditions</p>
        </div>
      </Col>
    </Row>
  );
};
