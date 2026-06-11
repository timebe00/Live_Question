var express = require('express');
var router = express.Router();

const indexService = require(_base + "/api/service/index_service.js");
const common = require(_base + "/common/common.js");

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    if (await common.resolveUser(req, res)) {
      return res.redirect('/master');
    }
    res.render('index');
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

router.post('/login', async function (req, res, next) {
  try {
    let result = await indexService.getLoginCheck(req);

    if (result.accessToken && result.refreshToken) {
      common.setLoginCookies(res, result.accessToken, result.refreshToken);
      delete result.accessToken;
      delete result.refreshToken;
    }

    res.json({ data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

router.get('/logout', async function (req, res, next) {
  try {
    common.clearLoginCookies(res);
    res.redirect('/');
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

/* GET home page. */
router.get('/master', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.getMasterList(req);
    res.render('Master', { masters: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

router.post('/master', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.saveMaster(req);
    res.json({ data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

router.put('/master', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.updateMaster(req);
    res.json({ data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

router.delete('/master', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.deleteMaster(req);
    res.json({ data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

router.post('/master/reset-answers', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.resetMasterAnswers(req);
    res.json({ data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

module.exports = router;
