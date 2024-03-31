var express = require('express');
var router = express.Router();
const multerMulti = require("../middlewares/multerMulti");
const articleControllers = require('../controllers/articleControllers')

//localhost3000/articles/allArticles
router.get('/allArticles', articleControllers.getAllArticles);

//localhost3000/articles/allOtherArticles/user_id
router.get('/allOtherArticles/:user_id', articleControllers.getAllOtherArticles);

//localhost3000/articles/oneArticle
router.get('/oneArticle/:id', articleControllers.oneArticle);

//localhost3000/articles/addArticle
router.post("/addArticle", multerMulti("articles"), articleControllers.addArticle)

//localhost3000/articles/getUserArticles/:user_id
router.get("/getUserArticles/:user_id", articleControllers.getUserArticles);

//localhost3000/articles/allArticlesAdmin
router.get('/allArticlesAdmin', articleControllers.getAllArticlesAdmin);

//localhost:3000/articles/activate
router.put('/activate', articleControllers.activate)

//localhost:3000/articles/deactivate
router.put('/deactivate', articleControllers.deactivate)

//localhost:3000/articles/getUserLikedArticles/:user_id
router.get("/getUserLikedArticles/:user_id", articleControllers.getUserLikedArticles);

//localhost:3000/articles/addLike
router.post("/addLike", articleControllers.addLike)

//localhost:3000/articles/deleteLike
router.delete("/deleteLike/:user_id/:article_id", articleControllers.deleteLike)

//localhost:3000/articles/getBestSolds
router.get("/getBestSolds", articleControllers.getBestSolds);

//localhost:3000/articles/getNewProducts
router.get("/getNewProducts", articleControllers.getNewProducts);

//localhost:3000/articles/getTopCategories
router.get("/getTopCategories", articleControllers.getTopCategories);

//localhost:3000/articles/getArticlesMayLike/article_id/category_id
router.get("/getArticlesMayLike/:article_id/:category_id", articleControllers.getArticlesMayLike);

//localhost:3000/articles/shoppingCart
router.get("/shoppingCart/:article_id", articleControllers.getShoppingCart);

//localhost:3000/articles/orderArticle
router.post("/orderArticles/:user_id", articleControllers.orderArticles);

//localhost:3000/articles/search/user_id/filter
router.get("/search/:user_id/:filter", articleControllers.search);

//localhost:3000/articles/orderedArticles
router.get("/orderedArticles/:user_id", articleControllers.getOrderedArticles);



module.exports = router;
