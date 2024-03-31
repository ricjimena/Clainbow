import React, { useState } from "react";
import { ProductCard } from "../ProductCard/ProductCard";
import { Col, Container, Row } from "react-bootstrap";
import "./articlesmaylike.scss";
import { useNavigate } from "react-router-dom";

export const ArticlesMayLike = ({
  productsMayLike,
  setProductsMayLike,
  oneArticle
}) => {
  const [category, setCategory] = useState(0);
  if (oneArticle) {
    const { category_id } = oneArticle;
    setCategory(category_id);
  }

  return (
    <>
      <Row>
        <Col>
          <div>
            <div className="like-title d-flex">
              <h2>Articles you may also like...</h2>
            </div>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {productsMayLike?.map((elem, i) => (
                <div
                  key={i}
                  className="d-flex flex-wrap gap-3 justify-content-center mt-5"
                >
                  <ProductCard elem={elem} />
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};
