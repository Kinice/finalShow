var express = require('express');
var router = express.Router();
var Qr = require('../models/qrimage.js'),
    crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js'),
    IO = require('../models/socket.js')

router.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Content-Type,Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,UPDATE,DELETE");
  next()
})

//rest api part
router.get('/articleList/:tag', function (req, res) {
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
    
       res.send(posts);
   });
});
router.get('/allArticles', function (req, res){
   Post.getAllArticles(null, function(err, posts){
       if(err){
           posts = [];
       }
       for(var i = 0; i<posts.length; i++){
           posts[i].tac = Post.getTag(posts[i].tag);
       }
       res.send(posts);
   })
});
router.get('/article/:_id', function (req, res) {
   Post.getOneArticle(req.params._id, function(err, post){
       if(err){
           req.flash('error', err);
           return res.redirect('/');
       }
    
       res.send(post);
   });
});
router.get('/getArticlesByName/:name', function(req,res){
 Post.getAllArticles(req.params.name, function(err,post){
   if(err){
     return res.send(err);
   }

   res.send(post);
 });
});
router.get('/search', function(req, res){
   Post.search(req.query.keyword,function(err,posts){
       if(err){
           res.send('error');
       }
       for(var i = 0; i<posts.length; i++){
           posts[i].tac = Post.getTag(posts[i].tag);
       }
    
       res.send(posts);
   });
});
router.post('/reg', function(req, res) {
 var name = req.body.name,
     password = req.body.password,
     status = [];
 //md5md5md5md5md5md5md5md5md5md5
 var md5 = crypto.createHash('md5'),
     password = md5.update(req.body.password).digest('hex');
 var newUser = new User({
     name: name,
     password: password,
     email: req.body.email
 });
 //check if the Database existed
 User.get(newUser.name, function(err,user){
     if(err){
         req.flash('error',err);
         status.push('error');
         return res.send(status);
     }
     if(user){
         status.push('error1');
         return res.send(status);
     }
     //add new user
     newUser.save(function(err,user){
        if(err){
            req.flash('error',err);
            status.push('error2');
            return res.send(status);
        }
         status.push('success');
         res.send(status);
     });
 });
});
router.post('/login', function (req, res) {
   var status = [];
   //md5
   var md5 = crypto.createHash('md5'),
       password = md5.update(req.body.password).digest('hex');
   //check if the user exsisted
   User.get(req.body.name, function(err, user){
    
       if(!user){
           status.push('error1');
           return res.send(status);
       }
       //check password
       if(user.password != password){
           status.push('error2');
           return res.send(status);
       }
       status.push('success');
       status.push(user);
       res.send(status);
   });
});
//api post
router.post('/post', function (req, res) {
   var status = [],
       post = new Post(req.body.name, req.body.title, req.body.post,req.body.tag,req.body.describe);
    
   post.save(function(err){
       if(err){
           status.push('error');
           return res.send(status);
       }
       status.push('success');
       res.send(status);
   });
});

router.post('/qrimage', function (req, res){
  var final = {
      code: 0
  }
  var qr_string = Qr.createQr(req.body.text,function(err,result){
      if(err){
          final.code = 1
          final.err = err
          return console.error(err)
      }
      final.qr_string = result.svg // 兼容以前的crx版本
      final.svg_string = result.svg
      final.png_string = result.png.toString('base64')
      final.png_buffer = result.png
  });
  
  res.send(final)
});
//api comment
router.post('/article/:_id', function(req, res){
   var status = [];
   var date = new Date(),
       time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
       md5 = crypto.createHash('md5'),
       emailMd5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
       head = 'http://gravatar.duoshuo.com/avatar/'+emailMd5;
   var comment = {
       name: req.body.uname || '',
       email: req.body.email || 'szp93@126.com',
       time: time,
       content: req.body.content,
       head:head
   }
   var newComment = new Comment(req.params._id,comment);
   newComment.save(function(err){
       if(err){
      
         status.push('error');
         return res.send(status);
       }
    
       status.push('success');
        res.send(status);
    });
});

module.exports = router;
