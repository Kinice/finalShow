var qr = require('qr-image')

var qr_result = {}

module.exports = qr_result

qr_result.createQr = function(text,callback){
    if(!text){
        return callback('Has no text')
    }
    var qr_svg = qr.imageSync(text,{type:'svg'})

    return callback(null,qr_svg)
}