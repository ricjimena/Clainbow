import React from 'react'
import { Row, Col } from "react-bootstrap";
import './verifyAccount.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const VerifyAccount = () => {
  
  const { state } = useLocation();
  const userEmail = state && state.email;

  const navigate = useNavigate();

  const deleteUser = (email) => {
    if (email) {
      
      axios
        .delete(`http://localhost:3000/users/deleteUnverifiedUser/${email}`)
        .then((res) => {
          // Redirige a la página de registro después de borrar el usuario
          navigate('/register01');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <Row>
     <Col>
      <div className='verifyAcc-ppal'>
        <img src="/assets/images/email2.png" alt="Envelope icon" />
       <h2>Please verify your e-mail</h2>
       <p>You're almost there! We sent an e-mail to <strong>{userEmail}</strong></p>
       <p>Just click on the link in that e-mail to continue and complete your signup.</p>
        <p>If you don't see it you may need to <strong>check your spam</strong> folder.</p>
        
       <p className='anotherEmail'>Did not receive the email? Try <Link to={'/register01'} onClick={()=>deleteUser(userEmail)}>another e-mail address</Link> </p>
      </div>
    </Col>
  </Row>
  )
}
