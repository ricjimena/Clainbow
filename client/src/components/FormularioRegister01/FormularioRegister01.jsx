import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./form01.scss";

const initialValue = {
  email: "",
  password: "",
  repeatpassword: "",
};

export const FormularioRegister01 = () => {
  const [register, setRegister] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });
  };

  const onSubmit = () => {
    if (!register.email || !register.password || !register.repeatpassword) {
      setErrorMessage("Please fill in all the fields");
    } else if (
      register.password.length < 1 &&
      register.repeatpassword.length < 1
    ) {
      setErrorMessage("Password must contains at least 8 characters");
    } else if (register.password !== register.repeatpassword) {
      setErrorMessage("Passwords do not match");
      setRegister(initialValue);
    } else {
      axios
        .post("http://localhost:3000/users/register01", register)
        .then((res) => {
          navigate("/verifyAccount", { state: { email: res.data.email } });
        })
        .catch((err) => {
          if (err.response.data.errno === 1062) {
            setErrorMessage("This email already exists");
          }
        });
    }
  };

  return (
    <div className="geral01">
      <div className="lateral">
        <div className="create">
          <h1>Create Account</h1>
        </div>
      </div>

      <div className="formu1">
        <div className="clain">
          <img
            className="clainpic1"
            src="../assets/images/LogosClainbow-06.png"
            alt=""
          />
        </div>

        <Form>
          <div className="iconosredes">
            <img src="../assets/images/iconosredes.png" alt="" />
          </div>
          <p className="instructions">Use your email for registration</p>
          <p className="create-acc">Create Account</p>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={register.email}
              onChange={handleChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                width: "300px",
                borderRadius: "20px",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={register.password}
              onChange={handleChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                width: "300px",
                borderRadius: "20px",
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicRepeatPassword">
            <Form.Control
              type="password"
              placeholder="Repeat Password"
              name="repeatpassword"
              value={register.repeatpassword}
              onChange={handleChange}
              style={{
                fontSize: "16px",
                padding: "10px",
                width: "300px",
                borderRadius: "20px",
              }}
            />
          </Form.Group>

          <span className="errorMessage">{errorMessage}</span>

          <div className="signup">
            <Button
              className="ms-1 me-1"
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
          </div>
          <p className="acc-log">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};
