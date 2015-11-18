/**
 * Created by Kinice on 15/11/18.
 */
var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.qq = user.qq;
    this.phone = user.phone;
}
module.exports = User;

//save user`s information
User.prototype.save = function(callback) {
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        qq: this.qq,
        phone: this.phone
    };
    //Open Database
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        //read users collection
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //insert into users collection
            collection.insert(user,{
                safe:true
            },function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null, user[0]);
            });
        });

    });
};

//read user`s information
User.get = function(name, callback){
    //Open Database
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //read users collection
        db.collection('users', function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //find user(name) value equals name -- a document
            collection.findOne({
                name: name;
            },function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
            callback(null,user);
            });
        });
    });
}