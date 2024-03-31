import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Button, Col, Row, Offcanvas } from "react-bootstrap";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { textSensitive } from "../../utils/utils";
import { Outlet, useNavigate } from "react-router-dom";
import { NewProducts } from "../../components/NewProducts/NewProducts";
import { TopCategories } from "../../components/TopCategories/TopCategories";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import {Footer} from "../../components/Footer/Footer"
import "./products.scss";
import { BestSolds } from "../../components/BestSolds/BestSolds";

export const Products = ({screenWidth}) => {
  const { likes, user } = useContext(ClainbowContext);
  const [searchResults, setSearchResults] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  //estado booleano para mostrar all articles;
  const [stateAllArticles, setStateAllArticles] = useState(false);
  // estado booleano para mostrar best Solds
  const [stateBestSolds, setStateBestSolds] = useState(false);
  // array vacio para guardar los Best Solds
  const [bestSolds, setBestSolds] = useState([]);
  //array vacío para meter new Products
  const [newProducts, setNewProducts] = useState([]);
  //estado booleano para mostrar los new products
  const [stateNewProducts, setStateNewProducts] = useState(false);
  const [stateTopCategories, setStateTopCategories] = useState(false);
  const [topCategories, setTopCategories] = useState([]);
  // estado para mostrar los resultados de busqueda
  const [stateSearchResults, setStateSearchResults] = useState(false);
  const [show, setShow] = useState(false); 

    useEffect(() => {   
         axios
          .get("http://localhost:3000/articles/allArticles")
          .then((res) => {
            setArticles(res.data);
          })
          .catch((err) => console.log(err));
          setStateAllArticles(true);
    }, []);

  const onFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const searchArticles = () => {
    setStateAllArticles(false);
    setStateBestSolds(false);
    setStateNewProducts(false);
    setStateTopCategories(false);
    setStateSearchResults(true);

    axios
      .get(`http://localhost:3000/articles/search/${user.user_id}/${filter}`)
      .then((res) => {
        setSearchResults(res.data);
        setFilter("");
      })
      .catch((err) => console.log(err));
  };

  const showAllArticles = () => {
    setStateAllArticles(true);
    setStateBestSolds(false);
    setStateNewProducts(false);
    setStateTopCategories(false);
    setStateSearchResults(false);
    setShow(false);
  };

  const showBestSolds = () => {
    setStateAllArticles(false);
    setStateBestSolds(true);
    setStateNewProducts(false);
    setStateTopCategories(false);
    setStateSearchResults(false);
    setShow(false);

    axios
      .get("http://localhost:3000/articles/getBestSolds")
      .then((res) => {
        setBestSolds(res.data);
      })
      .catch((err) => console.log(err));
  };

  const showNewProducts = () => {
    setStateAllArticles(false);
    setStateBestSolds(false);
    setStateNewProducts(true);
    setStateTopCategories(false);
    setStateSearchResults(false);
    setShow(false);

    axios
      .get("http://localhost:3000/articles/getNewProducts")
      .then((res) => {
        setNewProducts(res.data);
      })
      .catch((err) => console.log(err));
  };

  const showTopCategories = () => {
    setStateAllArticles(false);
    setStateBestSolds(false);
    setStateNewProducts(false);
    setStateTopCategories(true);
    setStateSearchResults(false);
    setShow(false);

    axios
      .get("http://localhost:3000/articles/getTopCategories")
      .then((res) => {
        setTopCategories(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Row className="global">
        {screenWidth < 580 ? (
          <Col className="d-flex align-items-center justify-content-center">
            <div className="buscadorMobile d-flex ">
              <input
                placeholder="  Search..."
                type="text"
                value={filter}
                onChange={onFilterChange}
              />
              <button
                className="lupadivMobile"
                onClick={searchArticles}
              ></button>

              <button onClick={handleShow} className="pointsMobile"></button>
            </div>

            <Offcanvas className="w-75" show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Search for Articles...</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="desplegable d-flex flex-column gap-5">
                <br />
                <button onClick={showAllArticles}>All Articles</button>
                <button onClick={showBestSolds}>Best Solds</button>
                <button onClick={showNewProducts}>New Articles</button>
                <button onClick={showTopCategories}>Top Categories</button>

                <Outlet />
              </Offcanvas.Body>
            </Offcanvas>
          </Col>
        ) : (
          <Col className="barra" xs={12}>
            <div className="barraNav d-flex">
              <div className="d-flex gap-2 p-3 flex-wrap">
                <Button
                  className="ms-1 me-1"
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "20px",
                    width: "150px",
                    transition: "transform 0.3s",
                    border: "none",
                    padding: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)";
                    e.target.style.backgroundColor = "#B88D19";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "black";
                  }}
                  onClick={showAllArticles}
                >
                  All Articles
                </Button>

                <Button
                  className="ms-1 me-1"
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "20px",
                    width: "150px",
                    transition: "transform 0.3s",
                    border: "none",
                    padding: "8px",
                  }}

                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)";
                    e.target.style.backgroundColor = "#B88D19";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "black";
                  }}
                  onClick={showBestSolds}
                >
                  Best Solds
                </Button>
                <Button
                  className="ms-1 me-1"
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "20px",
                    width: "150px",
                    transition: "transform 0.3s",
                    border: "none",
                    padding: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)";
                    e.target.style.backgroundColor = "#B88D19";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "black";
                  }}
                  onClick={showNewProducts}
                >
                  New Articles
                </Button>
                <Button
                  className="ms-1 me-1"
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "20px",
                    width: "150px",
                    transition: "transform 0.3s",
                    border: "none",
                    padding: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)";
                    e.target.style.backgroundColor = "#B88D19";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "black";
                  }}
                  onClick={showTopCategories}
                >
                  Top Categories
                </Button>

                <div className="input-cont">
                  <input
                    className="search-input"
                    style={{
                      fontSize: "16px",
                      padding: "10px",
                      width: "300px",
                      backgroundColor: "#EFEFEF",
                      border: "none",
                      borderRadius: "20px",
                    }}
                    placeholder="Search.."
                    type="text"
                    value={filter}
                    onChange={onFilterChange}
                  />
                  <div className="lupadiv" onClick={searchArticles}></div>
                </div>
              </div>
              <div>
                <Outlet />

              </div>
            </div>
          </Col>
        )}
      </Row>
      <Row className="global-2">
        {stateAllArticles && (

          <Col className="d-flex flex-wrap gap-3 justify-content-center m-0 mb-5">
            {articles.map((article, i) => (
              <div key={i}>
                <ProductCard
                  article_id={article.article_id}
                  elem={article}
                  articles={articles}
                />
              </div>
            ))}
          </Col>
        )}

        {stateBestSolds && (
          <Col>
            <BestSolds bestSolds={bestSolds} />
          </Col>
        )}

        {stateNewProducts && (
          <Col>
            <NewProducts
              newProducts={newProducts}
              setNewProducts={setNewProducts}
            />
          </Col>
        )}

        {stateSearchResults && (
          <div>
            {searchResults?.length > 0 ? (
              <Col className="d-flex flex-wrap gap-3 justify-content-center  m-0 mb-5">
                {searchResults?.map((result, i) => (
                  <div key={i}>
                    <ProductCard
                      article_id={result.article_id}
                      elem={result}
                      articles={searchResults}
                    />
                  </div>
                ))}
              </Col>
            ) : (
              <p className="errorMessage">No results found</p>
            )}
          </div>
        )}

        {stateTopCategories && (
          <Col>
            <TopCategories topCategories={topCategories} />
          </Col>
        )}
      </Row>
      <footer><Footer/></footer>
    </>
  );
};
