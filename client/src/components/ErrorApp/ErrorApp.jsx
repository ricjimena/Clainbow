import React from "react";
import { Col, Row } from "react-bootstrap";
import './errorApp.scss'

export const ErrorApp = () => {
  return (
    <Row>
      <Col className="error-ppal">
        <h2>ACCESS DENIED</h2>
      </Col>
    </Row>
  );
};
