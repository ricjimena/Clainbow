import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./resetPassword.scss";

export const ResetPassword = () => {
  const navigate = useNavigate();

  return (
    <Row>
      <Col>
        <div className="reset-pass">
          <h2>Success!</h2>
          <img src="/assets/images/email2.png" alt="Envelope icon" />
          <p>
            Password reset request was sent succesfully. Please check your email
            to reset your password.
          </p>
          <p>
            If you don't see it you may need to{" "}
            <strong>check your spam folder</strong>.
          </p>

          <p className="try-again">
            Did not receive the email?{" "}
            <Link to={"/validateEmail"}>Try Again</Link>
          </p>
          <Button
          className="ms-1 me-1 but-log"
          style={{
            backgroundColor: '#B88D19', 
            color: 'white',          
            borderRadius: '20px',  
            width: '100px',  
            transition: 'transform 0.3s',      
            border: 'none'   ,
            padding:'8px'       
          }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </Col>
    </Row>
  );
};
