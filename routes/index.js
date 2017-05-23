var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js')
    Qr = require('../models/qrimage.js')
    
/**
 *                    .::::.
 *                  .::::::::.
 *                 :::::::::::
 *             ..:::::::::::'
 *           '::::::::::::'
 *             .::::::::::
 *        '::::::::::::::..
 *             ..::::::::::::.
 *           ``::::::::::::::::
 *            ::::``:::::::::'        .:::.
 *           ::::'   ':::::'       .::::::::.
 *         .::::'      ::::     .:::::::'::::.
 *        .:::'       :::::  .:::::::::' ':::::.
 *       .::'        :::::.:::::::::'      ':::::.
 *      .::'         ::::::::::::::'         ``::::.
 *  ...:::           ::::::::::::'              ``::.
 * ```` ':.          ':::::::::'                  ::::..
 *                    '.:::::'                    ':'````..
 */

module.exports = function(app) {
    //主页
    app.get('/', function (req, res) {
        console.log(getClientIp(req).ip+getClientIp(req).time);
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
        console.log(getClientIp(req).ip+getClientIp(req).time);
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
        console.log(getClientIp(req).ip+getClientIp(req).time);
        res.render('login', {
            title: '登录-Kinice的个人博客',
            user:req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', function (req, res) {
        //md5
        if(req.body.name==''||req.body.password==''){
          req.flash('error','你逗我呢？');
          return res.redirect('/login');
        }
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
    //删除
    app.get('/remove/:_id',checkLogin);
    app.get('/remove/:_id',function(req, res){
      var currentUser = req.session.user;
      if(!req.session.user){
        console.log(req.session.user);
        return false;
      }
      Post.deleteOneArticle(req.params._id,function(err){
        if(err){
          req.flash('error',err);
          return res.redirect('back');
        }
        req.flash('success','删除成功');
        res.redirect('back');
      });
    });
    //发表
    app.get('/post', checkLogin);
    app.get('/post', function (req, res) {
        console.log(getClientIp(req).ip+getClientIp(req).time);
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
    //修改
    app.get('/edit/:_id', checkLogin);
    app.get('/edit/:_id', function (req, res) {
        console.log(getClientIp(req).ip+getClientIp(req).time);
        Post.getOneArticle(req.params._id, function(err, post){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('edit', {
                title: '编辑-Kinice的博客',
                articleTitle: req.params.title,
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        },true);
    });
    app.post('/edit/:_id', checkLogin);
    app.post('/edit/:_id', function (req, res) {
        var editedPost = {
            title: req.body.title,
            describe: req.body.describe,
            post: req.body.post
        }
        Post.update(req.params._id, editedPost, function(err){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success','修改成功');
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
        console.log(getClientIp(req).ip+getClientIp(req).time);
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
        console.log(getClientIp(req).ip+getClientIp(req).time);
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
    //comment post
    app.post('/article/:_id', function(req, res){
        if(getClientIp(req).ip == '5.188.211.15'){
            return false;
        }
        var date = new Date(),
            time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
            avartarNum = Math.ceil(Math.random()*14);
            head = '/images/avatar'+avartarNum+'.jpg';
        var comment = {
            name: req.body.uname || '',
            email: req.body.email || 'szp93@126.com',
            time: time,
            content: req.body.content,
            head: head,
            timestamp: date.getTime()
        }
        var newComment = new Comment(req.params._id,comment);
        newComment.save(function(err){
            if(err){
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success','留言成功！');
            res.redirect('back');
        });
    });
    app.get('/article/:_id/:timestamp', function(req, res){
        Comment.deleteComment(req.params._id,req.params.timestamp,function(err){
            if(err){
              console.log(err)
              req.flash('error',err);
              return res.redirect('back');
            }
            req.flash('success','删除成功');
            res.redirect('back');
        })
    })
    app.get('/d/:_id/', function(req, res){
        Comment.deleteAllComment(req.params._id,function(err){
            if(err){
                console.log(err)
                req.flash('error',err)
            }
            req.flash('success','全部删除成功')
            res.redirect('back')
        })
    })
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
    app.get('/avatar', function(req, res){
        Comment.avatar(function(err){
            if(err){
                console.log(err)
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success','修改头像成功');
            res.redirect('back');
        });
    });


    
//       //rest api part
//       app.get('/api/articleList/:tag', function (req, res) {
//           Post.getArticlesByTag(req.params.tag, function(err, posts){
//              if(err){
//                  posts=[];
//                  req.flash('error', err);
//                  return res.redirect('/');
//              }
//              var ttl = Post.getTag(req.params.tag);
//              for(var i = 0; i<posts.length; i++){
//                  posts[i].tac = Post.getTag(posts[i].tag);
//              }
//              accessControlAllow(res)
//              res.jsonp(posts);
//          });
//      });
//      app.get('/api/allArticles', function (req, res){
// accessControlAllow(res)
//          Post.getAllArticles(null, function(err, posts){
//              if(err){
//                  posts = [];
//              }
//              for(var i = 0; i<posts.length; i++){
//                  posts[i].tac = Post.getTag(posts[i].tag);
//              }
//              res.jsonp(posts);
//          })
//      });
//      app.get('/api/article/:_id', function (req, res) {
//          Post.getOneArticle(req.params._id, function(err, post){
//              if(err){
//                  req.flash('error', err);
//                  return res.redirect('/');
//              }
//              accessControlAllow(res)
//              res.jsonp(post);
//          });
//      });
//      app.get('/api/getArticlesByName/:name', function(req,res){
//        Post.getAllArticles(req.params.name, function(err,post){
//          if(err){
//            return res.jsonp(err);
//          }
//          accessControlAllow(res)
//          res.jsonp(post);
//        });
//      });
//      app.get('/api/search', function(req, res){
//          Post.search(req.query.keyword,function(err,posts){
//              if(err){
//                  res.jsonp('error');
//              }
//              for(var i = 0; i<posts.length; i++){
//                  posts[i].tac = Post.getTag(posts[i].tag);
//              }
//              accessControlAllow(res)
//              res.jsonp(posts);
//          });
//      });
//     app.post('/api/reg', function(req, res) {
//        var name = req.body.name,
//            password = req.body.password,
//            status = [];
//        //md5md5md5md5md5md5md5md5md5md5
//        var md5 = crypto.createHash('md5'),
//            password = md5.update(req.body.password).digest('hex');
//        var newUser = new User({
//            name: name,
//            password: password,
//            email: req.body.email
//        });
//        //check if the Database existed
//        accessControlAllow(res)
//        User.get(newUser.name, function(err,user){
//            if(err){
//                req.flash('error',err);
//                status.push('error');
//                return res.jsonp(status);
//            }
//            if(user){
//                status.push('error1');
//                return res.jsonp(status);
//            }
//            //add new user
//            newUser.save(function(err,user){
//               if(err){
//                   req.flash('error',err);
//                   status.push('error2');
//                   return res.jsonp(status);
//               }
//                status.push('success');
//                res.jsonp(status);
//            });
//        });
//      });
//      app.post('/api/login', function (req, res) {
//          var status = [];
//          //md5
//          var md5 = crypto.createHash('md5'),
//              password = md5.update(req.body.password).digest('hex');
//          //check if the user exsisted
//          User.get(req.body.name, function(err, user){
//              accessControlAllow(res)
//              if(!user){
//                  status.push('error1');
//                  return res.jsonp(status);
//              }
//              //check password
//              if(user.password != password){
//                  status.push('error2');
//                  return res.jsonp(status);
//              }
//              status.push('success');
//              status.push(user);
//              res.jsonp(status);
//          });
//      });
//      //api post
//      app.post('/api/post', function (req, res) {
//          var status = [],
//              post = new Post(req.body.name, req.body.title, req.body.post,req.body.tag,req.body.describe);
//              accessControlAllow(res)
//          post.save(function(err){
//              if(err){
//                  status.push('error');
//                  return res.jsonp(status);
//              }
//              status.push('success');
//              res.jsonp(status);
//          });
//      });
     app.post('/api/qrimage', function (req, res){
        accessControlAllow(res)
        var final = {
            code: 0
        }
        var qr_string = Qr.createQr(req.body.text,function(err,result){
            if(err){
                final.code = 1
                final.err = err
                return console.error(err)
            }
            final.qr_string = result
        });
        
        res.jsonp(final)
     });
//      //api comment
//      app.post('/api/article/:_id', function(req, res){
//          var status = [];
//          var date = new Date(),
//              time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
//              md5 = crypto.createHash('md5'),
//              emailMd5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
//              head = 'http://gravatar.duoshuo.com/avatar/'+emailMd5;
//          var comment = {
//              name: req.body.uname || '',
//              email: req.body.email || 'szp93@126.com',
//              time: time,
//              content: req.body.content,
//              head:head
//          }
//          var newComment = new Comment(req.params._id,comment);
//          newComment.save(function(err){
//              if(err){
//                accessControlAllow(res)
//                status.push('error');
//                return res.jsonp(status);
//              }
//              accessControlAllow(res)
//              status.push('success');
//               res.jsonp(status);
//           });
//       });

    //function part
    function accessControlAllow(res){
        res.setHeader("Access-Control-Allow-Origin","*");
        res.setHeader("Access-Control-Allow-Headers","Content-Type,Accept,Authorization");
        res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,UPDATE,DELETE");
    }
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
    function getClientIp(req) {
        var time = new Date();
        var ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress);
        var result = {
            'time': time,
            'ip': ip
        }
        return result;
    };
};
