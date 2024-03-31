const connection = require("../config/db");
const formatDate = require("../utils/formatDate");

class ArticleControllers {
  getAllArticles = (req, res) => {
    let sql = `SELECT  
    article.*,
    creator.city AS creator_city,
    creator.country AS creator_country,
    creator.name AS creator_name,
    creator.last_name AS creator_last_name,
    creator.user_img AS creator_user_img,
    creator.user_isdeleted AS creator_user_isdeleted,
    user.user_isdeleted AS liker_user_isdeleted,
    user.city AS liker_city,
    user.country AS liker_country,
    user.name AS liker_name,
    user.last_name AS liker_last_name,
    user.user_img AS liker_user_img,
    user_likes_article.article_id AS likedid,
    (SELECT resource_name FROM resource WHERE article.article_id = resource.article_id LIMIT 1) AS resource_name 
FROM 
    article 
LEFT JOIN 
    user AS creator ON article.creator_user_id = creator.user_id 
LEFT JOIN 
    user_likes_article ON article.article_id = user_likes_article.article_id 
LEFT JOIN 
    user ON user_likes_article.user_id = user.user_id 
WHERE 
    creator.user_isdeleted = 0 
    AND article.article_isdisabled = 0 
    AND creator.user_isdisabled = 0`;

    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  };

  getAllOtherArticles = (req, res) => {
    const {user_id} = req.params;

    let sql = `SELECT  article.*, user.user_isdeleted, user.city, user.country, user.name AS creator_user_name, user.last_name AS creator_user_last_name, user_likes_article.article_id as likedid, user.user_img AS creator_user_img,
    (SELECT resource_name FROM resource WHERE article.article_id = resource.article_id LIMIT 1) AS resource_name FROM article LEFT JOIN user ON article.creator_user_id = user.user_id LEFT JOIN user_likes_article ON article.article_id = user_likes_article.article_id WHERE user.user_id != ${user_id} AND user.user_isdeleted = 0 AND article.article_isdisabled = 0 AND user.user_isdisabled = 0;`;

    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  };

