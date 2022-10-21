const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const { Op } = require("sequelize");

const {
    User
  } = require("../models/models");


  class StructureControllers{

      async structure(req, res, next) {

        const { limit, offset } = req.query;
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
          where: { username: decodeToken.username },
        });
        const result = await User.findAll({
          where:{referal_id: user.id, id: {[Op.not]: 1} }
        })
        return res.json({ items: result });

      }
  }

  
module.exports = new StructureControllers();