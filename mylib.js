var wording = require("./wording");



// JSON default style for request response for normal action

exports.json_success=function (data){
    return {"STATUS":"OK","MSG":"","DATA":data};
}

exports.json_error = function (msg){
    
    return {"STATUS":"ERROR","MSG":wording.getWord(msg)};
}

exports.json_error = function (msg,note){
    
    return {"STATUS":"ERROR","MSG":wording.getWord(msg,note)};
}


// Internal Authentication 
exports.validate_session = function (UID,UCODE,db,callback){
    var resp=false;
    db.collection('User').findById(UID, function(e,result) {
        if(e) return next(e);
        if((result!=null)&&(result.ucode == UCODE)){
            callback(true);
        }else{
            callback(false);
        }
    });

}
