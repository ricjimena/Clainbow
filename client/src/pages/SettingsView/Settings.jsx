import React, { useContext, useEffect, useState } from "react";
import { FormularioEditUser } from "../../components/FormularioEditUser/FormularioEditUser";
import "./settings.scss";
import { useNavigate } from "react-router-dom";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import { Button, Col, Row } from "react-bootstrap";
import {
  ClipboardData,
  Pen,
  PencilSquare,
  PersonBadge,
  PersonVcard,
} from "react-bootstrap-icons";
import { AdminUsers } from "../../components/AdminUsers/AdminUsers";
import { AdminArticles } from "../../components/AdminArticles/AdminArticles";
import { AdminStadistics } from "../../components/AdminStadistics/AdminStadistics";
import { Footer } from "../../components/Footer/Footer";

const initialValue = {
  name: "",
  last_name: "",
  passport: "",
  phone_number: "",
  address: "",
  city: "",
  country: "",
};

export const Settings = () => {
  const { user, setUser } = useContext(ClainbowContext);
  const [edittedUser, setEdittedUser] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState();
  const [option, setOption] = useState(0);
  const [showProfile, setShowProfile] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setEdittedUser({
        ...edittedUser,
        name: user.name,
        last_name: user.last_name,
        passport: user.passport,
        phone_number: user.phone_number,
        address: user.address,
        city: user.city,
        country: user.country,
        user_id: user.user_id,
      });
      setOption(0);
      setShowProfile(true);
      setShowEditForm(false);
    }
  }, [user]);

  const handleOptions = (option) => {
    switch (option) {
      case 0:
        setOption(0);
        setShowProfile(true);
        setShowEditForm(false);
        break;
      case 1:
        setOption(1);
        setShowProfile(true);
        setShowEditForm(true);
        break;
      case 2:
        setOption(2);
        setShowProfile(false);
        setShowEditForm(false);
        break;
      case 3:
        setOption(3);
        setShowProfile(false);
        setShowEditForm(false);
        break;
      case 4:
        setOption(4);
        setShowProfile(false);
        setShowEditForm(false);
        break;
    }
  };

  return (
    <>
    <Row className="settings-ppal">
      <Col xs={12} md={3} className="sectionProfile  d-flex flex-column justify-content-between align-items-center">
  
          {user?.user_type === 2 ? (
            <div>
           
                <h2 className="text-center">User Profile</h2>

              <div className="options">
                <p onClick={() => handleOptions(0)}>
                  <PersonBadge /> My Profile
                </p>
                <p onClick={() => handleOptions(1)}>
                  <Pen /> Edit Profile
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-center">Admin Profile</h2>

              <div className="options">
                <div>
                  <p onClick={() => handleOptions(0)}>
                    <PersonBadge /> My Profile
                  </p>
                  <p onClick={() => handleOptions(1)}>
                    <Pen /> Edit Profile
                  </p>
                </div>
                <div>
                  <p onClick={() => handleOptions(2)}>
                    <PersonVcard /> Users' Accounts
                  </p>
                  <p onClick={() => handleOptions(3)}>
                    <PencilSquare /> Users' Articles
                  </p>
                </div>              
            </div>
            </div>
           
          )}

          <Button
            className="mt-2"
            style={{
              backgroundColor: "#B88D19",
              color: "white",
              borderRadius: "20px",
              width: "100px",
              transition: "transform 0.3s",
              border: "none",
            }}
            onClick={() => navigate("/userProfile")}
            onMouseEnter={(e) => (e.target.style.transform = "scale(0.95)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Back
          </Button>
    
      </Col>
      <Col xs={12} md={9}>
        {showProfile && (
          <FormularioEditUser
            edittedUser={edittedUser}
            setEdittedUser={setEdittedUser}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            file={file}
            setFile={setFile}
            showEditForm={showEditForm}
            showProfile={showProfile}
            setShowEditForm={setShowEditForm}
          />
        )}
        {option === 2 && <AdminUsers />}
        {option === 3 && <AdminArticles />}
        {option === 4 && <AdminStadistics />}
      </Col>
    </Row>
    <footer><Footer/></footer>
    </>
  );
};
