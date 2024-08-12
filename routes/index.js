var express = require('express');
var router = express.Router();
const passport = require('passport');
const userModel = require('./users');
const postModel = require('./post');
const upload = require('./multer');

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', indexLogIn, function(req, res, next) {
  res.render('index', { title: 'sign up' });
});

router.get('/login', indexLogIn, function(req, res, next) {
  res.render('login', { title: 'log in' });
});

router.get('/profile', isLoggedIn, async(req, res, next) => {
  const user = await userModel.findOne({username: req.session.passport.user}).populate("posts");

  res.render('profile', {user});
});

router.get('/add', isLoggedIn, async(req, res, next) => {
  const user = await userModel.findOne({username: req.session.passport.user})

  res.render('add');
});

router.get('/feed', isLoggedIn, async(req, res) => {
  const user = await userModel.findOne({username: req.session.passport.user});
  
  const posts = await postModel.find().populate("user");

  res.render('feed', {posts, user});
})

//register
router.post('/register', (req, res) => {
  const { username, fullname, email } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
  .then((registeredUser) => {
    passport.authenticate("local")(req, res, () => {
      res.redirect('/profile');
    })
  })
  .catch((err) => {
    console.log(err);
    res.redirect('/');
  })
});

//login
router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: '/login'
}), (req, res) => {});

//logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  })
});

router.post('/fileupload', isLoggedIn, upload.single('image'), async(req, res, next) => {
  const user = await userModel.findOne({username: req.session.passport.user});
  user.dp = req.file.filename;
  await user.save();
  res.redirect('/profile');
})

router.post('/createpost', isLoggedIn, upload.single('postimage'), async(req, res, next) => {
  if (!req.file) {
    res.redirect('/add');
  }

  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    title: req.body.title,
    user: user._id,
    description: req.body.description,
    image: req.file.filename
  })

  user.posts.push(post._id);
  await user.save();

  res.redirect('/profile');
})

function isLoggedIn(req, res, next)
{
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function indexLogIn(req, res, next)
{
  if (req.isAuthenticated()) {
    res.redirect('/profile');
  }

  return next();
}

module.exports = router;
