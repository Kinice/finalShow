var mongodb = require('./db');
var marked = require('marked');
var ObjectID = require('mongodb').ObjectID;

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

function Post(name, title , post ,tag ,describe){
	this.name = name;
	this.title = title;
	this.post = post;
    this.tag = tag;
    this.describe = describe;
}

module.exports = Post;

//store an article and its info
Post.prototype.save = function(callback){
	var date = new Date();
	//store time format
	var time = {
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear() + '-' + (date.getMonth() + 1),
		day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
		minute: date.getFullYear() + '-' + (date.getMonth() + 1) + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	}
	//The document
	var post = {
		name: this.name,
		time: time,
		title: this.title,
		post: this.post,
    tag: this.tag,
    comments: [],
    describe: this.describe.split(',')
	};
	//Open Database
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		//Read posts collection
		db.collection('posts',function(err, collection){
			if(err){
				mongodb.close(); //Close the database
				return callback(err);
			}
			//Insert document into the posts collection
			collection.insert(post,{
				safe: true
			},function(err){
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};
Post.getDescribes = function(tag, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err, collection){
            if(err){
                return callback(err);
            }
            collection.find({
                'tag': tag
            }).toArray(function(err, descis){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null, descis);
            });
        });
    });
}
//read article and other informations
Post.getAllArticles = function(name, callback){
	//Open Database
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('posts', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			//Search article by name of query
			collection.find(query).sort({
				time: -1
			}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
                //Mark down
                docs.forEach(function(doc){
                    doc.prepost = extract(marked(doc.post));
                });

				callback(null, docs);
			});
		});
	});
};
Post.deleteOneArticle = function(_id,callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('posts', function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.remove({
        '_id' : new ObjectID(_id)
      },{
        w : 1
      },function(err){
        mongodb.close();
        if(err){
          return callback(err);
        }
        callback(null);
      });
    });
  });
};
Post.getOneArticle = function(_id,callback){
  //Open Database
  mongodb.open(function(err, db){
      if(err){
          return callback(err);
      }
      //Read posts collection
      db.collection('posts', function(err,collection){
          if(err){
              mongodb.close();
              return callback(err);
          }
          //Find Article by id
          collection.findOne({
              '_id': new ObjectID(_id)
          },function(err, doc){
              mongodb.close();
              if(err){
                  return callback(err);
              }
              //MARKDOWN
              if(doc){
                  doc.post = marked(doc.post);
              }
              callback(null, doc);
          });
      });
  });
};
//search mode
Post.search = function(keyword, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var pattern = new RegExp(keyword, 'i');
            collection.find({
                "$or" :[{
                    "describe":pattern
                },{
                    "title":pattern
                },{
                    "post":pattern
                }]
            }).sort({
                time: -1
            }).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                //Mark down
                docs.forEach(function(doc){
                    doc.prepost = extract(marked(doc.post));
                });
                callback(null, docs);
            });
        });
    });
}
//read article and other informations
Post.getArticlesByTag = function(tag, callback){
    //Open Database
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if(tag){
                query.tag = tag;
            }
            //Search article by tag of query
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                //Mark down
                docs.forEach(function(doc){
                    doc.prepost = extract(marked(doc.post));
                });

                callback(null, docs);
            });
        });
    });
};
//extract tags into chinese
Post.getTag = function(tag){
	var s;
	if(tag == 'about-code'){
		s='工作日常';
	}else if(tag == 'brain-hole'){
		s='脑洞钻孔';
	}else if(tag == 'niu-b'){
		s='牛B网文';
	}else{
		s='自导视频';
	}
	return s;
}
//extract string from html tags
var extract = function(s){
    var fin = [];
    var string;
    var bool=false;
    for(var i = 0; i<s.length; i++){
        var a = s.substr(i,1);
        if(a === '>'){bool = false;continue;}
        if(a === '<'){
            bool = true;
        }else if(bool ===true){
            continue;
        }else if(bool === false){
            fin.push(a);
        }
    }
    string = fin.join('');
    return string;
}
