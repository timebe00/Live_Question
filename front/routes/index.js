var express = require('express');
var router = express.Router();
const crypto = require('crypto');

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

/* GET home page. */
router.get('/master/:master_no', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.getQuestionList(req);
    res.render('Question', { data: result, master_no: req.params.master_no });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

router.post('/master/:master_no/questions', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.saveAllQuestions(req);
    res.json({ data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

router.delete('/master/questions', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.deleteQuestion(req);
    res.json({ data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

/* GET home page. */
router.get('/master/show/:master_no/:question_no', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.getShowQuestion(req);
    res.render('Show', { data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

/* GET home page. */
router.get('/master/show_list/:master_no/:question_no', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.getShowQuestion(req);
    let cnt = await indexService.getShowQuestionResult(req);
    res.render('ShowList', { data: result, cnt: cnt });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

router.get('/master/show_list/:master_no/:question_no/result', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.getShowQuestionResult(req);
    res.json({ data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

/* GET home page. */
router.get('/answer/:master_no/:question_no', async function(req, res, next) {
  try {
    if (!req.cookies.user) {
      req.cookies.user = crypto.randomUUID();
      res.cookie('user', req.cookies.user, {
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
    }

    let result = await indexService.getAnswerPage(req);
    if (result.alreadyAnswered) {
      return res.redirect('/sendAnswer');
    }

    res.render('Answer', { data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

router.post('/answer', async function(req, res, next) {
  try {
    let result = await indexService.saveAnswer(req);
    res.json({ data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

/* GET home page. */
router.get('/sendAnswer', async function(req, res, next) {
  try {
    res.render('SendAnswer');
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});

module.exports = router;
