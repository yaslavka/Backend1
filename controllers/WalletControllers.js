const jwt_decode = require("jwt-decode");
const freekassa = require("freekassa-node");
const { stringify } = require("querystring");
const sha256 = require("js-sha256").sha256;
const { User } = require("../models/models");

class WalletControllers {
  async freeKassa(req, res) {
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
  async payeer(req, res) {
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
  async redirectAndPay(req, res) {
    let { AMOUNT, MERCHANT_ORDER_ID } = req.query;
    console.log('body', req.body); 
    console.log('query', req.query);
    AMOUNT = +AMOUNT;
    let update = {};
    console.log(MERCHANT_ORDER_ID && AMOUNT);
    console.log(MERCHANT_ORDER_ID, AMOUNT);
    if (MERCHANT_ORDER_ID && AMOUNT) {
      const user = await User.findOne({
        where: { username: MERCHANT_ORDER_ID },
      });
      if (AMOUNT === 1000) {
        update = { balance: user.balance + AMOUNT };
      } else if (AMOUNT === 5000) {
        update = { kurs1: user.kurs1 + AMOUNT };
      } else if (AMOUNT === 1500) {
        update = { kurs2: user.kurs2 + AMOUNT };
      } else if (AMOUNT === 2000) {
        update = { kurs3: user.kurs3 + AMOUNT };
      } else if (AMOUNT === 2500) {
        update = { kurs4: user.kurs4 + AMOUNT };
      }
      await User.update(update, { where: { username: MERCHANT_ORDER_ID } });
    }
    const url = "https://x-life.host/leader";
    return res.redirect(url);
  }
  async redirect(req, res){
    const url = "https://x-life.host/leader";
    return res.redirect(url);
  }
}

module.exports = new WalletControllers();
