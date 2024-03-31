import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FormularioRegister02 } from '../../../../components/FormularioRegister02/FormularioRegister02';
import { Col, Row } from 'react-bootstrap';

export const ValidateAccount = () => {

  const {token} = useParams();
  const [user, setUser] = useState();


  const navigate = useNavigate();

  useEffect(()=>{
    if (token){
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        axios
          .put('http://localhost:3000/users/validateAccount', token)
          .then((res)=> {
            setUser(res.data.user_id);

            if (res.data.status === "Complete"){
              navigate('/login')
            }           
          })
          .catch((err)=> {
            console.log(err)
          })
    }   
  },[token]);

  return (
   
     <Row>
      <Col>
        <div>
          <FormularioRegister02 user_id={user} />
        </div>      
      </Col>
    </Row>
    
  )
}
