import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./form02.scss";

const initialValue = {
  name: "",
  last_name: "",
  passport: "",
  phone_number: "",
  address: "",
  city: "",
  country: "",
};

export const FormularioRegister02 = ({ user_id }) => {
  const [register02, setRegister02] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [cityError, setCityError] = useState("");
  const [countryError, setCountryError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    // Validaciones de entrada
    if (name === "name") {
      // Permitir solo texto
      if (/^[^\d_]+(?: [^\d_]+)*$/.test(value)) {
        updatedValue = value;
        setNameError("");
      } else {
        setNameError("Only text is allowed for your name");
      }
    } else if (name === "last_name") {
      // Permitir solo texto
      if (/^[^\d_]+(?: [^\d_]+)*$/.test(value)) {
        updatedValue = value;
        setLastNameError("");
      } else {
        setLastNameError("Only text is allowed for your last name");
      }
    } else if (name === "city") {
      // Permitir solo texto
      if (/^[^\d_]+(?: [^\d_]+)*$/.test(value)) {
        updatedValue = value;
        setCityError("");
      } else {
        setCityError("Only text is allowed for city");
      }
    } else if (name === "country") {
      // Permitir solo texto
      if (/^[^\d_]+(?: [^\d_]+)*$/.test(value)) {
        updatedValue = value;
        setCountryError("");
      } else {
        setCountryError("Only text is allowed for country");
      }
    }
    setRegister02({ ...register02, user_id, [name]: updatedValue });
  };

  const onSubmit = () => {
    // Verificar mensajes de error
    if (
      !register02.name ||
      !register02.last_name ||
      !register02.passport ||
      !register02.phone_number ||
      !register02.address ||
      !register02.city ||
      !register02.country
    ) {
      setErrorMessage("Please fill in all the fields");
    }
    axios
      .post("http://localhost:3000/users/register02", register02)
      .then((res) => {
        if (res.data.message === "UncompletedForm") {
          setErrorMessage("Please fill in all the fields");
        }
        navigate("/login");
      })
      .catch((err) => {
        throw err;
      });
  };

  return (
    <div className="geral">
      <div className="lateral">
        <div className="create">
          <h1>Create Account</h1>
        </div>
      </div>
      <div className="formu1_1">
        <div className="clain">
          <img
            className="clainpic"
            src="../assets/images/LogosClainbow-06.png"
            alt=""
          />
          <h2>YOUR ACCOUNT HAS BEEN VERIFIED</h2>
          <h4>
            We have successfully verified your identity. You can now continue to
            updating your profile.
          </h4>
        </div>
        <Form className="form02">
          <Form.Group className="mb-3" controlId="formName">
            <Form.Control
              type="text"
              placeholder="First name"
              name="name"
              value={register02.name}
              onChange={handleChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                width: "300px",
                borderRadius: "20px",
              }}
            />
          </Form.Group>
          {nameError && 
          <span className="errorMessage">{nameError}</span> }
          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Control
              type="text"
              placeholder="Last name"
              name="last_name"
              value={register02.last_name}
              onChange={handleChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                width: "300px",
                borderRadius: "20px",
              }}
            />
          </Form.Group>
          {lastNameError && <span className="errorMessage">{lastNameError}</span>}          
          <Form.Group className="mb-3" controlId="formPassport">
            <Form.Control
              type="text"
              placeholder="Passport/id"
              name="passport"
              value={register02.passport}
              onChange={handleChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                width: "300px",
                borderRadius: "20px",
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Control
              type="number"
              placeholder="Phone number"
              name="phone_number"
              value={register02.phone_number}
              onChange={handleChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                width: "300px",
                borderRadius: "20px",
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Control
              type="text"
              placeholder="Address"
              name="address"
              value={register02.address}
              onChange={handleChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                width: "300px",
                borderRadius: "20px",
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCity">
            <Form.Control
              type="text"
              placeholder="City"
              name="city"
              value={register02.city}
              onChange={handleChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                width: "300px",
                borderRadius: "20px",
              }}
            />
          </Form.Group>
          {cityError &&
          <span className="errorMessage">{cityError}</span>}
          <Form.Group className="mb-3" controlId="formCountry">
            <Form.Control
              type="text"
              placeholder="Country"
              name="country"
              value={register02.country}
              onChange={handleChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                width: "300px",
                borderRadius: "20px",
              }}
            />
          </Form.Group>
          {countryError &&
          <span className="errorMessage">{countryError}</span>}

          <div>
            <Button
              className="ms-1 me-1 buttonForm"
              style={{
                backgroundColor: "#B88D19",
                color: "white",
                borderRadius: "20px",
                width: "100px",
                transition: "transform 0.3s",
                border: "none",
              }}
              onClick={onSubmit}
              onMouseEnter={(e) => (e.target.style.transform = "scale(0.95)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Sign up
            </Button>
            {errorMessage &&
            <span className="errorMessage">{errorMessage}</span>}
          </div>

          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};
