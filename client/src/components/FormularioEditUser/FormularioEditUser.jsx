import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./formularioEditUser.scss";
import {
  Envelope,
  GeoAlt,
  Passport,
  PersonAdd,
  Telephone,
} from "react-bootstrap-icons";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const FormularioEditUser = ({
  edittedUser,
  setEdittedUser,
  errorMessage,
  setErrorMessage,
  file,
  setFile,
  showEditForm,
  showProfile,
  setShowEditForm,
}) => {
  const { user, setUser } = useContext(ClainbowContext);
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [cityError, setCityError] = useState("");
  const [countryError, setCountryError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    // Validaciones de entrada
    if (name === 'name') {
      // Permitir solo texto
      if (/^[^\d_]+(?: [^\d_]+)*$/.test(value)) {
        updatedValue = value;
        setNameError("");
      } else {
        setNameError("Only text is allowed for your name");
      }
    }
    else if (name === 'last_name') {
      // Permitir solo texto
      if (/^[^\d_]+(?: [^\d_]+)*$/.test(value)) {
        updatedValue = value;
        setLastNameError("");
      } else {
        setLastNameError("Only text is allowed for your last name");
      }
    }
    else if (name === 'city') {
      // Permitir solo texto
      if (/^[^\d_]+(?: [^\d_]+)*$/.test(value)) {
        updatedValue = value;
        setCityError("");
      } else {
        setCityError("Only text is allowed for city");
      }
    }
    else if (name === 'country') {
      // Permitir solo texto
      if (/^[^\d_]+(?: [^\d_]+)*$/.test(value)) {
        updatedValue = value;
        setCountryError("");
      } else {
        setCountryError("Only text is allowed for country");
      }
    }
    setEdittedUser({ ...edittedUser, [name]: updatedValue });
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = () => {
    if (
      edittedUser.name &&
      edittedUser.last_name &&
      edittedUser.passport &&
      edittedUser.phone_number &&
      edittedUser.address &&
      edittedUser.city &&
      edittedUser.country
    ) {
      const newFormData = new FormData();
      // mando un json con mi objeto edittedUser
      newFormData.append("edittedUser", JSON.stringify(edittedUser));
      newFormData.append("file", file);

      axios
        .put("http://localhost:3000/users/editUser", newFormData)
        .then((res) => {
          navigate("/settings");
          setShowEditForm(false);

          // consideramos si viene o no foto en el cambio:
          if (res.data.newImg) {
            setUser({ ...user, ...edittedUser, user_img: res.data.newImg });
          } else {
            setUser({ ...user, ...edittedUser });
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage("Error saving changes");
        });
    } else if (isNaN(edittedUser.phone_number) === true) {
      setErrorMessage("Incorrect format");
    } else {
      setErrorMessage("Please fill in all fields");
    }
  };

  return (
    <div className="userProfile-right">
      <div className="profile-top d-flex align-items-center">
        <div>
          <img
            className="profilePic"
            width={"230px"}
            src={
              user?.user_img
                ? `http://localhost:3000/images/users/${user.user_img}`
                : "/assets/icons/default_user.png"
            }
            alt="UserProfilepic"
          />
        </div>
        <div className="profile-top-right">
          <h2>
            {user?.name} {user?.last_name}
          </h2>

          <p>
            <GeoAlt />{" "}
            <em>
              {user?.address}, {user?.city}, {user?.country}
            </em>
          </p>
          <p>
            <Envelope /> {user?.email}
          </p>
          <p>
            <Telephone /> {user?.phone_number}
          </p>
          <p>
            <Passport /> {user?.passport}
          </p>
        </div>
      </div>

      {showEditForm && (
        <div className="editProfile-form">
          <Form>
            <div>
              <Form.Group className="mb-3">
                <div className="d-flex flex-column">
                  <Form.Label id="formName">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First name"
                    name="name"
                    value={edittedUser?.name}
                    onChange={handleChange}
                    style={{
                      fontSize: "16px",
                      padding: "10px",
                      width: "300px",
                      borderRadius: "20px",
                    }}
                  />
                  <span className="errorMessage">{nameError}</span>
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formLastName">
                <div className="d-flex flex-column">
                  <Form.Label id="formLastName">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last name"
                    name="last_name"
                    value={edittedUser?.last_name}
                    onChange={handleChange}
                    style={{
                      fontSize: "16px",
                      padding: "10px",
                      width: "300px",
                      borderRadius: "20px",
                    }}
                  />
                  <span className="errorMessage">{lastNameError}</span>
                </div>
              </Form.Group>
            </div>

            <div>
              <Form.Group className="mb-3" controlId="formPassport">
                <div className="d-flex flex-column">
                  <Form.Label id="formPassport">Passport</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Passport/id"
                    name="passport"
                    value={edittedUser?.passport}
                    onChange={handleChange}
                    style={{
                      fontSize: "16px",
                      padding: "10px",
                      width: "300px",
                      borderRadius: "20px",
                    }}
                  />
                 
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPhone">
                <div className="d-flex flex-column">
                  <Form.Label id="formPhone">Phone number</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Phone number"
                    name="phone_number"
                    value={edittedUser?.phone_number}
                    onChange={handleChange}
                    style={{
                      fontSize: "16px",
                      padding: "10px",
                      width: "300px",
                      borderRadius: "20px",
                    }}
                  />
                 
                </div>
              </Form.Group>
            </div>

            <div>
              <Form.Group className="mb-3" controlId="formAddress">
                <div className="d-flex flex-column">
                  <Form.Label id="formAddress">Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={edittedUser?.address}
                    onChange={handleChange}
                    style={{
                      fontSize: "16px",
                      padding: "10px",
                      width: "300px",
                      borderRadius: "20px",
                    }}
                  />
                  
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCity">
                <div className="d-flex flex-column">
                  <Form.Label id="formCity">City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
                    name="city"
                    value={edittedUser?.city}
                    onChange={handleChange}
                    style={{
                      fontSize: "16px",
                      padding: "10px",
                      width: "300px",
                      borderRadius: "20px",
                    }}
                  />
                  <span className="errorMessage">{cityError}</span>
                </div>
              </Form.Group>
            </div>

            <div className="testImg">
              <Form.Group className="mb-3" controlId="formCountry">
                <div className="d-flex flex-column">
                  <Form.Label id="formCountry">Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Country"
                    name="country"
                    value={edittedUser?.country}
                    onChange={handleChange}
                    style={{
                      fontSize: "16px",
                      padding: "10px",
                      width: "300px",
                      borderRadius: "20px",
                    }}
                  />
                  <span className="errorMessage">{countryError}</span>
                </div>
              </Form.Group>

              <Form.Group className="inputImagen" controlId="formBasicImg">
                <Form.Label htmlFor="fileInput"><PersonAdd className="addImgIcon"/> Your profile image </Form.Label>
                <Form.Control id="fileInput" type="file" onChange={handleFile} hidden />
              </Form.Group>
            </div>
            <div className="d-flex justify-content-start">
              <Button
              className="mt-3"
                
                style={{
                  backgroundColor: "#B88D19",
                  color: "white",
                  borderRadius: "20px",
                  width: "150px",
                  transition: "transform 0.3s",
                  border: "none",
                }}
                onClick={onSubmit}
                onMouseEnter={(e) => (e.target.style.transform = "scale(0.95)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};
