const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const freekassa = require("freekassa-node");
const { stringify } = require("querystring");
const bcrypt = require("bcrypt");
var sha256 = require("js-sha256").sha256;
const { User, Winthdraw } = require("../models/models");

class WalletControllers {
  async freeKassa(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);
    const user = await User.findOne({
      where: { username: decodeToken.username },
    });
    const { amount } = req.body;

    const result = freekassa(
      {
        m: "23862",
        oa: amount,
        i: "",
        currency: "RUB",
        em: "",
        pay: "PAY",
        phone: "",
        o: user.username,
      },
      ".B(n//X{-QAdW}@"
    );
    return res.json(result);
  }
  async payeer(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);
    const user = await User.findOne({
      where: { username: decodeToken.username },
    });
    const amountReq = req.body.amount;
    const amount = `${amountReq}.00`;
    const shopId = 1760259497;
    const secretKey = "rBZKIamz2v3JCKLz";
    const orderId = user.username;
    const currency = "RUB";
    const callbackUrls = {
      success_url: "https://xlife.host/api/wallet/success",
      fail_url: "https://xlife.host/api/wallet/error",
      status_url: "https://xlife.host/api/wallet/warning",
    };
    const description =
      "0J7Qv9C70LDRgtCwINC00LvRjyDQvNCw0LPQsNC30LjQvdCwIHgtbGlmZQ==";
    const hash = [shopId, orderId, amount, currency, description];
    hash.push(secretKey);
    const sign = sha256(hash.join(":")).toUpperCase();

    const queryParams = {
      m_shop: shopId,
      m_orderid: orderId,
      m_amount: amount,
      m_curr: currency,
      m_desc: description,
      m_sign: sign,
      m_process: "send",
    };

    return res.json({
      url: `https://payeer.com/merchant/?${stringify(queryParams)}`,
    });
  }
  async redirectAndPay(req, res, next) {
    let { MERCHANT_ORDER_ID, AMOUNT } = req.body;
    AMOUNT = +AMOUNT;
    let update = {};
    console.log(MERCHANT_ORDER_ID && AMOUNT);
    console.log(MERCHANT_ORDER_ID, AMOUNT);
    if (MERCHANT_ORDER_ID && AMOUNT) {
      const user = await User.findOne({
        where: { username: MERCHANT_ORDER_ID },
      });
      if (AMOUNT === 1000) {
        update = { podpiska: user.podpiska + AMOUNT };
      } else if (AMOUNT === 5000) {
        update = { kurs1: user.kurs1 + AMOUNT };
      } else if (AMOUNT === 1500) {
        update = { kurs2: user.kurs2 + AMOUNT };
      } else if (AMOUNT === 2000) {
        update = { kurs3: user.kurs3 + AMOUNT };
      } else if (AMOUNT === 2500) {
        update = { kurs4: user.kurs4 + AMOUNT };
      } else if (AMOUNT === 10000){
        update = { kurs1: user.kurs1 + 5000, balance: user.balance + 5000 };
      } else if (AMOUNT === 15000){
        update = { kurs1: user.kurs2 + 5000, balance: user.balance + 10000 };
      } else if (AMOUNT === 45000){
        update = { kurs1: user.kurs3 + 5000, balance: user.balance + 40000 };
      } else if (AMOUNT === 645000){
        update = { kurs1: user.kurs4 + 5000, balance: user.balance + 640000 };
      } 
      await User.update(update, { where: { username: MERCHANT_ORDER_ID } });
    }
    const url = "https://x-life.host/leader";
    return res.redirect(url);
  }
  async redirect(req, res, next){
    const url = "https://x-life.host/leader";
    return res.redirect(url);
  }
  async withdraw(req, res, next){
    const { amount, password, system, wallet } = req.body;
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);
    const user = await User.findOne({
      where: { username: decodeToken.username },
    });
    let updateMinus
    let comparePassword = bcrypt.compareSync(password, user.finance_password);
    if (!comparePassword) {
      return next(ApiError.internal("Неверный пароль"));
    }
    if (user.balance < amount){
      return next(ApiError.internal("Не хватает средств"));
    }
    updateMinus = { balance: user.balance - amount };
    await User.update(updateMinus, {where:{id:user.id}})
    const item = await Winthdraw.create({
      amount, system, wallet
    })
    return res.json(item);
  }
  async transfer(req, res, next){
    let updateMinus
    const { amount, password, username } = req.body;
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);
    const user = await User.findOne({
      where: { username: decodeToken.username },
    });
    let comparePassword = bcrypt.compareSync(password, user.finance_password);
    if (!comparePassword) {
      return next(ApiError.internal("Неверный пароль"));
    }
    if (user.balance < amount){
      return next(ApiError.internal("Не хватает средств"));
    }
    updateMinus = { balance: user.balance - amount };
    await User.update(updateMinus, {where:{id:user.id}})
    const userForTransfer = await User.findOne({
      where: { username },
    });
    if (!userForTransfer){
      return next(ApiError.internal("Нет такого пользователья"));
    }
    let update = {locale: userForTransfer.locale + amount}
    await User.update(update, {where:{id:userForTransfer.id}})
    return res.json(update);
  }
}

module.exports = new WalletControllers();
