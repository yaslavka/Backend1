const ApiError = require("../error/ApiError");
const { User } = require("../models/models");

class TinkoffControllers {

  async success(req, res, next) {
    let { Success, Amount, OrderId} = req.query;
    let arr = OrderId.split(':')
    let username = (arr[1]).trim()
    if (Success){
      let update = {};
      if (username && Amount) {
        Amount = (+Amount) / 100
        const user = await User.findOne({
          where: { username: username },
        });
        if (Amount === 1000) {
          update = { podpiska: user.podpiska + Amount };
        } else if (Amount === 5000) {
          update = { kurs1: user.kurs1 + Amount };
        } else if (Amount === 1500) {
          update = { kurs2: user.kurs2 + Amount };
        } else if (Amount === 2000) {
          update = { kurs3: user.kurs3 + Amount };
        } else if (Amount === 2500) {
          update = { kurs4: user.kurs4 + Amount };
        } else if (Amount === 10000){
          update = { kurs1: user.kurs1 + 5000, balance: user.balance + 5000 };
        } else if (Amount === 15000){
          update = { kurs1: user.kurs2 + 5000, balance: user.balance + 10000 };
        } else if (Amount === 45000){
          update = { kurs1: user.kurs3 + 5000, balance: user.balance + 40000 };
        } else if (Amount === 645000){
          update = { kurs1: user.kurs4 + 5000, balance: user.balance + 640000 };
        } 
        await User.update(update, { where: { username: username } });
      }
    }

    const url = "https://x-life.host/leader";
    return res.redirect(url);
  }

}

module.exports = new TinkoffControllers();


