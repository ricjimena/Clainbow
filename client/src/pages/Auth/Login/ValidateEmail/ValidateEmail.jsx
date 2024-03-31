import axios from 'axios';
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import './validateEmail.scss'

const initialValue = {
  email: ""
}

export const ValidateEmail = () => {

  const [validateEmail, setValidateEmail] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    const {name, value} = e.target;
    setValidateEmail({...validateEmail, [name]:value});
  }

  const onSubmit = () => {

    if (!validateEmail.email){
      setErrorMessage("Please provide a valid e-mail");
    }
    else {
      axios
        .post('http://localhost:3000/users/checkEmail', validateEmail)
        .then((res) => {
          if (res) {
            // si la consulta al back > 0 = el e-mail existe y puedo enviarle un mensaje con la nueva contraseña. Si no, error.
            if (res.data[0].count > 0){

              axios
                .post('http://localhost:3000/users/sendNewPasswordEmail', validateEmail)
                .then((res2) => {
                       
                })
                .catch((error) => {
                  console.error('Error sending new password email:', error);
                  setErrorMessage("Internal server error");
                });
                navigate('/resetPassword')  
            }
            // si el e-mail no existe en BD, mando error:
            else {
              setErrorMessage("Oops! It seems like this email does not exist in our database. Please double-check the address and try again.")
            }

            
          } else {
            // Si el correo electrónico no existe en la base de datos, muestra un mensaje de error
            setErrorMessage("Email not found in the database");
          }
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
          setErrorMessage("Internal server error");
        });
    }
  }

  return (
    <div className='gerallog'>
      <div className='lateralvalidate'>
        <div className='logaccount'>
        
        </div>
      </div>
      <div className='formlog'>
      <div className='clain'><img className='clainpic2' src="../assets/images/LogosClainbow-06.png" alt="" /></div>

        <Form>
       
        <div className='forgotPass'>
          <h3>Forgot your password?</h3>
        </div>
    <p className='instructionsPass'>Enter the email address associated with your account</p>
          <Form.Group className="mb-3" controlId="formBasicEmail">
          
            <Form.Control
              type="text"
              placeholder="Email"
              name="email"
              value={validateEmail.email}
              onChange={handleChange}
              style={{ fontSize: '16px',
              padding: '10px',
              width: '350px',   borderRadius: '20px'}}
            />
              </Form.Group>
        
          <span className="errorMessage">{errorMessage}</span>
        
          <div className='signin'>
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
              variant="primary reset-but"
              onClick={onSubmit}
              onMouseEnter={(e) => e.target.style.transform = 'scale(0.95)'} 
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} 
            >
            Reset
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
