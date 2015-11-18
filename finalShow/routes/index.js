var crypto = require('crypto'),
    User = require('../models/user.js');
module.exports = function(app) {
    app.get('/test', function (req, res) {
        res.send('<h1>反正我知道没人会看这个页面的。</h1>');
        res.send('<h1>我这老师真的啥都不会不懂装懂。</h1>');
        res.send('<h1>没错没错说的就是你姜远明老师。</h1>');
    });
    //主页
    app.get('/', function (req, res) {
        res.render('index', {title: '主页-Kinice的个人博客'});
    });
    //注册
    app.get('/reg', function (req, res) {
        res.render('index', {title: '注册-Kinice的个人博客'});
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
    app.get('/login', function (req, res) {
        res.render('index', {title: '登陆-Kinice的个人博客'});
    });
    app.post('/login', function (req, res) {
    });
    //发表
    app.get('/post', function (req, res) {
        res.render('index', {title: '发表文章-Kinice的个人博客'});
    });
    app.post('/post', function (req, res) {
    });
    //登出
    app.get('/logout', function (req, res) {
    });
    //about
    app.get('/about', function (req, res) {
        res.render('about', {title: 'Kinice本人-Kinice的个人博客'});
    });
    //ArticalList
    app.get('/articalList', function (req, res) {
        res.render('articalList', {title: '文章列表-Kinice的个人博客'});
    });
    //article
    app.get('/article', function (req, res) {
    });
};
