const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const initializePassport = require("./security/passport-config");
initializePassport(passport);

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const commentsRouter = require('./routes/comments');
const categoriesRouter = require('./routes/categories');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
	  secret: 'omartahri2002',
	  resave: false,
	  saveUninitialized: false,
	  cookie: {
            expires: 60000
        }
	})
  );

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/', authRouter);
app.use('/users', usersRouter)
app.use('/categories', categoriesRouter)
app.use('/articles', articlesRouter)
app.use('/comments', commentsRouter)

app.get('/', function(req,res){
	res.sendFile('index.html');
});


app.listen(PORT, ()=>console.log('server on port 3000'));