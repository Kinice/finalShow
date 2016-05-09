var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function comment(_id, comment){
    this._id = _id;
    this.comment = comment;
}

module.exports = comment;

//store a comment message

comment.prototype.save = function(callback){
    var _id = this._id,
        comment = this.comment;
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                return callback(err);
            }
            collection.update({
                '_id': new ObjectID(_id)
            },{
                $push:{'comments':comment}
            },function(err){
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        });
    });
}