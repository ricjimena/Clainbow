import React, { useContext, useEffect, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import axios from "axios";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import { FileEarmark, PlusCircle } from "react-bootstrap-icons";
import "./modalAddProduct.scss";

const initialValue = {
  article_name: "",
  price: "",
  colour: "",
  description: "",
  category_id: "",
};

export const ModalAddProduct = ({
  show,
  showModal,
  title = "Add a new article!",
  userArticles,
  setUserArticles,
  closeModal,
}) => {
  const { user } = useContext(ClainbowContext);
  const [files, setFiles] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageTitle, setErrorMessageTitle] = useState("");
  const [errorMessageColour, setErrorMessageColour] = useState("");
  const [errorMessagePrice, setErrorMessagePrice] = useState("");
  const [newArticle, setNewArticle] = useState(initialValue);

  //UseEffect para resetear campos del formulario de creacion de producto
  useEffect(() => {
    if (!show) {
      setNewArticle(initialValue);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    // Validaciones de entrada
    if (name === "article_name") {
      // Permitir solo texto
      if (/^[^\d_]+(?: [^\d_]+)*$/.test(value)) {
        updatedValue = value;
        setErrorMessageTitle("");
      } else {
        setErrorMessageTitle("Only text is allowed for the title");
      }
    } else if (name === "price") {
      // Permitir solo números
      if (/^\d*\.?\d*$/.test(value)) {
        updatedValue = value.replace(/,/g, ".");
        setErrorMessagePrice("");
      } else {
        setErrorMessagePrice("Only numbers are allowed for the price");
      }
    } else if (name === "colour") {
      // Permitir solo texto
      if (/^[^\d_]+(?: [^\d_]+)*$/.test(value)) {
        updatedValue = value;
        setErrorMessageColour("");
      } else {
        setErrorMessageColour("Only text is allowed for the color");
      }
    }

    setNewArticle({
      ...newArticle,
      [name]: updatedValue,
      creator_user_id: user.user_id,
    });
  };

  const handleFile = (e) => {
    setFiles(e.target.files);
  };

  const onSubmit = () => {
    if (
      newArticle.article_name &&
      newArticle.price &&
      newArticle.colour &&
      newArticle.category_id &&
      errorMessageTitle === "" &&
      errorMessagePrice === "" &&
      errorMessageColour === ""
    ) {
      //creamos en newFormData para meter los files y el articulo en un paquete para poder mandarlo al back

      const newFormData = new FormData();
      newFormData.append("infoArticle", JSON.stringify(newArticle));
      if (files) {
        for (const elem of files) {
          newFormData.append("file", elem);
        }
      }
      
      axios
        .post("http://localhost:3000/articles/addArticle", newFormData)
        .then((res) => {
          
          let articleProv = {
            article_id: res.data.article_id,
            article_name: newArticle.article_name,
            price: newArticle.price,
            colour: newArticle.colour,
            creator_city: user.city,
            creator_country: user.country,
            description: newArticle.description,
            category_id: newArticle.category_id,
            creator_user_id: newArticle.creator_user_id,
            resource_name: res.data.resource_name,
            creator_name: user.name,
            creator_last_name: user.last_name,
            user_img: user.user_img,
            article_created: res.data.article_created,
          };
          setUserArticles([...userArticles, articleProv]);
          closeModal();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setErrorMessage("Please fill in all relevant fields");
    }
  };
  
  return (
    <Modal className="p-2" show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Welcome! Create a new article to get started.</p>
        <Form className="addArticleForm">
          <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={newArticle?.article_name}
              onChange={handleChange}
              name="article_name"
            />
            <span className="errorMessage">{errorMessageTitle}</span>
          </Form.Group>

          <Form.Select
            value={newArticle?.category_id}
            onChange={handleChange}
            name="category_id"
            aria-label="Default select example"
          >
            <option>Select a category</option>
            <option value="4">Accesorios</option>
            <option value="9">Bolsos y Carteras</option>
            <option value="5">Calzado Casual</option>
            <option value="2">Calzado Deportivo</option>
            <option value="7">Calzado Formal</option>
            <option value="1">Ropa de Hombre</option>
            <option value="3">Ropa de Mujer</option>
            <option value="8">Ropa Deportiva</option>
          </Form.Select>

          <br />

          <div className="d-flex justify-content-between align-items-center colour-price">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Colour</Form.Label>
              <Form.Control
                type="text"
                value={newArticle?.colour}
                onChange={handleChange}
                name="colour"
              />
              <span className="errorMessage">{errorMessageColour}</span>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={newArticle?.price}
                onChange={handleChange}
                name="price"
              />
              <span className="errorMessage">{errorMessagePrice}</span>
            </Form.Group>
          </div>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              onChange={handleChange}
              value={newArticle?.description}
              placeholder="Write a description about your article (optional)..."
              as="textarea"
              rows={3}
              name="description"
            />
            <span className="errorMessage">{errorMessage}</span>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="fileInput">
              Images or Videos <PlusCircle />{" "}
            </Form.Label>
            <Form.Control
              id="fileInput"
              type="file"
              accept="image/*, video/*"
              multiple
              onChange={handleFile}
              hidden
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
     
        <button className="botonaco" onClick={onSubmit}>
          Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  );
};
