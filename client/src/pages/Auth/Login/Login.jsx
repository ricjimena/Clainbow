import React from 'react'
import { FormularioLogin } from '../../../components/FomularioLogin/FormularioLogin'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const Login = () => {
  return (
    <Row>
      <Col>
        <div>
        <FormularioLogin/>
        </div>  
      
      </Col>
  </Row>
  )
}
