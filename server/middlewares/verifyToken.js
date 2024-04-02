const jwt = require('jsonwebtoken');
require('dotenv').config();

const verify = (req, res, next) =>{
    //rescatamos el token de los headers
    
    if(!req.headers.authorization){
        res.status(401).json("No token available")
    }

    let token_completo = req.headers.authorization;

      let token = token_completo.split(" ")[1];

    jwt.verify(token, 'clainbow', (err, result)=>{
        if(err){
            console.log(err);
            res.status(401).json("Access denied")
        }else{
            next()
        }
    })

}

module.exports = verify;