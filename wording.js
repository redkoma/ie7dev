var wording={

    "LOGIN_FAILED"          :"Username or password incorrect",
    "LOAD_SERVICE_FAILED"   :"Service not found",
    "SESSION_FAILED"        :"Your session already expired"

};



exports.getWord = function(word){
    return wording[word];
};

exports.getWord = function(word,note){
    return wording[word]+note;
};
