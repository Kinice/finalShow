var mongodb = require('./db');
var markdown = require('markdown').markdown;

function Post(name, title , post ,tag){
	this.name = name;
	this.title = title;
	this.post = post;
    this.tag = tag;
}

module.exports = Post;

//store an article and its` info
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
	//The document----
	var post = {
		name: this.name,
		time: time,
		title: this.title,
		post: this.post,
        tag: this.tag
	};
	//Open Database----
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
                    doc.post = extract(markdown.toHTML(doc.post));
                });

				callback(null, docs);
			});
		});
	});
};
Post.getOneArticle = function(name,day,title,callback){
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
          //Find Article by Name,day and title
          collection.findOne({
              'name': name,
              'time.day': day,
              'title': title
          },function(err, doc){
              mongodb.close();
              if(err){
                  return callback(err);
              }
              //MARKDOWN
              doc.post = markdown.toHTML(doc.post);
              callback(null, doc);
          });
      });
  });
};
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
                    doc.post = markdown.toHTML(doc.post);
                });

                callback(null, docs);
            });
        });
    });
};
//extract string from html tags
function extract(s){
    var fin = [];
    var s;
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
    s = fin.join('');
    return s;
}