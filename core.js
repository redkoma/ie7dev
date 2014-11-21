var http = require('http'),
    mongoskin = require('mongoskin'),
    bodyParser = require('body-parser'),
    express = require('express');

var db = mongoskin.db('mongodb://@localhost:27017/mydb', {safe:true})
var app = express();

var mylib = require('./mylib');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.set('port', process.env.PORT || 3000); 
app.param('uid', function(req, res, next, uid){
    var reqjson = req.body;
    //console.log(reqjson);
    mylib.validate_session(uid,reqjson.UCODE,db,function (result){
        console.log(result);
        if(result){
            return next()
        }else{
            res.json(mylib.json_error("SESSION_FAILED"));
        }
    });
})



app.get('/', function (req, res) {
  res.send('<html><body><h1>Hello World</h1></body></html>');
});

//////////////////////////////////////////////////////
// MongoDB Base : Authentication
//////////////////////////////////////////////////////

app.post('/auth/login', function (req, res) {
    var reqjson = req.body;
    //console.log(reqjson);
    db.collection('User').find(
        {
            username:reqjson.USERNAME,
            password:reqjson.PASSWORD
        }
    ).toArray(function(e,results) {
        if(e) return next(e);
        //console.log(results);
        
        if((results!=null)&&(results.length == 1)){
            // Update new ucode and send it back
            res.json(mylib.json_success({"UID":results[0]._id,"UCODE":""}));
        }else{
            res.json(mylib.json_error("LOGIN_FAILED"));
        }
    });
});

//////////////////////////////////////////////////////
// MongoDB Base : User Management
//////////////////////////////////////////////////////



//////////////////////////////////////////////////////
// MongoDB Base : Action
//////////////////////////////////////////////////////
app.post('/lazydev/:service/:uid', function (req, res) {
    var reqjson = req.body;
    try {
        var service = require('./service/'+req.params.service);
        service.doProcess(reqjson,res,db,mylib);
    }
    catch (e) {
        if (e instanceof Error && e.code === "MODULE_NOT_FOUND"){
            console.log("Can't load service : "+req.params.service);
            res.json(mylib.json_error("LOAD_SERVICE_FAILED",' at ./service/'+req.params.service+'.js'));
        }
        else
            throw e;
    }
});

app.post('/core/:service/:uid', function (req, res) {
    var reqjson = req.body;
    try {
        var service = require('./core/'+req.params.service);
        service.doProcess(reqjson,res,db,mylib);
    }
    catch (e) {
        if (e instanceof Error && e.code === "MODULE_NOT_FOUND"){
            console.log("Can't load service : "+req.params.service);
            res.json(mylib.json_error("LOAD_SERVICE_FAILED",' at ./core/'+req.params.service+'.js'));
        }
        else
            throw e;
    }
});






http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
