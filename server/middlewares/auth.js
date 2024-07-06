const jwt = require("jsonwebtoken");
const db = require("../models");

const verifyUser = async (req, res,next) => {
  try {
    const token = req.cookies["auth-token"];
    if (!token) {
      return res.status(401).json("Bad request");
    }
    console.log('token', token)
    console.log('process.env.JWT_SECRET',process.env.JWT_SECRET )
    jwt.verify(token, process.env.JWT_SECRET,  { algorithms: ['HS256'] }, async (err, decodedUser) => {
      if (err) {
        console.log('error message', err)
        return res.status(500).json({
          code: "INTERNAL ERROR",
          message: err.message,
        });
      }
      const user = await db.users.findOne({
        where: {
          access_token: token, 
          id: decodedUser.id,
        },
      });
      if (user) {
        req.user = user;
        next();
      } else {

        return res.status(401).json({
          code: "UNAUTHORIZED",
          message: "Token with user do not exist",
        });
      }
    });
  } catch (error) {
    console.log('errror from middelware', error)
  }
};

module.exports = {
  verifyUser,
};
