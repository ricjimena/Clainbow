const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../services/nodemailer");
const genToken = require("../utils/tokengenerator");

class UserControllers {
  register01 = (req, res) => {
    const { email, password } = req.body;

    // Hash the password
    let SaltRounds = 8;

    bcrypt
      .genSalt(SaltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) => {
        // Insert user data into the database with is_verified set to 0
        let sql = `INSERT INTO user (email, password) VALUES ("${email}", "${hash}")`;

        connection.query(sql, (error, result) => {
          if (error) {
            res.status(500).json(error);
          } else {
            let token = genToken(result.insertId);
            sendVerificationEmail(email, token);
            return res.status(200).json({ email, message: "UserVerified" });
          }
        });
      })
      .catch((error) => {
        console.error("Error processing registration:", error);
        res.status(500).json("Error processing registration.");
      });
  };

  verifyEmail = (req, res) => {
    // recoger el token

    let token_completo = req.headers.authorization;
    let token = token_completo.split(" ")[1];
    
    try {
      // descodificar el token para poder extraer después el user_id
      const tokenDescodificado = jwt.verify(token, process.env.SECRET);
      
      // acceder al user_id del token descodificado
      const user_id = tokenDescodificado.id;

      // verificar campo user_isverified de la bd
      let sql = `SELECT user_isverified FROM user WHERE user_id = ${user_id} AND user_isdeleted = 0`;

      connection.query(sql, (error, result) => {
        if (error) {
          console.log("Error al consultar la base de datos:", error);
        } else {
          if (result.length > 0) {
            const user_isverified = result[0].user_isverified;
            
            if (user_isverified === 1) {
              console.log("El usuario está verificado.");
              // Si está verificado redirigir al login
              res.status(200).json({ status: "Complete" });
            } else {
              console.log("El usuario no está verificado.");
              // Procedemos a actualizar la BD y cambiamos el valor de user_isverified

              const sql2 = `UPDATE user SET user_isverified = 1 WHERE user_id = ${user_id} AND user_isdeleted = 0`;

              connection.query(sql2, (error2, result2) => {
                if (error2) {
                  console.log(
                    "Error al actualizar el estado de verificación:",
                    error2
                  );
                } else {
                  console.log("Usuario verificado correctamente.");
                  // Redirigir al formulario de registro 2.
                  res.status(200).json({ user_id, status: "NotCompleted" });
                }
              });
            }
          } else {
            console.log("Usuario no encontrado en la base de datos.");
          }
        }
      });
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  };

  register02 = (req, res) => {
    const {
      user_id,
      name,
      last_name,
      passport,
      phone_number,
      address,
      city,
      country,
    } = req.body;

    if (
      (!user_id,
      !name ||
        !last_name ||
        !passport ||
        !phone_number ||
        !address ||
        !city ||
        !country)
    ) {
      return res.status(400).json({ message: "UncompletedForm" });
    }

    let sql = `UPDATE user SET name = "${name}", last_name = "${last_name}", passport = "${passport}", phone_number = "${phone_number}", address = "${address}", city = "${city}", country = "${country}" WHERE user_id = ${user_id}`;

    connection.query(sql, (error, result) => {
      error ? res.status(500).json(error) : res.status(200).json(result);
    });
  };

  login = (req, res) => {
    const { email, password } = req.body;
    
    let sql = `SELECT * FROM user WHERE email = "${email}" AND user_isdeleted = 0 AND user_isdisabled = 0`;

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else if (!result || !result.length || result[0].user_isdeleted == 1) {
        res.status(401).json("Access denied");
      } else {
        const hash = result[0].password;
        // comparo password con el hash en BD
        bcrypt.compare(password, hash, (errHash, response) => {
          if (errHash) {
            res.status(500).json(errHash);
          }
          if (response) {
            // mandar token
            const token = jwt.sign(
              {
                user: {
                  id: result[0].user_id,
                },
              },
              process.env.SECRET,
              { expiresIn: "5d" }
            );
            let sql2 = `select article_id from user_likes_article where user_id = ${result[0].user_id}`;
            connection.query(sql2, (err2, result2) => {
              if (err2) {
                res.status(500).json(err2);
              } else {
                res
                  .status(200)
                  .json({ token, user: result[0], favourites: result2 });
              }
            });
          } else {
            res.status(401).json("Access denied");
          }
        });
      }
    });
  };

  checkEmail = (req, res) => {
    const { email } = req.body;

    // Buscamos si el e-mail está en la bd: cuántas filas coinciden con el correo electrónico proporcionado. Si el valor devuelto es mayor que cero, significa que el correo electrónico existe en la bd.
    const sql = `SELECT COUNT(email) AS count FROM user WHERE email = "${email}" AND user_isdeleted = 0`;

    connection.query(sql, (error, result) => {
      if (error) {
        console.log("Error checking email:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        // Mando el resultado de la consulta al front
        res.status(200).json(result);
      }
    });
  };

  sendNewPasswordEmail = (req, res) => {
    const { email } = req.body;

    // Generate a new password
    const newPassword = Math.random().toString(36).slice(-8);

    // Hash the newPassword
    const SaltRounds = 8;
    bcrypt.genSalt(SaltRounds, (saltError, salt) => {
      if (saltError) {
        console.error("Error generating salt:", saltError);
        return res.status(500).json({ message: "Internal server error" });
      }

      bcrypt.hash(newPassword, salt, (hashError, hashedPassword) => {
        if (hashError) {
          console.error("Error hashing password:", hashError);
          return res.status(500).json({ message: "Internal server error" });
        }

        // Update the password in the database
        const sql = `UPDATE user SET password = "${hashedPassword}" WHERE email = "${email}" AND user_isdeleted = 0`;

        connection.query(sql, (error, result) => {
          if (error) {
            console.error("Error updating password:", error);
            return res.status(500).json({ message: "Internal server error" });
          }

          // Check if at least one row was affected in the database
          if (result.affectedRows > 0) {
            // Send the email with the new password
            sendPasswordResetEmail(email, newPassword, (emailError) => {
              if (emailError) {
                console.error(
                  "Error sending password reset email:",
                  emailError
                );
                return res
                  .status(500)
                  .json({ message: "Error sending password reset email" });
              }

              // Send a response to the client
              res.status(200).json({
                message:
                  "Password reset successful. Check your email for the new password.",
              });
            });
          } else {
            // If no row was updated, the email is not found in the database
            res.status(404).json({ message: "Email not found." });
          }
        });
      });
    });
  };

  getOneUser = (req, res) => {
    const { id } = req.params;
    let sql = `SELECT * FROM user WHERE user_id = ${id} AND user_isdeleted = 0 AND user_isdisabled = 0`;

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        let sql2 = `SELECT 
        article.*,
        user.user_id AS creator_user_id,
        user.*,
        resource.resource_id,
	    resource.resource_name,
        resource.resource_isdeleted
        FROM 
        article 
        JOIN 
        user  ON article.creator_user_id = user.user_id
        JOIN 
        user_likes_article ON article.article_id = user_likes_article.article_id
        LEFT JOIN 
        resource  ON article.article_id = resource.article_id
        WHERE 
        article.article_isdeleted = 0
        AND
        user.user_id = ${id}`;
        
        connection.query(sql2, (err2, result2) => {
          if (err) {
            res.status(500).json(err2);
          } else {
            res.status(200).json({ favourites: result2, user: result[0] });
          }
        });
      }
    });
  };

  deleteUnverifiedUser = (req, res) => {
    const { email } = req.params;

    const sql = `DELETE FROM user WHERE email = "${email}" AND user_isverified = 0`;

    connection.query(sql, (error, result) => {
      error
        ? res.status(500).json("Error deleting user from database")
        : res.status(200).json("User deleted from database");
    });
  };

  editUser = (req, res) => {
    
    const {
      name,
      last_name,
      passport,
      phone_number,
      address,
      city,
      country,
      user_id,
    } = JSON.parse(req.body.edittedUser);

    let img = "";

    if (req.file != undefined) {
      img = `, user_img = "${req.file.filename}"`;
    }

    let sql = `UPDATE user SET name = "${name}", last_name = "${last_name}", passport = "${passport}", phone_number = "${phone_number}", address = "${address}", city = "${city}", country = "${country}" ${img} WHERE user_id = ${user_id}`;

    connection.query(sql, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({ result, newImg: req.file?.filename });
      }
    });
  };

  getAllUsers = (req, res) => {
    let sql = "SELECT * FROM user WHERE user_type = 2 ORDER BY user_id DESC";

    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  };

  activate = (req, res) => {
    const { id } = req.body;
    let sql = `UPDATE user SET user_isdisabled = 0 WHERE user_id= ${id}`;

    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  };

  deactivate = (req, res) => {
    const { id } = req.body;
    let sql = `UPDATE user SET user_isdisabled = 1 WHERE user_id= ${id}`;

    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json(result);
    });
  };
  
  setPublicCloset = (req, res) => {
    const { user_id } = req.params;
    let sql = `UPDATE user SET public_closet = 1 WHERE user_id= ${user_id}`;

    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json({result, message: "Public"});
    });
  }

  setPrivateCloset = (req, res) => {
    const { user_id } = req.params;
    let sql = `UPDATE user SET public_closet = 0 WHERE user_id= ${user_id}`;

    connection.query(sql, (err, result) => {
      err ? res.status(500).json(err) : res.status(200).json({result, message: "Private"});
    });
  }
}

module.exports = new UserControllers();
