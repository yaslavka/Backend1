const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const { Op } = require("sequelize");

const {
  CloneStat,
  TypeMatrix,
  Matrix_Table,
  User,
  Matrix,
} = require("../models/models");

class MatrixController {
  async createCount(req, res, next) {
    const { level, count } = req.body;
    const countDb = await CloneStat.create({ level, count });
    return res.json({ countDb });
  }
  async createType(req, res, next) {
    const { name, summ } = req.body;
    const type = await TypeMatrix.create({ name, summ });
    return res.json({ type });
  }

  async getCount(req, res, next) {
    const count = await CloneStat.findAll();
    return res.json({ items: count });
  }
  async getType(req, res, next) {
    const type = await TypeMatrix.findAll();
    return res.json({ items: type });
  }
  async structureUpper(req, res, next) {
    const { matrix_id } = req.query;

    if (matrix_id) {
      const rootUserId = (await Matrix.findOne({ where: { id: matrix_id } }));
      const rootUser = await User.findOne({ where: { id: rootUserId.userId } });
      const downUsers = await Matrix_Table.findAll({
        where: { matrix_parent_id: matrix_id },
        include: {
          model: User,
          as: "user",
          where:{ id: {[Op.not]: 1} },
          include: {model: Matrix, as: 'matrix'}
        },
      });

      let result = {
        0: {
          id: rootUserId.parent_id,
          username: rootUser.username,
          avatar: rootUser.avatar,
          typeId: null,
          place: 0,
          createdAt: rootUser.createdAt,
        },
      };

      if (downUsers) {
        downUsers.map((item, index) => {
          result[index + 1] = {
            id: downUsers[index].user.matrix[downUsers[index].type_matrix_id - 1].id,
            username: downUsers[index].user.username,
            avatar: downUsers[index].user.avatar,
            typeId: null,
            place: 0,
            createdAt: downUsers[index].user.createdAt,
          };
        });
      }

      return res.json({ items: result });
    }
  }

  async structure(req, res, next) {
    const { matrix_type, matrix_id } = req.query;

    if (matrix_id) {
      const rootUserId = await Matrix.findOne({ where: { id: matrix_id } });
      const rootUser = await User.findOne({ where: { id: rootUserId.userId } });
      const downUsers = await Matrix_Table.findAll({
        where: { matrix_parent_id: matrix_id },
        include: {
          model: User, 
          as: "user",
          where:{ id: {[Op.not]: 1} },
          include: {model: Matrix, as: 'matrix'}
        },
      });

      let result = {
        0: {
          id: rootUserId.parent_id,
          username: rootUser.username,
          avatar: rootUser.avatar,
          typeId: null,
          place: 0,
          createdAt: rootUser.createdAt,
        },
      };

      if (downUsers) {
        downUsers.map((item, index) => {
          result[index + 1] = {
            id: downUsers[index].user.matrix[downUsers[index].type_matrix_id - 1].id,
            username: downUsers[index].user.username,
            avatar: downUsers[index].user.avatar,
            typeId: null,
            place: 0,
            createdAt: downUsers[index].user.createdAt,
          };
        });
      }

      return res.json({ items: result });
    }

    if (matrix_type) {
      const { authorization } = req.headers;
      const token = authorization.slice(7);
      const { username } = jwt_decode(token);

      const user = await User.findOne({ where: { username } });

      const root_matrix_tables = await Matrix_Table.findAll({
        where: { type_matrix_id: matrix_type, userId: user.dataValues.id },
        include: {
          model: User,
          as: "user",
          include: { model: Matrix, as: "matrix" },
        },
      });
      const down_matrix_tables = await Matrix_Table.findAll({
        where: {
          type_matrix_id: matrix_type,
          userId: { [Op.not]: user.dataValues.id },
          // matrix_parent_id: user.dataValues.id
        },
        include: {
          model: User,
          as: "user",
          where: { referal_id: user.dataValues.id },
          include: { model: Matrix, as: "matrix" },
        },
      });

      if (!root_matrix_tables) {
        return next(ApiError.badRequest("root пользователей не найден"));
      }

      let result = {
        0: {
          id: root_matrix_tables[0].matrix_parent_id,
          username: root_matrix_tables[0].user.username,
          avatar: root_matrix_tables[0].user.avatar,
          typeId: null,
          place: 0,
          createdAt: root_matrix_tables[0].createdAt,
        },
      };

      if (down_matrix_tables) {
        down_matrix_tables.map((item, index) => {
          result[index + 1] = {
            id: down_matrix_tables[index].matrix_parent_id,
            username: down_matrix_tables[index].user.username,
            avatar: down_matrix_tables[index].user.avatar,
            typeId: null,
            place: 0,
            createdAt: down_matrix_tables[index].createdAt,
          };
        });
      }

      return res.json({ items: result });
    }

  }
}

module.exports = new MatrixController();
 