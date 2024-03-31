import React, { useContext, useEffect, useState } from "react";
import "./adminArticles.scss";
import { Button, Table } from "react-bootstrap";
import { ClainbowContext } from "../../Context/ClainbowProvider";
import axios from "axios";

export const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [reset, setReset] = useState(false);
  // me traigo el token del context
  const { token, user } = useContext(ClainbowContext);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios
        .get(`http://localhost:3000/articles/allArticlesAdmin`)
        .then((res) => {
          setArticles(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [reset, token]);

  const onDisable = (id, status) => {
    let url = "http://localhost:3000/articles/activate";

    if (!status) {
      url = "http://localhost:3000/articles/deactivate";
    }

    axios
      .put(url, { id })
      .then(() => setReset(!reset))
      .catch((err) => console.log(err));
  };

  return (
    <div className="adminArticles-right">
      <Table striped responsive>
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Article</th>
            <th className="d-none d-md-table-cell">Price</th>
            <th className="d-none d-xxl-table-cell">Colour</th>
            <th className="d-none d-xl-table-cell">Description</th>
            <th className="d-none d-lg-table-cell">Created</th>
            <th className="d-none d-md-table-cell">Created by</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {articles?.map((elem) => (
            <tr key={elem.article_id}>
              <td>{elem.article_id}</td>
              <td>
                {elem?.resource_name && elem?.resource_name.endsWith(".mp4") ? (
                  <video
                    className="imagenCard"
                    controls
                  >
                    <source
                      src={`http://localhost:3000/images/articles/${elem.resource_name}`}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <img
                    className="imagenCard"
                    src={`http://localhost:3000/images/articles/${
                      elem?.resource_name || "default.png"
                    }`}
                    alt="ArticlePicture"
                  />
                )}
              </td>
              <td>{elem.article_name}</td>
              <td className="d-none d-md-table-cell">${elem.price}</td>
              <td className="d-none d-xxl-table-cell">{elem.colour}</td>
              <td className="d-none d-xl-table-cell">{elem.description}</td>
              <td className="d-none d-lg-table-cell">{elem.article_created}</td>
              <td className="d-none d-md-table-cell">
                {elem.name} {elem.last_name}
              </td>
              <td>{elem.article_isdisabled ? "Inactive" : "Active"}</td>
              <td>
                <Button
                  style={{
                    backgroundColor: "#B88D19",
                    color: "white",
                    borderRadius: "20px",
                    width: "100px",
                    transition: "transform 0.3s",
                    border: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(0.95)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  onClick={() =>
                    onDisable(elem.article_id, elem.article_isdisabled)
                  }
                >
                  {elem.article_isdisabled ? "Enable" : "Disable"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
