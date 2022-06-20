module.exports = app => {
    const owner = require("../controllers/gitcontroller.js");
  
    var router = require("express").Router();
  
    router.get("/:name", owner.findOne);
  
    app.use('/api/git', router);
  };
  