  oneArticle = (req, res) => {
    const { id } = req.params;

    let sql = `SELECT article.article_id, article.*, user.*, resource.*, category.category_name 
    FROM user 
    LEFT JOIN article ON user.user_id = article.creator_user_id 
    LEFT JOIN resource ON article.article_id = resource.article_id 
    LEFT JOIN category ON article.article_id = category.category_id 
    WHERE article.article_isdeleted = 0 AND user.user_isdeleted = 0 AND article.article_isdisabled = 0 AND user.user_isdisabled = 0 AND article.article_id = ${id}`;

   

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };
  addArticle = (req, res) => {
    //la peticion llega bien al back (tanto el req.body como el req.file)
    const {
      article_name,
      price,
      colour,
      description,
      category_id,
      creator_user_id,
    } = JSON.parse(req.body.infoArticle);
    const precio = parseFloat(price);
    const cat_id = parseInt(category_id);
    let sql = `INSERT INTO article (article_name, price, colour, description, creator_user_id, category_id) VALUES ("${article_name}",${precio} , "${colour}","${description}", ${creator_user_id} , ${cat_id})`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
       
        let article_id = result.insertId;
        
        try {
          this.saveArticleImages(req.files, article_id, res);
        } catch (err) {
          res.status(500).json(err);
        }
        
        let sql2 = `SELECT article_created FROM article WHERE article_id = ${article_id}`

        connection.query(sql2, (error2, result2)=> {
          if(error2){
            res.status(500).json(error2)
          }
  
          if (req.files.length > 0) {
          return res
            .status(200)
            .json({ article_id, article_created: result2[0].article_created, resource_name: req.files[0].filename });
           } else {
              return res
              .status(200)
              .json({ article_id, article_created: result2[0].article_created, resource_name: "default.png" });
           }
        })
        
      }
    });
  };
  saveArticleImages = (images, article_id, res) => {
    images.forEach((img) => {
      let sql = `INSERT INTO resource (resource_name, article_id) VALUES ("${img.filename}", ${article_id})`;
      connection.query(sql, (error, result) => {
        if (error) {
          res.status(500).json(error);
        }
      });
    });
  };
  getUserArticles = (req, res) => {
    const { user_id } = req.params;
    let sql = `SELECT  
    article.*,
    creator.city AS creator_city,
    creator.country AS creator_country,
    creator.name AS creator_name,
    creator.last_name AS creator_last_name,
    creator.user_img AS creator_user_img,
    creator.user_isdeleted AS creator_user_isdeleted,
    user.user_isdeleted AS liker_user_isdeleted,
    user.city AS liker_city,
    user.country AS liker_country,
    user.name AS liker_name,
    user.last_name AS liker_last_name,
    user.user_img AS liker_user_img,
    (SELECT resource_name FROM resource WHERE article.article_id = resource.article_id LIMIT 1) AS resource_name 
FROM 
    article 
JOIN 
    user AS creator ON article.creator_user_id = creator.user_id 
LEFT JOIN 
    user_likes_article ON article.article_id = user_likes_article.article_id 
LEFT JOIN 
    user ON user_likes_article.user_id = user.user_id 
WHERE 
    article.creator_user_id = ${user_id} 
    AND article.article_isdisabled = 0 
    AND creator.user_isdisabled = 0 
    AND creator.user_isdeleted = 0
`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };
  getAllArticlesAdmin = (req, res) => {
    let sql = `SELECT article.*, user.user_isdeleted, user.name, user.last_name, user.user_id, (SELECT resource_name FROM resource WHERE article.article_id = resource.article_id LIMIT 1) AS resource_name FROM article JOIN user ON article.creator_user_id = user.user_id WHERE user.user_isdeleted = 0 ORDER BY article.article_id DESC`;

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        // Iterar sobre cada objeto en el array
        result.forEach(function (article) {
          // Formatear la fecha de article_created
          article.article_created = formatDate(article.article_created);
        });
        res.status(200).json(result);
      }
    });
  };
  activate = (req, res) => {
    const { id } = req.body;
    let sql = `UPDATE article SET article_isdisabled = 0 WHERE article_id = ${id}`;
    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  };
  deactivate = (req, res) => {
    const { id } = req.body;
    let sql = `UPDATE article SET article_isdisabled = 1 WHERE article_id = ${id}`;
    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  };
  getUserLikedArticles = (req, res) => {
    const { user_id } = req.params;
    let sql = `SELECT 
    article.*,
    creator.city AS creator_city,
    creator.country AS creator_country,
    creator.name AS creator_name,
    creator.last_name AS creator_last_name,
    creator.user_img AS creator_user_img,
    creator.user_isdeleted AS creator_isdeleted,
    creator.user_id AS creator_user_id,
    (SELECT resource_name FROM resource WHERE article.article_id = resource.article_id LIMIT 1) AS resource_name
FROM 
    user_likes_article
JOIN 
    article ON user_likes_article.article_id = article.article_id
JOIN
    user AS creator ON article.creator_user_id = creator.user_id
WHERE 
    user_likes_article.user_id = ${user_id}
    AND creator.user_isdeleted = 0
    AND article.article_isdisabled = 0
    AND creator.user_isdisabled = 0`;
    
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };
  addLike = (req, res) => {
    const { user_id, article_id } = req.body;
    let sql = `INSERT INTO user_likes_article (user_id, article_id) VALUES (${user_id}, ${article_id})`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };
  deleteLike = (req, res) => {
    const { user_id, article_id } = req.params;
    let sql = `DELETE FROM user_likes_article WHERE article_id = ${article_id} AND user_id = ${user_id}`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };
  getBestSolds = (req, res) => {
    let sql = `SELECT
    order_article.article_id,
    COUNT(order_article.article_id) AS total_sales,
    MAX(order_article.order_date) AS last_sale_date,
    MAX(user.name) AS name,
    MAX(user.last_name) AS last_name,
    MAX(user.passport) AS passport,
    MAX(user.email) AS email,
    MAX(user.phone_number) AS phone_number,
    MAX(user.address) AS address,
    MAX(user.city) AS city,
    MAX(user.country) AS country,
    MAX(user.public_closet) AS public_closet,
    MAX(article.article_name) AS article_name,
    MAX(article.price) AS price,
    MAX(article.colour) AS colour,
    MAX(article.description) AS article_description,
    MAX(article.article_created) AS article_created,
    MAX(article.creator_user_id) AS creator_user_id,
    MAX(resource.resource_id) AS resource_id,
    MAX(resource.resource_name) AS resource_name,
    MAX(category.category_name) AS category_name,
    MAX(user_likes_article.user_id) AS liked_by_user_id,
    MAX(creator.name) AS creator_name,
    MAX(creator.last_name) AS creator_last_name,
    MAX(creator.city) AS creator_city,
    MAX(creator.country) AS creator_country,
    MAX(creator.user_img) AS user_img
FROM
    order_article
JOIN
    user ON order_article.user_id = user.user_id
JOIN
    article ON order_article.article_id = article.article_id
LEFT JOIN
    resource ON article.article_id = resource.article_id
JOIN
    category ON article.category_id = category.category_id
LEFT JOIN
    user_likes_article ON article.article_id = user_likes_article.article_id
JOIN
    user AS creator ON article.creator_user_id = creator.user_id
GROUP BY
    order_article.article_id
ORDER BY
    total_sales DESC;
`;

    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  };
  getNewProducts = (req, res) => {
    let sql = `SELECT
    article.*,
    creator.city AS creator_city,
    creator.country AS creator_country,
    user.user_isdeleted,
    user.user_id,
    creator.name AS creator_name,
    creator.last_name AS creator_last_name,
    user.user_img AS creator_user_img,
    (SELECT resource_name FROM resource WHERE article.article_id = resource.article_id LIMIT 1) AS resource_name
FROM
    article
JOIN
    user ON article.creator_user_id = user.user_id
JOIN
    user AS creator ON article.creator_user_id = creator.user_id
WHERE
    user.user_isdeleted = 0
    AND article.article_isdisabled = 0
    AND user.user_isdisabled = 0
ORDER BY
    article.article_created DESC;
`;
    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  };
  getTopCategories = (req, res) => {
    let sql = `SELECT
    article.*,
    creator.name AS creator_name,
    creator.last_name AS creator_last_name,
    creator.city AS creator_city,
    creator.country AS creator_country,
    creator.user_img AS user_img,
    user.user_isdeleted,
    user.user_id,
    user.name AS creator_user_name,
    user.last_name AS creator_user_last_name,
    (SELECT resource_name FROM resource WHERE article.article_id = resource.article_id LIMIT 1) AS resource_name
FROM
    user_likes_article
JOIN
    user ON user_likes_article.user_id = user.user_id
JOIN
    article ON user_likes_article.article_id = article.article_id
JOIN
    user AS creator ON article.creator_user_id = creator.user_id
WHERE
    user.user_isdeleted = 0
    AND article.article_isdisabled = 0
    AND user.user_isdisabled = 0;
`;
    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  };
  getArticlesMayLike = (req, res) => {
    const { article_id, category_id } = req.params;
    const sql = `SELECT 
    article.*,
    creator.name AS creator_name,
    creator.last_name AS creator_last_name,
    creator.city AS creator_city,
    creator.country AS creator_country,
    user.user_id AS creator_user_id,
    user.*,
    user.name AS creator_user_name,
    user.last_name AS creator_user_last_name,
    user.user_img AS creator_user_img,
    user_likes_article.user_id AS liking_user_id,
    resource.*
FROM 
    article
LEFT JOIN 
    user ON article.creator_user_id = user.user_id
LEFT JOIN 
    user AS creator ON article.creator_user_id = creator.user_id
LEFT JOIN 
    user_likes_article ON article.article_id = user_likes_article.article_id
LEFT JOIN 
    resource ON article.article_id = resource.article_id
WHERE 
    article.article_isdeleted = 0 
    AND article.article_isdisabled = 0 
    AND user.user_isdeleted = 0 
    AND user.user_isdisabled = 0 
    AND article.category_id = ${category_id} 
    AND article.article_id != ${article_id}`;

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  getShoppingCart = (req, res) => {
    const { article_id } = req.params;

    let sql = `SELECT article.article_id, article.*, user.*, resource.*, category.category_name 
    FROM user 
    LEFT JOIN article ON user.user_id = article.creator_user_id 
    LEFT JOIN resource ON article.article_id = resource.article_id 
    LEFT JOIN category ON article.article_id = category.category_id 
    WHERE article.article_isdeleted = 0 AND user.user_isdeleted = 0 AND article.article_isdisabled = 0 AND user.user_isdisabled = 0 AND article.article_id = ${article_id}`;

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

  orderArticles = (req, res) => {
    const { user_id } = req.params;
    const orderArticles = req.body;

    orderArticles.forEach((item) => {
      const { article_id, amount } = item;

      const sql = `INSERT INTO order_article (user_id, article_id, amount) VALUES (${user_id}, ${article_id}, ${amount})`;

      connection.query(sql, (err, result) => {
        if (err) {
          res.status(500).json(err);
        }
      });

      if (res) {
        res.status(200).json({ message: "Order processed successfully" });
      }
    });
  };

  getOrderedArticles = (req, res) => {
    const { user_id } = req.params;

    let sql = `SELECT 
    order_article.order_article_id,
    order_article.user_id,
    order_article.article_id,
    SUM(order_article.amount) AS total_amount,
    order_article.order_date,
    user.name AS name,
    user.last_name AS last_name,
    user.passport,
    user.email,
    user.phone_number,
    user.address,
    user.city,
    user.country,
    user.user_img,
    article.article_name,
    article.price,
    article.colour,
    article.description,
    article.article_created,
    article.creator_user_id,
    article.category_id,
    MAX(resource.resource_id) AS resource_id,
    MAX(resource.resource_name) AS resource_name,
    category.category_name,
    MAX(user_likes_article.user_id) AS liked_by_user_id,
    MAX(creator.name) AS creator_name,
    MAX(creator.last_name) AS creator_last_name,
    MAX(creator.city) AS creator_city,
    MAX(creator.country) AS creator_country,
    MAX(creator.user_img) AS creator_user_img
FROM 
    order_article
JOIN 
    user ON order_article.user_id = user.user_id
JOIN 
    article ON order_article.article_id = article.article_id
LEFT JOIN 
    resource ON article.article_id = resource.article_id
JOIN 
    category ON article.category_id = category.category_id
LEFT JOIN 
    user_likes_article ON article.article_id = user_likes_article.article_id
JOIN 
    user AS creator ON article.creator_user_id = creator.user_id
WHERE 
    user.user_id = ${user_id}
GROUP BY 
    order_article.order_article_id,
    order_article.user_id,
    order_article.article_id,
    order_article.order_date,
    user.name,
    user.last_name,
    user.passport,
    user.email,
    user.phone_number,
    user.address,
    user.city,
    user.country,
    user.user_img,
    article.article_name,
    article.price,
    article.colour,
    article.description,
    article.article_created,
    article.creator_user_id,
    article.category_id,
    category.category_name`;

    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  }

   search = (req, res) => {
    const {user_id, filter} = req.params;
    const terms = filter.trim().split(" ");

    let sql = `
    SELECT 
    article.article_id,
    MAX(article.article_name) AS article_name,
    MAX(article.price) as price,
        article.colour,
    article.article_created,
    article.article_isdeleted,
        article.article_isdisabled,
        
    MAX(article.category_id) AS category_id,
    MAX(category.category_name) AS category_name,
    MAX(resource.resource_name) AS resource_name,
    MAX(creator.name) AS creator_name,
    MAX(creator.last_name) AS creator_last_name,
    MAX(creator.city) AS creator_city,
    MAX(creator.country) AS creator_country,
    MAX(creator.user_img) AS creator_user_img,
    MAX(CASE WHEN user_likes_article.user_id = 1 THEN true ELSE false END) AS logged_user_likes_article
FROM 
    article
LEFT JOIN 
    user_likes_article ON user_likes_article.article_id = article.article_id
LEFT JOIN 
    category ON article.category_id = category.category_id
LEFT JOIN 
    resource ON article.article_id = resource.article_id 
LEFT JOIN
    user AS creator ON article.creator_user_id = creator.user_id`


    for (let term of terms) {
        sql += ` WHERE (
            article.article_name LIKE "%${term}%" OR 
            article.description LIKE "%${term}%" OR
            article.colour LIKE "%${term}%" OR
            article.fabric LIKE "%${term}%" OR
            article.price LIKE "%${term}%" OR
            category.category_name LIKE "%${term}%" OR
            creator.name LIKE "%${term}%" OR
            creator.last_name LIKE "%${term}%"
        )
        GROUP BY
        article.article_id`;
    }

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  };

}

module.exports = new ArticleControllers();
