const ApiError = require("../error/ApiError");

const {
    News
  } = require("../models/models");


  class NewsControllers{

      async getBlock(req, res, next) {
        
        const news = await News.findAll();
        return res.json({ items: news });
      }

      async get(req, res, next) {
        
        const news = await News.findAll();
        return res.json({ items: news });
      }

      async getOne(req, res, next) {
        const {news_id} = req.query
        const news = await News.findOne({where:{id:news_id}});
        return res.json( news );
      }
  }

  
module.exports = new NewsControllers();