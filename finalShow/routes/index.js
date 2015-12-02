var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');
module.exports = function(app) {
    //主页
    app.get('/', function (req, res) {
        Post.getAllArticles(null, function(err, posts){
            if(err){
                posts = [];
            }
            res.render('index', {
                title: 'Kinice的个人博客',
                user: req.session.user,
                posts: posts,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    //注册
    app.get('/reg', checkNotLogin);
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: 'Kinice的个人博客',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        //check user two times the password is the same
        if(password_re != password){
            req.flash('error','双验证密码不符，禁止进入系统');
            return res.redirect('/reg');
        }
        //md5md5md5md5md5md5md5md5md5md5
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: name,
            password: password,
            email: req.body.email,
            qq: req.body.qq,
            phone: req.body.phone
        });
        //check if the Database existed
        User.get(newUser.name, function(err,user){
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            if(user){
                req.flash('error','人员身份冲突，无法确定是否为侵入者');
                return res.redirect('/reg');
            }
            //add new user
            newUser.save(function(err,user){
               if(err){
                   req.flash('error',err);
                   return res.redirect('/reg');
               }
                req.session.user = user;//save user`s information into session
                req.flash('success','身份确认无误，信息写入');
                res.redirect('/');
            });
        });
    });
    //登录
    app.get('/login', checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'Kinice的个人博客',
            user:req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', function (req, res) {
        //md5
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //check if the user exsisted
        User.get(req.body.name, function(err, user){
            if(!user){
                req.flash('error','检测不到身份信息，疑似入侵者');
                return res.redirect('/login');
            }
            //check password
            if(user.password != password){
                req.flash('error','密码验证失败！警报！');
                return res.redirect('/login');
            }
            //success
            req.session.user = user;
            req.flash('success','身份验证通过，准许通过');
            res.redirect('/')
        });
    });
    //发表
    app.get('/post', checkLogin);
    app.get('/post', function (req, res) {
        res.render('post', {
            title: 'Kinice的个人博客',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/post', checkLogin);
    app.post('/post', function (req, res) {
        var currentUser = req.session.user,
            post = new Post(currentUser.name, req.body.title, req.body.post,req.body.tag);
        post.save(function(err){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success','发布成功');
            res.redirect('/');
        });         
    });
    //登出
    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success','成功断开与本博客的连接');
        res.redirect('/');
    });
    //about
    app.get('/about', function (req, res) {
        res.render('about', {
            title: 'Kinice的个人博客',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    //Article List
    app.get('/articleList', function (req, res) {
        res.render('articleList', {
            title: 'Kinice的个人博客',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    //article
    app.get('/article/:name/:day/:title', function (req, res) {
        Post.getOneArticle(req.params.name, req.params.day, req.params.title, function(err, post){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('article', {
                title: 'Kinice的个人博客',
                articleTitle: req.params.title,
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');
        }
        next();
    }
};
