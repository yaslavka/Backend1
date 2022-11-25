const ApiError = require("../error/ApiError");
const { User } = require("../models/models");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcrypt");


class SettingsControllers {

    async finPass(req, res, next) {
        try {
            const { new_password, old_password } = req.body;
            const { authorization } = req.headers;
            const token = authorization.slice(7);
            const decodeToken = jwt_decode(token);
            const user = await User.findOne({
              where: { username: decodeToken.username },
            });
            if (old_password !== ''){
                let comparePassword = bcrypt.compareSync(old_password, user.finance_password);
                if (!comparePassword) {
                  return next(ApiError.internal("Неверный пароль"));
                }
            }
            const hashPassword = await bcrypt.hash(new_password, 5);
            let updateFinPassword = {finance_password: hashPassword}
            await User.update(updateFinPassword, {where:{id:user.id}})
            return res.json(true)
        } catch (error) {
            return res.json(error)
        }

    }

}

module.exports = new SettingsControllers();


