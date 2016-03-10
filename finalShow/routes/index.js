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
			for(var i = 0; i<posts.length; i++){
				posts[i].tac = Post.getTag(posts[i].tag);
			}
            res.render('index', {
                title: '主页-Kinice的个人博客',
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
            title: '注册-Kinice的个人博客',
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
            title: '登录-Kinice的个人博客',
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
            title: '发表-Kinice的个人博客',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/post', checkLogin);
    app.post('/post', function (req, res) {
        var currentUser = req.session.user,
            post = new Post(currentUser.name, req.body.title, req.body.post,req.body.tag,req.body.describe);
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
        res.render('aboutme', {
            title: 'Kinice本人-Kinice的个人博客',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    //Article List
    app.get('/articleList/all', function(req,res){
        Post.getAllArticles(null, function(err, posts){
            if(err){
                posts = [];
            }
            res.render('articleList', {
                title: '文章列表-Kinice的个人博客',
                user: req.session.user,
                posts: posts,
                all: 'y',
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    app.get('/articleList/:tag', function (req, res) {
        Post.getArticlesByTag(req.params.tag, function(err, posts){
            if(err){
                posts=[];
                req.flash('error', err);
                return res.redirect('/');
            }
            var ttl = Post.getTag(req.params.tag);
            for(var i = 0; i<posts.length; i++){
                posts[i].tac = Post.getTag(posts[i].tag);
            }
            res.render('articleList', {
                tag: ttl || null,
                title: ttl + '-Kinice的博客',
                posts: posts,
                user: req.session.user,
                all: 'n',
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    //article
    app.get('/article/:_id', function (req, res) {
        Post.getOneArticle(req.params._id, function(err, post){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('article', {
                title: post.title + '-Kinice的博客',
                articleTitle: req.params.title,
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    //test
    app.get('/test',function(req, res){
        Post.getDescribes('about-code', function(err, data){
            if(err){
                data = [];
            }
            var dec = [];
            for(var i in data){
                for(var j in data[i].describe){
                    dec.push(data[i].describe[j]);
                }
            }
            res.jsonp(dec);
        });
    });
    //message
    app.get('/message', function (req, res) {
        res.render('message',{
        title: '留言-Kinice的博客',
	    user: req.session.user,
	    success: req.flash('success').toString(),
	    error: req.flash('error').toString()
        });
    });
    //search
    app.get('/search', function(req, res){
        Post.search(req.query.keyword,function(err,posts){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            for(var i = 0; i<posts.length; i++){
                posts[i].tac = Post.getTag(posts[i].tag);
            }
            res.render('search',{
                query: req.query.keyword,
                title: '搜索结果',
                posts: posts,
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
