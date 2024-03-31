var express = require('express');
var router = express.Router();
const userControllers = require('../controllers/userControllers');
const verifyToken = require('../middlewares/verifyToken');
const multer = require('../middlewares/multerSingle');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//localhost:3000/users/register01
router.post('/register01', userControllers.register01);

//localhost:3000/users/validateAccount
router.put('/validateAccount', verifyToken, userControllers.verifyEmail);

//localhost:3000/users/register02
router.post('/register02', userControllers.register02);

//localhost:3000/users/login
router.post('/login', userControllers.login);

//localhost:3000/users/resetPassword
router.post('/checkEmail', userControllers.checkEmail);

//localhost:3000/users/resetPassword
router.post('/sendNewPasswordEmail', userControllers.sendNewPasswordEmail);

//localhost:3000/users/getOneUser/user_id
router.get('/getOneUser/:id', userControllers.getOneUser)

//localhost:3000/users/deleteUnverifiedUser/:email
router.delete('/deleteUnverifiedUser/:email', userControllers.deleteUnverifiedUser);

//localhost:3000/users/editUser
router.put('/editUser', multer("users"), userControllers.editUser)

// queremos que la peticion de todos los usuarios pase por el middleware verify
//localhost:3000/users/allUsers
router.get('/allUsers', verifyToken, userControllers.getAllUsers)

//localhost:3000/users/activate
router.put('/activate', userControllers.activate)

//localhost:3000/users/deactivate
router.put('/deactivate', userControllers.deactivate)

//localhost:3000/users/setPublicCloset/user_id
router.put('/setPublicCloset/:user_id', userControllers.setPublicCloset);

//localhost:3000/users/setPrivateCloset/user_id
router.put('/setPrivateCloset/:user_id', userControllers.setPrivateCloset);


module.exports = router;
