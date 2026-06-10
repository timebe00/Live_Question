var express = require('express');
var router = express.Router();

const indexService = require(_base + "/api/service/index_service.js")

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    res.render('index', { title: 'Express' });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

router.post('/login', async function (req, res, next) {
  try {
    let result = await indexService.getLoginCheck(req);

    res.json({ data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }

});

module.exports = router;
