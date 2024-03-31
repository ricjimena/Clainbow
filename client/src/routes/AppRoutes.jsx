import React, { useContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { NavbarApp } from "../components/Navbar/NavbarApp";
import { Container } from "react-bootstrap";
import { Contact } from "../pages/Contact/Contact";
import { Products } from "../pages/Products/Products";
import { About } from "../pages/About/About";
import { Register01 } from "../pages/Auth/Register/Register01/Register01";
import { ValidateAccount } from "../pages/Auth/Register/ValidateAccount/ValidateAccount";
import { Login } from "../pages/Auth/Login/Login";
import { VerifyAccount } from "../pages/Auth/Register/VerifyAccount/VerifyAccount";
import { ResetPassword } from "../pages/Auth/Login/ResetPassword/ResetPassword";
import { ValidateEmail } from "../pages/Auth/Login/ValidateEmail/ValidateEmail";
import { ProductProfile } from "../pages/ProductProfile/ProductProfile";
import { Settings } from "../pages/SettingsView/Settings";
import { UserProfile } from "../pages/UserProfile/UserProfile";
import { CartApp } from "../pages/Cart/CartApp";
import { ClainbowContext } from "../Context/ClainbowProvider";
import { BestSolds } from "../components/BestSolds/BestSolds";
import { NewProducts } from "../components/NewProducts/NewProducts";
import { TopCategories } from "../components/TopCategories/TopCategories";
import { NavBarMobile } from "../components/NavBarMobile/NavBarMobile";
import { ErrorApp } from "../components/ErrorApp/ErrorApp";

export const AppRoutes = () => {
  // Cargo este estado en el context. Si lo cargo en AppRoutes está afectado por el ciclo de vida de React y no se aplica hasta que se refresca el navegador.
  const { showNavBar, user, token } = useContext(ClainbowContext);

  const [resetCount, setResetCount] = useState(false);

  // estados de control del Closet en UserProfile
  const [isChecked, setIsChecked] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  //UseEffect para controlar los px del viewport
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", HandleResize);

    return () => {
      window.removeEventListener("resize", HandleResize);
    };
  }, []);

  const HandleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  const setPrivacy = () => {
    setIsChecked(isChecked);
    setIsPublic(isPublic);
  };

  const shouldShowNavbar = () => {
    const nonNavbarRoutes = ["/verifyAccount", "/validateAccount"];
    // Verifica si la ruta actual está en la lista de rutas que deben ocultar el Navbar (que la ruta comienza como... "starts with"):
    const isNonNavbarRoute = nonNavbarRoutes.some((route) => {
      return window.location.pathname.startsWith(route);
    });

    return showNavBar && !isNonNavbarRoute;
  };

  return (
    <>
      {screenWidth > 460 && (
        <header>
          {shouldShowNavbar() && (
            <NavbarApp resetCount={resetCount} screenWidth={screenWidth} />
          )}
        </header>
      )}

      <Container fluid className="m-0 p-0">
        <main>
          <Routes>
            <Route path="/" element={<Home screenWidth={screenWidth} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <>
              <Route path="/register01" element={<Register01 />} />
              <Route
                path="/validateAccount/:token"
                element={<ValidateAccount />}
              />
              <Route path="/validateEmail" element={<ValidateEmail />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route path="/login" element={<Login />} />
            </>

            <Route path="/verifyAccount" element={<VerifyAccount />} />

            <>
              <Route
                path="/oneArticle/:id"
                element={
                  <ProductProfile
                    resetCount={resetCount}
                    setResetCount={setResetCount}
                  />
                }
              />
              <Route
                path="/cart"
                element={
                  <CartApp
                    resetCount={resetCount}
                    setResetCount={setResetCount}
                  />
                }
              />
            </>

            <Route path="/settings" element={<Settings />} />
            <Route
              path="/userProfile"
              element={
                <UserProfile
                  isPublic={isPublic}
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                  setIsPublic={setIsPublic}
                  screenWidth={screenWidth}
                />
              }
            />
            <Route
              path="/allArticles"
              element={<Products screenWidth={screenWidth} />}
            >
              <Route path="bestSolds" element={<BestSolds />} />
              <Route path="newProducts" element={<NewProducts />} />
              <Route path="topCategories" element={<TopCategories />} />
            </Route>
            <Route path="*" element={<ErrorApp />} />
          </Routes>
        </main>
        {screenWidth < 768 && (
          <footer className="fixed-bottom">
            {shouldShowNavbar() && <NavBarMobile resetCount={resetCount} />}
          </footer>
        )}
      </Container>
    </>
  );
};
