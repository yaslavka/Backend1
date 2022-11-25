const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const { User, Key, Matrix_Table, Matrix } = require("../models/models");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

const generateJwt = (id, email, username, first_name, last_name, referral) => {
  return jwt.sign(
    {
      id,
      email: email,
      first_name: first_name,
      last_name: last_name,
      referral: referral,
      username: username,
    },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
};

const highCheck = async (level, user, idCreateUser) => {
  const parent = await User.findOne({ where: { id: user.referal_id } });
  const parentSecond = parent.id === parent.referal_id ? parent : await User.findOne({ where: { id: parent.referal_id } });
  const parentThird = parentSecond.id === parent.referal_id ? parentSecond : await User.findOne({
    where: { id: parentSecond.referal_id },
  });
  switch (level) {
    case 1:
      if (user.referal_id === idCreateUser) {
        return true;
      } else false;
      break;
    case 2:
      if (parent.referal_id === idCreateUser) {
        return true;
      } else false;
      break;
    case 3:
      if (parentSecond.referal_id === idCreateUser) {
        return true;
      } else false;
      break;
    case 4:
      if (parentThird.referal_id === idCreateUser) {
        return true;
      } else false;
      break;
    default:
      return false;
  }
};

class UserController {
  async registration(req, res, next) {
    const {
      email,
      first_name,
      last_name,
      password,
      phone,
      referral,
      username,
    } = req.body;

    if (
      !email ||
      !password ||
      !last_name ||
      !first_name ||
      !phone ||
      !referral ||
      !username
    ) {
      return next(ApiError.badRequest("Не все поля заполнены"));
    }
    const candidate =
      (await User.findOne({ where: { email } || { username } })) || null;
    if (candidate) {
      return next(ApiError.badRequest("Такой пользователь уже существует"));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const referralUser = await User.findOne({ where: { username: referral } });
    if (!referralUser) {
      return next(ApiError.badRequest("Такой пользователь не существует"));
    }
    const user = await User.create({
      email,
      username,
      first_name,
      last_name,
      password: hashPassword,
      phone,
      referal_id: referralUser.id,
    });
    // const basket = await Basket.create({userId: user.id})
    const access_token = generateJwt(
      user.id,
      user.email,
      user.username,
      user.first_name,
      user.last_name,
      user.referral
    );
    return res.json({ access_token });
  }
  async addKey(req, res, next) {
    const { username, level, password, phone } = req.body;
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);

    if (!level || !password || !phone || !username) {
      return next(ApiError.badRequest("Не все поля заполнены"));
    }
    const userId = (
      await User.findOne({ where: { username: decodeToken.username } })
    )?.id;
    const userKey = await User.findOne({ where: { username } });
    if (!userKey) {
      return next(ApiError.badRequest("Такой пользователь не существует"));
    }

    const bool = highCheck(level, userKey, userId);
    if (bool){
      return next(ApiError.badRequest(`Вы не можете создать ключь ${level} уровня для этого пользователя`));
    }
    const candidate = await Matrix_Table.findAll({ where: { userId: userId } });
    const countCandidate = candidate.length;
    if (countCandidate === 0) {
      return next(ApiError.badRequest("Вы не можете создать ключь"));
    }
    const countKeys = (
      await Key.findAll({ where: { userId, level: countCandidate } })
    ).length;
    if (countKeys < 4 && level <= countCandidate) {
      const hashPassword = await bcrypt.hash(password, 5);
      const key = await Key.create({
        username,
        password: hashPassword,
        phone,
        userId,
        level,
      });
      return res.json({ key });
    } else {
      return next(ApiError.badRequest("Вы не можете создать ключь"));
    }
  }
  async activeKey(req, res, next) {
    const { username, password, phone } = req.body;
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);

    if (!password || !phone || !username) {
      return next(ApiError.badRequest("Не все поля заполнены"));
    }
    const userToken = await User.findOne({
      where: { username: decodeToken.username },
    });
    const user = await User.findOne({ where: { username, phone } });
    if (!user) {
      return next(ApiError.badRequest("Такой пользователь не существует"));
    }
    const key = await Key.findOne({
      where: { username: userToken.username, userId: user.id },
    });
    if (!key) {
      return next(ApiError.badRequest("Такой ключ не существует"));
    }
    console.log("dsds", key.phone, userToken.phone);
    if (username !== decodeToken.username && key.phone !== userToken.phone) {
      return next(
        ApiError.badRequest("Ключь пытается использовать другой пользователь")
      );
    }
    let comparePassword = bcrypt.compareSync(password, key.password);
    if (!comparePassword) {
      return next(ApiError.badRequest("Неправильный ключ"));
    }

    const matrix_parent_id = await Matrix.findOne({
      where: { userId: userToken.referal_id },
    });

    let date = new Date();

    const active_key = await Matrix_Table.create({
      can_buy: true,
      is_active: true,
      count: 1,
      userId: userToken.id,
      type_matrix_id: key.level,
      matrix_parent_id: matrix_parent_id.id,
    });
    const matrixValue = await Matrix.create({
      side_matrix: 0,
      parent_id: userToken.referal_id,
      date,
      userId: userToken.id,
    });

    return res.json(matrixValue);
  }
  async login(req, res, next) {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return next(ApiError.internal("Такой пользователь не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Неверный пароль"));
    }
    const access_token = generateJwt(
      user.id,
      user.email,
      user.username,
      user.first_name,
      user.last_name,
      user.referral
    );
    const w = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return res.json({ access_token, w });
  }
  async inviter(req, res, next) {
    const { username } = req.query;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return next(ApiError.internal("Такой пользователь не найден"));
    }
    let result = {
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
    };
    return res.json(result);
  }
  async user(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    try {
      const { username } = jwt_decode(token);
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return next(ApiError.internal("Такой пользователь не найден"));
      }
      const referal = await User.findOne({ where: { id: user.referal_id } });
      user.dataValues.referal = referal;
      return res.json(user);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  // async userOptions(req, res, next){
  //     const {username} = req.query;
  //     const user = await User.findOne({where:{username}})
  //     if (!user){
  //         return next(ApiError.internal('Такой пользователь не найден'))
  //     }
  //     let result = {first_name: user.first_name, last_name: user.last_name, avatar: user.avatar}
  //     return res.json(result)
  // }
  // async check(req, res, next){
  //     const {username, id} = req.body
  //     const user = await User.findAll({where:{username}})
  //     user.referal_id = id;
  //     await User.update(user.dataValues, {where: {id:user.id}})
  //     return res.json({user})
  // }
}

module.exports = new UserController();
