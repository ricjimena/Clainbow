import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import axios from "axios";
import { saveLocalStorage } from "../../../../server/utils/localStorageUtils";
import "./formLogin.scss";

const initialValue = {
  email: "",
  password: "",
};

export const FormularioLogin = () => {
  const [login, setLogin] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser, setToken, setLikes } = useContext(ClainbowContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const onSubmit = () => {
    if (!login.email || !login.password) {
      setErrorMessage("Please fill in all fields");
    } else {
      axios
        .post("http://localhost:3000/users/login", login)
        .then((res) => {
          // save token in localstorage
          saveLocalStorage("token", res.data.token);
          // save in Context
          setUser(res.data.user);
          setToken(res.data.token);
          setLikes(res.data.favourites);
          // depending on user type, navigate will redirect to User or Admin
          if (res.data.user.user_type === 2) {
            navigate("/");
          } else if (res.data.user.user_type === 1) {
            navigate("/settings");
          }
        })
        .catch((err) => {
          
          if (err.response.status === 500) {
            setErrorMessage("Internal server error");
          } else {
            setErrorMessage("Access denied");
          }
        });
    }
  };

  return (
    <div className="gerallog">
    
      <div className="laterallog">
        <div className="logaccount">
          <h1>Login Account</h1>
        </div>
      </div>
      <div className="formlog">
        <div className="clain">
          <img
            className="clainpic2"
            src="../assets/images/LogosClainbow-06.png"
            alt=""
          />
        </div>
        <Form>
          <div className="iconosredes">
            <img src="../assets/images/iconosredes.png" alt="" />
          </div>
          <p className="instructions">or use your email for registration</p>
          <p className="mobile-text">Login to your Account</p>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Enter email"
              name="email"
              value={login.email}
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
              value={login.password}
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
          <p className="forgot">
            Forgot your password?{" "}
            <Link to="/validateEmail">Reset your password</Link>
          </p>
          <div>
            <div className="signin">
              <Button
                className="ms-1 me-1"
                style={{
                  backgroundColor: "#B88D19",
                  color: "white",
                  borderRadius: "20px",
                  width: "100px",
                  transition: "transform 0.3s",
                  border: "none",
                  padding: "8px",
                }}
                onClick={onSubmit}
                onMouseEnter={(e) => (e.target.style.transform = "scale(0.95)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                {" "}
                Log in
              </Button>
            </div>
          </div>
          <p className="redir">
            Don't have an account? <Link to="/register01">Sign up</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};
